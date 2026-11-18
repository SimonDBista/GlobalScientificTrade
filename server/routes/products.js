const express = require('express');
const router = express.Router();
const db = require('../../database/db');
const { authenticateAdmin } = require('../middleware/auth');

function slugify(text) {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-');
}

// GET /api/products
// Public: list products with filtering, search, sorting, and pagination
router.get('/', (req, res) => {
    try {
        const {
            category_id,
            category_slug,
            search,
            featured,
            price_type,
            availability,
            sort = 'featured',
            limit = 50,
            offset = 0,
            all = 'false'
        } = req.query;

        let conditions = [];
        let params = [];

        // If not requesting 'all=true' (which is for admin), only show active products
        if (all !== 'true') {
            conditions.push('p.is_active = 1');
        }

        if (category_id) {
            conditions.push('p.category_id = ?');
            params.push(parseInt(category_id));
        }

        if (category_slug) {
            conditions.push('c.slug = ?');
            params.push(category_slug);
        }

        if (search && search.trim() !== '') {
            const searchTerm = `%${search.trim()}%`;
            conditions.push('(p.name LIKE ? OR p.model_number LIKE ? OR p.sku LIKE ? OR p.short_description LIKE ? OR p.full_description LIKE ?)');
            params.push(searchTerm, searchTerm, searchTerm, searchTerm, searchTerm);
        }

        if (featured === 'true' || featured === '1') {
            conditions.push('p.is_featured = 1');
        }

        if (price_type) {
            conditions.push('p.price_type = ?');
            params.push(price_type);
        }

        if (availability) {
            conditions.push('p.availability = ?');
            params.push(availability);
        }

        const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

        // Sorting options
        let orderBy = 'p.is_featured DESC, p.created_at DESC';
        if (sort === 'price_asc') {
            orderBy = 'CASE WHEN p.price IS NULL THEN 1 ELSE 0 END, p.price ASC';
        } else if (sort === 'price_desc') {
            orderBy = 'CASE WHEN p.price IS NULL THEN 1 ELSE 0 END, p.price DESC';
        } else if (sort === 'name_asc') {
            orderBy = 'p.name ASC';
        } else if (sort === 'name_desc') {
            orderBy = 'p.name DESC';
        } else if (sort === 'newest') {
            orderBy = 'p.created_at DESC';
        }

        const totalQuery = `
            SELECT COUNT(p.id) as total
            FROM products p
            LEFT JOIN categories c ON c.id = p.category_id
            ${whereClause}
        `;
        const total = db.prepare(totalQuery).get(...params).total;

        const query = `
            SELECT p.*, c.name as category_name, c.slug as category_slug
            FROM products p
            LEFT JOIN categories c ON c.id = p.category_id
            ${whereClause}
            ORDER BY ${orderBy}
            LIMIT ? OFFSET ?
        `;

        const products = db.prepare(query).all(...params, parseInt(limit), parseInt(offset));

        res.json({
            products,
            total,
            limit: parseInt(limit),
            offset: parseInt(offset)
        });
    } catch (err) {
        console.error('Fetch products error:', err);
        res.status(500).json({ error: 'Failed to fetch products.' });
    }
});

// GET /api/products/:identifier (slug or id)
router.get('/:identifier', (req, res) => {
    try {
        const identifier = req.params.identifier;
        let product;
        if (/^\d+$/.test(identifier)) {
            product = db.prepare(`
                SELECT p.*, c.name as category_name, c.slug as category_slug
                FROM products p
                LEFT JOIN categories c ON c.id = p.category_id
                WHERE p.id = ?
            `).get(parseInt(identifier));
        } else {
            product = db.prepare(`
                SELECT p.*, c.name as category_name, c.slug as category_slug
                FROM products p
                LEFT JOIN categories c ON c.id = p.category_id
                WHERE p.slug = ?
            `).get(identifier);
        }

        if (!product) {
            return res.status(404).json({ error: 'Product not found.' });
        }

        // Fetch specifications
        const specifications = db.prepare(`
            SELECT spec_name, spec_value
            FROM product_specifications
            WHERE product_id = ?
            ORDER BY display_order ASC, id ASC
        `).all(product.id);

        // Fetch gallery images
        const gallery = db.prepare(`
            SELECT image_url, display_order
            FROM product_images
            WHERE product_id = ?
            ORDER BY display_order ASC, id ASC
        `).all(product.id);

        // Fetch related products in the same category
        const related = db.prepare(`
            SELECT p.id, p.name, p.slug, p.model_number, p.sku, p.short_description, p.price, p.price_type, p.availability, p.primary_image, c.name as category_name, c.slug as category_slug
            FROM products p
            LEFT JOIN categories c ON c.id = p.category_id
            WHERE p.category_id = ? AND p.id != ? AND p.is_active = 1
            LIMIT 4
        `).all(product.category_id, product.id);

        res.json({
            product: {
                ...product,
                specifications,
                gallery
            },
            related
        });
    } catch (err) {
        console.error('Fetch product detail error:', err);
        res.status(500).json({ error: 'Failed to fetch product detail.' });
    }
});

