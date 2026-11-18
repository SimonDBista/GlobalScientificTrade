const db = require('../database/db');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

async function seed() {
    console.log('--- Starting Database Seeding ---');

    // 1. Seed Site Settings
    const defaultSettings = [
        { key: 'company_name', value: 'Global Scientific Trade Pvt. Ltd.' },
        { key: 'company_tagline', value: 'Trusted Supplier of Scientific, Engineering & Laboratory Equipment' },
        { key: 'company_address', value: 'Swayambhu, Kathmandu & Dhangadhi, Nepal' },
        { key: 'company_phone', value: 'KTM Office: +977 1-5924298 | Dhangadhi: +977 91-591014, +977 9847879700' },
        { key: 'phone_ktm', value: '+977 1-5924298' },
        { key: 'phone_dhangadhi_landline', value: '+977 91-591014' },
        { key: 'phone_dhangadhi_mobile', value: '+977 9847879700' },
        { key: 'address_ktm', value: 'Swayambhu, Kathmandu, Nepal' },
        { key: 'address_dhangadhi', value: 'Dhangadhi, Kailali, Sudurpashchim, Nepal' },
        { key: 'company_email', value: 'gsciencehouse2077@gmail.com' },
        { key: 'company_tiktok', value: 'https://tiktok.com/@gscientific2077' },
        { key: 'about_story', value: 'Global Scientific Trade Pvt. Ltd. is a premier Nepal-based supplier of high-precision laboratory, civil engineering, mathematical, and early childhood educational equipment headquartered in Swayambhu, Kathmandu. We bridge international manufacturing quality with dedicated domestic institutional service, delivering complete laboratory setups, precision instruments, and certified after-sales technical support to schools, universities, hospitals, research institutions, and engineering firms across Nepal.' },
        { key: 'facilities', value: JSON.stringify([
            'Complete Laboratory Setup & Turnkey Contracting',
            'Educational & Advanced Research Equipment',
            'Medical & Hospital Diagnostic Instruments',
            'Civil Engineering & Land Survey Tools',
            'Quality Certified Products at Competitive Pricing',
            'Institutional & Bulk Wholesale Supply',
            'Trusted After-Sales Technical & Calibration Support',
            'Reliable Nationwide Safe Delivery'
        ])},
        { key: 'announcement', value: 'Now supplying complete educational and civil engineering laboratories nationwide. Inquire online for institutional quotation.' }
    ];

    const insertSetting = db.prepare(`
        INSERT OR REPLACE INTO site_settings (key, value, updated_at)
        VALUES (@key, @value, CURRENT_TIMESTAMP)
    `);

    db.transaction(() => {
        for (const s of defaultSettings) {
            insertSetting.run(s);
        }
    })();
    console.log('✓ Site settings seeded.');

    // 2. Seed Admin User
    const adminExists = db.prepare('SELECT id FROM admins WHERE username = ?').get('admin');
    if (!adminExists) {
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync('AdminPassword2026!', salt);
        db.prepare(`
            INSERT INTO admins (username, email, password_hash, full_name, role)
            VALUES (?, ?, ?, ?, ?)
        `).run('admin', 'gsciencehouse2077@gmail.com', hash, 'System Administrator', 'admin');
        console.log('✓ Default Admin created (User: admin / Pass: AdminPassword2026!)');
    } else {
        console.log('✓ Admin already exists.');
    }

    // 3. Seed Categories
    const categoriesData = JSON.parse(fs.readFileSync(path.join(__dirname, '../scratch/seed_categories.json'), 'utf-8'));
    const insertCat = db.prepare(`
        INSERT OR IGNORE INTO categories (id, name, slug, description, icon, display_order, is_active)
        VALUES (@id, @name, @slug, @description, @icon, @display_order, @is_active)
    `);

    db.transaction(() => {
        for (const cat of categoriesData) {
            insertCat.run(cat);
        }
    })();
    console.log(`✓ ${categoriesData.length} categories seeded.`);

    // 4. Seed Products and Specifications
    const productsData = JSON.parse(fs.readFileSync(path.join(__dirname, '../scratch/seed_products.json'), 'utf-8'));
    const insertProd = db.prepare(`
        INSERT INTO products (category_id, name, slug, model_number, sku, brand, short_description, full_description, price, price_type, availability, is_featured, is_active)
        VALUES (@category_id, @name, @slug, @model_number, @sku, @brand, @short_description, @full_description, @price, @price_type, @availability, @is_featured, 1)
    `);
    const insertSpec = db.prepare(`
        INSERT INTO product_specifications (product_id, spec_name, spec_value, display_order)
        VALUES (?, ?, ?, ?)
    `);

    const existingCount = db.prepare('SELECT count(*) as count FROM products').get().count;
    if (existingCount === 0) {
        db.transaction(() => {
            for (const p of productsData) {
                const info = insertProd.run({
                    category_id: p.category_id,
                    name: p.name,
                    slug: p.slug,
                    model_number: p.model_number,
                    sku: p.sku,
                    brand: p.brand || 'Global Scientific',
                    short_description: p.short_description,
                    full_description: p.full_description,
                    price: p.price,
                    price_type: p.price_type || 'quote_only',
                    availability: p.availability || 'in_stock',
                    is_featured: p.is_featured || 0
                });
                const productId = info.lastInsertRowid;

                if (p.specs && p.specs.length > 0) {
                    p.specs.forEach((s, idx) => {
                        insertSpec.run(productId, s.spec_name, s.spec_value, idx + 1);
                    });
                }
            }
        })();
        console.log(`✓ ${productsData.length} real products & specifications seeded.`);
    } else {
        console.log(`✓ Products already exist (${existingCount} found).`);
    }

    // 5. Seed Initial Sample Orders (demonstrating order management workflow)
    const orderCount = db.prepare('SELECT count(*) as count FROM orders').get().count;
    if (orderCount === 0) {
        const sampleOrder = db.prepare(`
            INSERT INTO orders (order_number, customer_name, customer_email, customer_phone, company_name, country, city, address, customer_notes, status, subtotal, total, has_quote_items, internal_notes)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).run(
            'GST-2026-1001',
            'Bikash Shrestha',
            'bikash.eng@kathmandu-tech.edu.np',
            '9851023456',
            'Kathmandu Institute of Technology',
            'Nepal',
            'Kathmandu',
            'Balkhu Engineering Campus',
            'Please deliver with calibration certificate and institutional invoice.',
            'Confirmed',
            7250.0,
            7250.0,
            0,
            'Verified payment order by phone. Prepared for dispatch.'
        );
        const orderId = sampleOrder.lastInsertRowid;

        db.prepare(`
            INSERT INTO order_items (order_id, product_id, product_name, model_number, sku, unit_price, quantity, total_price, price_type)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).run(orderId, 1, 'Vernier Calipers I.M.E Type', 'VC-IME-150', 'SCI-PHY-001', 1850.0, 2, 3700.0, 'fixed_price');

        db.prepare(`
            INSERT INTO order_items (order_id, product_id, product_name, model_number, sku, unit_price, quantity, total_price, price_type)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).run(orderId, 5, 'Borosilicate Glass Beakers Set', 'BGL-BK-SET', 'SCI-CHM-022', 3400.0, 1, 3400.0, 'fixed_price');

        db.prepare(`
            INSERT INTO order_status_history (order_id, previous_status, new_status, changed_by, notes)
            VALUES (?, ?, ?, ?, ?)
        `).run(orderId, 'New Order', 'Confirmed', 'admin', 'Phone confirmation received from head of lab department.');

        // Seed Sample Inquiry (Quote Request)
        db.prepare(`
            INSERT INTO inquiries (inquiry_number, product_id, product_name, product_model, customer_name, customer_email, customer_phone, company_name, quantity, message, status, internal_notes)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).run(
            'INQ-2026-1001',
            8,
            'Fully Automatic Compression Testing Machine with Pace Rate Control',
            'ACTM-2000KN',
            'Er. Ramesh Thapa',
            'ramesh.thapa@himal-civil.com',
            '9841239876',
            'Himal Construction & Testing Labs',
            1,
            'We are setting up a concrete quality assurance lab in Pokhara. Please provide a formal quotation for the 2000KN compression machine including delivery, on-site installation, and calibration support.',
            'Under Review',
            'Quotation drafted with transportation to Pokhara. Waiting for technical manager sign-off.'
        );

        console.log('✓ Initial demonstration order and quote inquiry seeded.');
    }

    console.log('--- Database Seeding Complete ---');
}

seed().catch(err => {
    console.error('Seeding error:', err);
    process.exit(1);
});
