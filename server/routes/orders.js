const express = require('express');
const router = express.Router();
const db = require('../../database/db');
const { authenticateAdmin } = require('../middleware/auth');

function generateOrderNumber() {
    const year = new Date().getFullYear();
    const random = Math.floor(1000 + Math.random() * 9000);
    return `GST-${year}-${random}`;
}

// POST /api/orders
// Public: Submit checkout order without requiring user login
router.post('/', (req, res) => {
    try {
        const {
            customer_name,
            customer_email,
            customer_phone,
            company_name,
            country = 'Nepal',
            city,
            address,
            customer_notes,
            items = []
        } = req.body;

        // Validation
        if (!customer_name || !customer_email || !customer_phone || !city || !address) {
            return res.status(400).json({
                error: 'Please fill in all required customer fields: Name, Email, Phone, City, and Address.'
            });
        }

        if (!Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ error: 'Order must contain at least one item.' });
        }

        let subtotal = 0;
        let has_quote_items = 0;

        const validatedItems = items.map(item => {
            const qty = parseInt(item.quantity) || 1;
            const price = item.price !== null && item.price !== undefined && item.price !== '' ? parseFloat(item.price) : null;
            let totalItemPrice = null;

            if (price !== null && !isNaN(price)) {
                totalItemPrice = price * qty;
                subtotal += totalItemPrice;
            } else {
                has_quote_items = 1;
            }

            return {
                product_id: item.product_id ? parseInt(item.product_id) : null,
                product_name: item.name || item.product_name || 'Product',
                model_number: item.model_number || null,
                sku: item.sku || null,
                unit_price: price,
                quantity: qty,
                total_price: totalItemPrice,
                price_type: item.price_type || (price ? 'fixed_price' : 'quote_only')
            };
        });

        let orderNumber = generateOrderNumber();
        while (db.prepare('SELECT id FROM orders WHERE order_number = ?').get(orderNumber)) {
            orderNumber = generateOrderNumber();
        }

        let newOrderId;
        db.transaction(() => {
            const insertOrder = db.prepare(`
                INSERT INTO orders (
                    order_number, customer_name, customer_email, customer_phone,
                    company_name, country, city, address, customer_notes,
                    order_type, status, subtotal, total, has_quote_items,
                    created_at, updated_at
                ) VALUES (
                    ?, ?, ?, ?,
                    ?, ?, ?, ?, ?,
                    ?, 'New Order', ?, ?, ?,
                    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
                )
            `);

            const orderResult = insertOrder.run(
                orderNumber,
                customer_name.trim(),
                customer_email.trim(),
                customer_phone.trim(),
                company_name ? company_name.trim() : null,
                country ? country.trim() : 'Nepal',
                city.trim(),
                address.trim(),
                customer_notes ? customer_notes.trim() : null,
                has_quote_items ? 'quote_checkout' : 'order',
                subtotal,
                subtotal, // Tax/shipping handled per institutional quote
                has_quote_items
            );
            newOrderId = orderResult.lastInsertRowid;

            const insertItem = db.prepare(`
                INSERT INTO order_items (
                    order_id, product_id, product_name, model_number, sku,
                    unit_price, quantity, total_price, price_type
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            `);

            for (const it of validatedItems) {
                insertItem.run(
                    newOrderId,
                    it.product_id,
                    it.product_name,
                    it.model_number,
                    it.sku,
                    it.unit_price,
                    it.quantity,
                    it.total_price,
                    it.price_type
                );
            }

            // Record initial history
            db.prepare(`
                INSERT INTO order_status_history (order_id, previous_status, new_status, changed_by, notes)
                VALUES (?, NULL, 'New Order', 'Customer', 'Order submitted via website checkout.')
            `).run(newOrderId);
        })();

        const createdOrder = db.prepare('SELECT * FROM orders WHERE id = ?').get(newOrderId);
        const orderItems = db.prepare('SELECT * FROM order_items WHERE order_id = ?').all(newOrderId);

        res.status(201).json({
            message: 'Order placed successfully',
            order: createdOrder,
            items: orderItems
        });
    } catch (err) {
        console.error('Submit order error:', err);
        res.status(500).json({ error: 'Failed to process order submission.' });
    }
});