// POST /api/products (Admin Only)
router.post('/', authenticateAdmin, (req, res) => {
    try {
        let {
            category_id,
            name,
            slug,
            model_number,
            sku,
            brand = 'Global Scientific',
            short_description,
            full_description,
            price,
            price_type = 'quote_only',
            availability = 'in_stock',
            is_featured = 0,
            is_active = 1,
            primary_image,
            thumbnail_image,
            specifications = [],
            gallery = []
        } = req.body;

        if (!thumbnail_image && primary_image && primary_image.includes('.webp') && !primary_image.includes('-thumb.webp')) {
            thumbnail_image = primary_image.replace('.webp', '-thumb.webp');
        }

        if (!name || !category_id) {
            return res.status(400).json({ error: 'Product name and category are required.' });
        }

        if (!slug || slug.trim() === '') {
            slug = slugify(name);
        } else {
            slug = slugify(slug);
        }

        // Ensure unique slug
        const existing = db.prepare('SELECT id FROM products WHERE slug = ?').get(slug);
        if (existing) {
            slug = `${slug}-${Date.now().toString().slice(-4)}`;
        }

        const insertProd = db.prepare(`
            INSERT INTO products (
                category_id, name, slug, model_number, sku, brand,
                short_description, full_description, price, price_type,
                availability, is_featured, is_active, primary_image, thumbnail_image,
                created_at, updated_at
            ) VALUES (
                ?, ?, ?, ?, ?, ?,
                ?, ?, ?, ?,
                ?, ?, ?, ?, ?,
                CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
            )
        `);

        const insertSpec = db.prepare(`
            INSERT INTO product_specifications (product_id, spec_name, spec_value, display_order)
            VALUES (?, ?, ?, ?)
        `);

        const insertImg = db.prepare(`
            INSERT INTO product_images (product_id, image_url, display_order)
            VALUES (?, ?, ?)
        `);

        let newProductId;
        db.transaction(() => {
            const result = insertProd.run(
                category_id,
                name,
                slug,
                model_number || null,
                sku || null,
                brand || 'Global Scientific',
                short_description || null,
                full_description || null,
                price !== undefined && price !== '' && price !== null ? parseFloat(price) : null,
                price_type,
                availability,
                is_featured ? 1 : 0,
                is_active !== undefined ? (is_active ? 1 : 0) : 1,
                primary_image || null,
                thumbnail_image || null
            );
            newProductId = result.lastInsertRowid;

            if (Array.isArray(specifications)) {
                specifications.forEach((spec, idx) => {
                    if (spec.spec_name && spec.spec_value) {
                        insertSpec.run(newProductId, spec.spec_name.trim(), spec.spec_value.trim(), idx + 1);
                    }
                });
            }

            if (Array.isArray(gallery)) {
                gallery.forEach((imgUrl, idx) => {
                    if (imgUrl && typeof imgUrl === 'string') {
                        insertImg.run(newProductId, imgUrl.trim(), idx + 1);
                    }
                });
            }
        })();

        const created = db.prepare('SELECT * FROM products WHERE id = ?').get(newProductId);
        res.status(201).json({
            message: 'Product created successfully',
            product: created
        });
    } catch (err) {
        console.error('Create product error:', err);
        res.status(500).json({ error: 'Failed to create product.' });
    }
});

