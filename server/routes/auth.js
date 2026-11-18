const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../../database/db');
const { authenticateAdmin, JWT_SECRET } = require('../middleware/auth');

// POST /api/auth/login
router.post('/login', (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password are required.' });
        }

        const admin = db.prepare('SELECT * FROM admins WHERE username = ? OR email = ?').get(username, username);
        if (!admin) {
            return res.status(401).json({ error: 'Invalid credentials.' });
        }

        const validPassword = bcrypt.compareSync(password, admin.password_hash);
        if (!validPassword) {
            return res.status(401).json({ error: 'Invalid credentials.' });
        }

        const token = jwt.sign(
            { id: admin.id, username: admin.username, email: admin.email, role: admin.role },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            message: 'Login successful',
            token,
            admin: {
                id: admin.id,
                username: admin.username,
                email: admin.email,
                full_name: admin.full_name,
                role: admin.role
            }
        });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ error: 'Internal server error during login.' });
    }
});

// GET /api/auth/me
router.get('/me', authenticateAdmin, (req, res) => {
    try {
        const admin = db.prepare('SELECT id, username, email, full_name, role, created_at FROM admins WHERE id = ?').get(req.admin.id);
        if (!admin) {
            return res.status(404).json({ error: 'Admin account not found.' });
        }
        res.json({ admin });
    } catch (err) {
        res.status(500).json({ error: 'Failed to retrieve admin profile.' });
    }
});

// PUT /api/auth/profile
router.put('/profile', authenticateAdmin, (req, res) => {
    try {
        const { full_name, email, current_password, new_password } = req.body;
        const admin = db.prepare('SELECT * FROM admins WHERE id = ?').get(req.admin.id);

        if (!admin) {
            return res.status(404).json({ error: 'Admin account not found.' });
        }

        let newHash = admin.password_hash;
        if (new_password) {
            if (!current_password) {
                return res.status(400).json({ error: 'Current password is required to set a new password.' });
            }
            if (!bcrypt.compareSync(current_password, admin.password_hash)) {
                return res.status(400).json({ error: 'Current password does not match.' });
            }
            if (new_password.length < 8) {
                return res.status(400).json({ error: 'New password must be at least 8 characters long.' });
            }
            newHash = bcrypt.hashSync(new_password, 10);
        }

        db.prepare(`
            UPDATE admins
            SET full_name = COALESCE(?, full_name),
                email = COALESCE(?, email),
                password_hash = ?,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
        `).run(full_name, email, newHash, admin.id);

        res.json({ message: 'Profile updated successfully.' });
    } catch (err) {
        console.error('Update profile error:', err);
        res.status(500).json({ error: 'Failed to update profile.' });
    }
});

module.exports = router;