// GET /api/orders
// Admin Only: list orders with filtering, search, and pagination
router.get('/', authenticateAdmin, (req, res) => {
    try {
        const { status, search, limit = 50, offset = 0 } = req.query;

        let conditions = [];
        let params = [];

        if (status && status !== 'all') {
            conditions.push('status = ?');
            params.push(status);
        }

        if (search && search.trim() !== '') {
            const term = `%${search.trim()}%`;
            conditions.push('(order_number LIKE ? OR customer_name LIKE ? OR customer_email LIKE ? OR customer_phone LIKE ? OR company_name LIKE ?)');
            params.push(term, term, term, term, term);
        }

        const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

        const total = db.prepare(`SELECT count(*) as total FROM orders ${whereClause}`).get(...params).total;

        const orders = db.prepare(`
            SELECT o.*,
                   (SELECT COUNT(*) FROM order_items WHERE order_id = o.id) as item_count
            FROM orders o
            ${whereClause}
            ORDER BY o.created_at DESC
            LIMIT ? OFFSET ?
        `).all(...params, parseInt(limit), parseInt(offset));

        res.json({
            orders,
            total,
            limit: parseInt(limit),
            offset: parseInt(offset)
        });
    } catch (err) {
        console.error('List orders error:', err);
        res.status(500).json({ error: 'Failed to retrieve orders.' });
    }
});

// GET /api/orders/:identifier (id or order_number)
// Can be accessed by admin or with order_number for customer confirmation
router.get('/:identifier', (req, res) => {
    try {
        const identifier = req.params.identifier;
        let order;
        if (/^\d+$/.test(identifier)) {
            order = db.prepare('SELECT * FROM orders WHERE id = ?').get(parseInt(identifier));
        } else {
            order = db.prepare('SELECT * FROM orders WHERE order_number = ?').get(identifier);
        }

        if (!order) {
            return res.status(404).json({ error: 'Order not found.' });
        }

        const items = db.prepare('SELECT * FROM order_items WHERE order_id = ?').all(order.id);
        const history = db.prepare('SELECT * FROM order_status_history WHERE order_id = ? ORDER BY created_at ASC').all(order.id);

        res.json({
            order,
            items,
            history
        });
    } catch (err) {
        console.error('Get order error:', err);
        res.status(500).json({ error: 'Failed to retrieve order details.' });
    }
});

// PUT /api/orders/:id/status (Admin Only)
router.put('/:id/status', authenticateAdmin, (req, res) => {
    try {
        const orderId = req.params.id;
        const { status, notes } = req.body;

        const validStatuses = [
            'New Order',
            'Under Review',
            'Contacted',
            'Quotation Sent',
            'Confirmed',
            'Processing',
            'Completed',
            'Cancelled'
        ];

        if (!status || !validStatuses.includes(status)) {
            return res.status(400).json({ error: 'Invalid order status option.' });
        }

        const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(orderId);
        if (!order) {
            return res.status(404).json({ error: 'Order not found.' });
        }

        const previousStatus = order.status;

        db.transaction(() => {
            db.prepare(`
                UPDATE orders
                SET status = ?,
                    updated_at = CURRENT_TIMESTAMP
                WHERE id = ?
            `).run(status, orderId);

            db.prepare(`
                INSERT INTO order_status_history (order_id, previous_status, new_status, changed_by, notes)
                VALUES (?, ?, ?, ?, ?)
            `).run(
                orderId,
                previousStatus,
                status,
                req.admin.username || 'Admin',
                notes || `Status changed from ${previousStatus} to ${status}`
            );
        })();

        res.json({
            message: `Order status updated to ${status}`,
            new_status: status
        });
    } catch (err) {
        console.error('Update order status error:', err);
        res.status(500).json({ error: 'Failed to update order status.' });
    }
});

// PUT /api/orders/:id/notes (Admin Only)
router.put('/:id/notes', authenticateAdmin, (req, res) => {
    try {
        const orderId = req.params.id;
        const { internal_notes } = req.body;

        db.prepare(`
            UPDATE orders
            SET internal_notes = ?,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
        `).run(internal_notes || '', orderId);

        res.json({ message: 'Internal notes saved successfully.' });
    } catch (err) {
        console.error('Update order notes error:', err);
        res.status(500).json({ error: 'Failed to save notes.' });
    }
});

module.exports = router;