// PUT /api/products/:id (Admin Only)
router.put('/:id', authenticateAdmin, (req, res) => {
    try {
        const prodId = req.params.id;
        const current = db.prepare('SELECT * FROM products WHERE id = ?').get(prodId);
        if (!current) {
            return res.status(404).json({ error: 'Product not found.' });
        }

        let {
            category_id = current.category_id,
            name = current.name,
            slug,
            model_number = current.model_number,
            sku = current.sku,
            brand = current.brand,
            short_description = current.short_description,
            full_description = current.full_description,
            price,
            price_type = current.price_type,
            availability = current.availability,
            is_featured,
            is_active,
            primary_image,
            thumbnail_image,
            specifications,
            gallery
        } = req.body;

        if (primary_image && !thumbnail_image && primary_image.includes('.webp') && !primary_image.includes('-thumb.webp')) {
            thumbnail_image = primary_image.replace('.webp', '-thumb.webp');
        }

        if (slug && slug !== current.slug) {
            slug = slugify(slug);
            const existing = db.prepare('SELECT id FROM products WHERE slug = ? AND id != ?').get(slug, prodId);
            if (existing) {
                slug = `${slug}-${Date.now().toString().slice(-4)}`;
            }
        } else {
            slug = current.slug;
        }

        const parsedPrice = price !== undefined && price !== '' && price !== null ? parseFloat(price) : null;

        db.transaction(() => {
            db.prepare(`
                UPDATE products
                SET category_id = ?,
                    name = ?,
                    slug = ?,
                    model_number = ?,
                    sku = ?,
                    brand = ?,
                    short_description = ?,
                    full_description = ?,
                    price = ?,
                    price_type = ?,
                    availability = ?,
                    is_featured = ?,
                    is_active = ?,
                    primary_image = ?,
                    thumbnail_image = ?,
                    updated_at = CURRENT_TIMESTAMP
                WHERE id = ?
            `).run(
                category_id,
                name,
                slug,
                model_number,
                sku,
                brand,
                short_description,
                full_description,
                parsedPrice,
                price_type,
                availability,
                is_featured !== undefined ? (is_featured ? 1 : 0) : current.is_featured,
                is_active !== undefined ? (is_active ? 1 : 0) : current.is_active,
                primary_image !== undefined ? primary_image : current.primary_image,
                thumbnail_image !== undefined ? thumbnail_image : current.thumbnail_image,
                prodId
            );

            // Update specifications if provided
            if (Array.isArray(specifications)) {
                db.prepare('DELETE FROM product_specifications WHERE product_id = ?').run(prodId);
                const insertSpec = db.prepare(`
                    INSERT INTO product_specifications (product_id, spec_name, spec_value, display_order)
                    VALUES (?, ?, ?, ?)
                `);
                specifications.forEach((spec, idx) => {
                    if (spec.spec_name && spec.spec_value) {
                        insertSpec.run(prodId, spec.spec_name.trim(), spec.spec_value.trim(), idx + 1);
                    }
                });
            }

            // Update gallery if provided
            if (Array.isArray(gallery)) {
                db.prepare('DELETE FROM product_images WHERE product_id = ?').run(prodId);
                const insertImg = db.prepare(`
                    INSERT INTO product_images (product_id, image_url, display_order)
                    VALUES (?, ?, ?)
                `);
                gallery.forEach((imgUrl, idx) => {
                    if (imgUrl && typeof imgUrl === 'string') {
                        insertImg.run(prodId, imgUrl.trim(), idx + 1);
                    }
                });
            }
        })();

        const updated = db.prepare('SELECT * FROM products WHERE id = ?').get(prodId);
        res.json({
            message: 'Product updated successfully',
            product: updated
        });
    } catch (err) {
        console.error('Update product error:', err);
        res.status(500).json({ error: 'Failed to update product.' });
    }
});

// POST /api/products/:id/duplicate (Admin Only)
router.post('/:id/duplicate', authenticateAdmin, (req, res) => {
    try {
        const prodId = req.params.id;
        const original = db.prepare('SELECT * FROM products WHERE id = ?').get(prodId);
        if (!original) {
            return res.status(404).json({ error: 'Original product not found.' });
        }

        const newName = `${original.name} (Copy)`;
        const newSlug = slugify(newName) + '-' + Date.now().toString().slice(-4);
        const newSku = original.sku ? `${original.sku}-COPY` : null;

        let newProductId;
        db.transaction(() => {
            const result = db.prepare(`
                INSERT INTO products (
                    category_id, name, slug, model_number, sku, brand,
                    short_description, full_description, price, price_type,
                    availability, is_featured, is_active, primary_image, thumbnail_image
                ) VALUES (
                    ?, ?, ?, ?, ?, ?,
                    ?, ?, ?, ?,
                    ?, ?, ?, ?, ?
                )
            `).run(
                original.category_id,
                newName,
                newSlug,
                original.model_number,
                newSku,
                original.brand,
                original.short_description,
                original.full_description,
                original.price,
                original.price_type,
                original.availability,
                original.is_featured,
                original.is_active,
                original.primary_image,
                original.thumbnail_image
            );
            newProductId = result.lastInsertRowid;

            // Copy specs
            const specs = db.prepare('SELECT spec_name, spec_value, display_order FROM product_specifications WHERE product_id = ?').all(prodId);
            const insertSpec = db.prepare('INSERT INTO product_specifications (product_id, spec_name, spec_value, display_order) VALUES (?, ?, ?, ?)');
            specs.forEach(s => insertSpec.run(newProductId, s.spec_name, s.spec_value, s.display_order));

            // Copy images
            const images = db.prepare('SELECT image_url, display_order FROM product_images WHERE product_id = ?').all(prodId);
            const insertImg = db.prepare('INSERT INTO product_images (product_id, image_url, display_order) VALUES (?, ?, ?)');
            images.forEach(img => insertImg.run(newProductId, img.image_url, img.display_order));
        })();

        const duplicated = db.prepare('SELECT * FROM products WHERE id = ?').get(newProductId);
        res.status(201).json({
            message: 'Product duplicated successfully',
            product: duplicated
        });
    } catch (err) {
        console.error('Duplicate product error:', err);
        res.status(500).json({ error: 'Failed to duplicate product.' });
    }
});

// DELETE /api/products/:id (Admin Only)
router.delete('/:id', authenticateAdmin, (req, res) => {
    try {
        const prodId = req.params.id;
        const product = db.prepare('SELECT * FROM products WHERE id = ?').get(prodId);
        if (!product) {
            return res.status(404).json({ error: 'Product not found.' });
        }

        db.prepare('DELETE FROM products WHERE id = ?').run(prodId);
        res.json({ message: 'Product deleted successfully.' });
    } catch (err) {
        console.error('Delete product error:', err);
        res.status(500).json({ error: 'Failed to delete product.' });
    }
});

module.exports = router;
