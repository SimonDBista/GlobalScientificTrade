const express = require('express');
const router = express.Router();
const db = require('../../database/db');
const { authenticateAdmin } = require('../middleware/auth');

// GET /api/content
// Public: returns site configuration and content
router.get('/', (req, res) => {
    try {
        const rows = db.prepare('SELECT key, value FROM site_settings').all();
        const settings = {};
        for (const row of rows) {
            try {
                settings[row.key] = JSON.parse(row.value);
            } catch {
                settings[row.key] = row.value;
            }
        }
        res.json({ settings });
    } catch (err) {
        console.error('Fetch settings error:', err);
        res.status(500).json({ error: 'Failed to fetch site content settings.' });
    }
});

// PUT /api/content (Admin Only)
// Update settings
router.put('/', authenticateAdmin, (req, res) => {
    try {
        const { settings } = req.body;
        if (!settings || typeof settings !== 'object') {
            return res.status(400).json({ error: 'Invalid settings payload.' });
        }

        const upsert = db.prepare(`
            INSERT INTO site_settings (key, value, updated_at)
            VALUES (?, ?, CURRENT_TIMESTAMP)
            ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = CURRENT_TIMESTAMP
        `);

        db.transaction(() => {
            for (const [key, val] of Object.entries(settings)) {
                const strVal = typeof val === 'object' ? JSON.stringify(val) : String(val);
                upsert.run(key, strVal);
            }
        })();

        res.json({ message: 'Website content settings updated successfully.' });
    } catch (err) {
        console.error('Update settings error:', err);
        res.status(500).json({ error: 'Failed to update website content settings.' });
    }
});

// GET /api/content/dashboard-stats (Admin Only)
router.get('/dashboard-stats', authenticateAdmin, (req, res) => {
    try {
        const totalProducts = db.prepare('SELECT COUNT(*) as count FROM products').get().count;
        const totalCategories = db.prepare('SELECT COUNT(*) as count FROM categories').get().count;
        const totalOrders = db.prepare('SELECT COUNT(*) as count FROM orders').get().count;
        const newOrders = db.prepare("SELECT COUNT(*) as count FROM orders WHERE status = 'New Order'").get().count;
        const pendingOrders = db.prepare("SELECT COUNT(*) as count FROM orders WHERE status IN ('Under Review', 'Processing', 'Quotation Sent')").get().count;
        const completedOrders = db.prepare("SELECT COUNT(*) as count FROM orders WHERE status = 'Completed'").get().count;

        const totalInquiries = db.prepare('SELECT COUNT(*) as count FROM inquiries').get().count;
        const newInquiries = db.prepare("SELECT COUNT(*) as count FROM inquiries WHERE status = 'New'").get().count;

        const recentOrders = db.prepare(`
            SELECT id, order_number, customer_name, customer_email, total, status, created_at
            FROM orders
            ORDER BY created_at DESC
            LIMIT 6
        `).all();

        const recentInquiries = db.prepare(`
            SELECT id, inquiry_number, product_name, customer_name, customer_phone, status, created_at
            FROM inquiries
            ORDER BY created_at DESC
            LIMIT 6
        `).all();

        // Orders by status summary
        const ordersByStatus = db.prepare(`
            SELECT status, COUNT(*) as count
            FROM orders
            GROUP BY status
        `).all();

        res.json({
            stats: {
                totalProducts,
                totalCategories,
                totalOrders,
                newOrders,
                pendingOrders,
                completedOrders,
                totalInquiries,
                newInquiries
            },
            recentOrders,
            recentInquiries,
            ordersByStatus
        });
    } catch (err) {
        console.error('Dashboard stats error:', err);
        res.status(500).json({ error: 'Failed to load dashboard metrics.' });
    }
});

module.exports = router;
