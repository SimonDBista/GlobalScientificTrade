const express = require('express');
const router = express.Router();
const db = require('../../database/db');
const { authenticateAdmin } = require('../middleware/auth');

function generateInquiryNumber() {
    const year = new Date().getFullYear();
    const rand = Math.floor(1000 + Math.random() * 9000);
    return `INQ-${year}-${rand}`;
}

// POST /api/inquiries
// Public: Request a quote or submit product inquiry
router.post('/', (req, res) => {
    try {
        const {
            product_id,
            product_name,
            product_model,
            customer_name,
            customer_email,
            customer_phone,
            company_name,
            quantity = 1,
            message
        } = req.body;

        if (!customer_name || !customer_email || !customer_phone || !message) {
            return res.status(400).json({
                error: 'Please provide your Name, Email, Phone number, and Message / Requirements.'
            });
        }

        let inquiryNumber = generateInquiryNumber();
        while (db.prepare('SELECT id FROM inquiries WHERE inquiry_number = ?').get(inquiryNumber)) {
            inquiryNumber = generateInquiryNumber();
        }

        const stmt = db.prepare(`
            INSERT INTO inquiries (
                inquiry_number, product_id, product_name, product_model,
                customer_name, customer_email, customer_phone, company_name,
                quantity, message, status, created_at, updated_at
            ) VALUES (
                ?, ?, ?, ?,
                ?, ?, ?, ?,
                ?, ?, 'New', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
            )
        `);

        const result = stmt.run(
            inquiryNumber,
            product_id ? parseInt(product_id) : null,
            product_name || null,
            product_model || null,
            customer_name.trim(),
            customer_email.trim(),
            customer_phone.trim(),
            company_name ? company_name.trim() : null,
            parseInt(quantity) || 1,
            message.trim()
        );

        const created = db.prepare('SELECT * FROM inquiries WHERE id = ?').get(result.lastInsertRowid);

        res.status(201).json({
            message: 'Inquiry / Quote Request submitted successfully. Our team will contact you shortly.',
            inquiry: created
        });
    } catch (err) {
        console.error('Submit inquiry error:', err);
        res.status(500).json({ error: 'Failed to submit inquiry.' });
    }
});

// GET /api/inquiries
// Admin Only: list inquiries with status filter & search
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
            conditions.push('(inquiry_number LIKE ? OR customer_name LIKE ? OR customer_email LIKE ? OR customer_phone LIKE ? OR company_name LIKE ? OR product_name LIKE ?)');
            params.push(term, term, term, term, term, term);
        }

        const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
        const total = db.prepare(`SELECT count(*) as total FROM inquiries ${whereClause}`).get(...params).total;

        const inquiries = db.prepare(`
            SELECT * FROM inquiries
            ${whereClause}
            ORDER BY created_at DESC
            LIMIT ? OFFSET ?
        `).all(...params, parseInt(limit), parseInt(offset));

        res.json({
            inquiries,
            total,
            limit: parseInt(limit),
            offset: parseInt(offset)
        });
    } catch (err) {
        console.error('List inquiries error:', err);
        res.status(500).json({ error: 'Failed to retrieve inquiries.' });
    }
});

// GET /api/inquiries/:id (Admin Only)
router.get('/:id', authenticateAdmin, (req, res) => {
    try {
        const inquiry = db.prepare('SELECT * FROM inquiries WHERE id = ?').get(req.params.id);
        if (!inquiry) {
            return res.status(404).json({ error: 'Inquiry not found.' });
        }
        res.json({ inquiry });
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch inquiry details.' });
    }
});

// PUT /api/inquiries/:id (Admin Only)
router.put('/:id', authenticateAdmin, (req, res) => {
    try {
        const inqId = req.params.id;
        const { status, internal_notes } = req.body;

        const inquiry = db.prepare('SELECT * FROM inquiries WHERE id = ?').get(inqId);
        if (!inquiry) {
            return res.status(404).json({ error: 'Inquiry not found.' });
        }

        db.prepare(`
            UPDATE inquiries
            SET status = COALESCE(?, status),
                internal_notes = COALESCE(?, internal_notes),
                updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
        `).run(status, internal_notes, inqId);

        const updated = db.prepare('SELECT * FROM inquiries WHERE id = ?').get(inqId);
        res.json({
            message: 'Inquiry updated successfully',
            inquiry: updated
        });
    } catch (err) {
        console.error('Update inquiry error:', err);
        res.status(500).json({ error: 'Failed to update inquiry.' });
    }
});

module.exports = router;
