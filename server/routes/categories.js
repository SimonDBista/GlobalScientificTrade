const express = require('express');
const router = express.Router();
const db = require('../../database/db');
const { authenticateAdmin } = require('../middleware/auth');

// Helper to generate a slug from string
function slugify(text) {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-');
}

// GET /api/categories
// Public: returns active categories. If ?all=true and admin token, returns all.
router.get('/', (req, res) => {
    try {
        const showAll = req.query.all === 'true';
        let query;
        if (showAll) {
            query = `
                SELECT c.*, COUNT(p.id) as product_count
                FROM categories c
                LEFT JOIN products p ON p.category_id = c.id AND p.is_active = 1
                GROUP BY c.id
                ORDER BY c.display_order ASC, c.name ASC
            `;
        } else {
            query = `
                SELECT c.*, COUNT(p.id) as product_count
                FROM categories c
                LEFT JOIN products p ON p.category_id = c.id AND p.is_active = 1
                WHERE c.is_active = 1
                GROUP BY c.id
                ORDER BY c.display_order ASC, c.name ASC
            `;
        }

        const categories = db.prepare(query).all();
        res.json({ categories });
    } catch (err) {
        console.error('Fetch categories error:', err);
        res.status(500).json({ error: 'Failed to fetch categories.' });
    }
});

// GET /api/categories/:slug
router.get('/:slug', (req, res) => {
    try {
        const category = db.prepare(`
            SELECT c.*, COUNT(p.id) as product_count
            FROM categories c
            LEFT JOIN products p ON p.category_id = c.id AND p.is_active = 1
            WHERE c.slug = ?
            GROUP BY c.id
        `).get(req.params.slug);

        if (!category) {
            return res.status(404).json({ error: 'Category not found.' });
        }

        res.json({ category });
    } catch (err) {
        console.error('Fetch category error:', err);
        res.status(500).json({ error: 'Failed to fetch category.' });
    }
});

// POST /api/categories (Admin Only)
router.post('/', authenticateAdmin, (req, res) => {
    try {
        let { name, slug, description, icon, image_url, thumbnail_url, display_order, is_active } = req.body;
        if (!name) {
            return res.status(400).json({ error: 'Category name is required.' });
        }

        if (!thumbnail_url && image_url && image_url.includes('.webp') && !image_url.includes('-thumb.webp')) {
            thumbnail_url = image_url.replace('.webp', '-thumb.webp');
        }

        if (!slug || slug.trim() === '') {
            slug = slugify(name);
        } else {
            slug = slugify(slug);
        }

        // Check if slug exists
        const existing = db.prepare('SELECT id FROM categories WHERE slug = ?').get(slug);
        if (existing) {
            slug = `${slug}-${Date.now().toString().slice(-4)}`;
        }

        const stmt = db.prepare(`
            INSERT INTO categories (name, slug, description, icon, image_url, thumbnail_url, display_order, is_active, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        `);

        const result = stmt.run(
            name,
            slug,
            description || '',
            icon || 'Layers',
            image_url || null,
            thumbnail_url || null,
            display_order ? parseInt(display_order) : 0,
            is_active !== undefined ? (is_active ? 1 : 0) : 1
        );

        const newCategory = db.prepare('SELECT * FROM categories WHERE id = ?').get(result.lastInsertRowid);
        res.status(201).json({
            message: 'Category created successfully',
            category: newCategory
        });
    } catch (err) {
        console.error('Create category error:', err);
        res.status(500).json({ error: 'Failed to create category.' });
    }
});

// PUT /api/categories/:id (Admin Only)
router.put('/:id', authenticateAdmin, (req, res) => {
    try {
        const catId = req.params.id;
        const current = db.prepare('SELECT * FROM categories WHERE id = ?').get(catId);
        if (!current) {
            return res.status(404).json({ error: 'Category not found.' });
        }

        let { name, slug, description, icon, image_url, thumbnail_url, display_order, is_active } = req.body;
        if (!name) name = current.name;

        if (image_url && !thumbnail_url && image_url.includes('.webp') && !image_url.includes('-thumb.webp')) {
            thumbnail_url = image_url.replace('.webp', '-thumb.webp');
        }

        if (slug && slug !== current.slug) {
            slug = slugify(slug);
            const existing = db.prepare('SELECT id FROM categories WHERE slug = ? AND id != ?').get(slug, catId);
            if (existing) {
                slug = `${slug}-${Date.now().toString().slice(-4)}`;
            }
        } else {
            slug = current.slug;
        }

        db.prepare(`
            UPDATE categories
            SET name = ?,
                slug = ?,
                description = ?,
                icon = ?,
                image_url = ?,
                thumbnail_url = ?,
                display_order = ?,
                is_active = ?,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
        `).run(
            name,
            slug,
            description !== undefined ? description : current.description,
            icon !== undefined ? icon : current.icon,
            image_url !== undefined ? image_url : current.image_url,
            thumbnail_url !== undefined ? thumbnail_url : current.thumbnail_url,
            display_order !== undefined ? parseInt(display_order) : current.display_order,
            is_active !== undefined ? (is_active ? 1 : 0) : current.is_active,
            catId
        );

        const updated = db.prepare('SELECT * FROM categories WHERE id = ?').get(catId);
        res.json({
            message: 'Category updated successfully',
            category: updated
        });
    } catch (err) {
        console.error('Update category error:', err);
        res.status(500).json({ error: 'Failed to update category.' });
    }
});

// DELETE /api/categories/:id (Admin Only)
router.delete('/:id', authenticateAdmin, (req, res) => {
    try {
        const catId = req.params.id;
        const category = db.prepare('SELECT * FROM categories WHERE id = ?').get(catId);
        if (!category) {
            return res.status(404).json({ error: 'Category not found.' });
        }

        // Check if products exist in category
        const prodCount = db.prepare('SELECT count(*) as count FROM products WHERE category_id = ?').get(catId).count;
        if (prodCount > 0) {
            return res.status(400).json({
                error: `Cannot delete category containing ${prodCount} products. Please reassign or delete the products first.`
            });
        }

        db.prepare('DELETE FROM categories WHERE id = ?').run(catId);
        res.json({ message: 'Category deleted successfully.' });
    } catch (err) {
        console.error('Delete category error:', err);
        res.status(500).json({ error: 'Failed to delete category.' });
    }
});

module.exports = router;
