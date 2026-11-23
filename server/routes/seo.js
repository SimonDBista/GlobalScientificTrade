const express = require('express');
const router = express.Router();
const db = require('../../database/db');

const BASE_URL = 'https://globalscientifictrade.com.np';

function xmlEscape(str) {
    return String(str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function formatDate(d) {
    if (!d) return new Date().toISOString().split('T')[0];
    try { return new Date(d).toISOString().split('T')[0]; } catch { return new Date().toISOString().split('T')[0]; }
}

// GET /sitemap.xml
router.get('/sitemap.xml', (req, res) => {
    try {
        const categories = db.prepare('SELECT slug, updated_at FROM categories WHERE is_active = 1').all();
        const products = db.prepare('SELECT slug, id, updated_at FROM products WHERE is_active = 1').all();

        const staticPages = [
            { url: '/', priority: '1.0', changefreq: 'weekly' },
            { url: '/about', priority: '0.8', changefreq: 'monthly' },
            { url: '/products', priority: '0.9', changefreq: 'daily' },
            { url: '/contact', priority: '0.7', changefreq: 'monthly' },
        ];

        let urls = '';

        staticPages.forEach(p => {
            urls += `
  <url>
    <loc>${BASE_URL}${p.url}</loc>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`;
        });

        categories.forEach(cat => {
            urls += `
  <url>
    <loc>${BASE_URL}/category/${xmlEscape(cat.slug)}</loc>
    <lastmod>${formatDate(cat.updated_at)}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
        });

        products.forEach(prod => {
            urls += `
  <url>
    <loc>${BASE_URL}/products/${xmlEscape(prod.slug || prod.id)}</loc>
    <lastmod>${formatDate(prod.updated_at)}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`;
        });

        const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}
</urlset>`;

        res.setHeader('Content-Type', 'application/xml');
        res.setHeader('Cache-Control', 'public, max-age=3600');
        res.send(xml);
    } catch (err) {
        console.error('Sitemap error:', err);
        res.status(500).send('<!-- sitemap generation failed -->');
    }
});

// GET /robots.txt
router.get('/robots.txt', (req, res) => {
    const robots = `User-agent: *
Allow: /

# Disallow admin and API
Disallow: /admin
Disallow: /api/

# Sitemap
Sitemap: ${BASE_URL}/sitemap.xml
`;
    res.setHeader('Content-Type', 'text/plain');
    res.send(robots);
});

module.exports = router;
