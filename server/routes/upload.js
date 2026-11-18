const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { authenticateAdmin } = require('../middleware/auth');
const { optimizeAndStoreImage } = require('../services/imageOptimizer');

// Use in-memory buffer storage so oversized raw files are never stored permanently on disk
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
    const allowedExtensions = /jpeg|jpg|png|webp|gif|avif|tiff|bmp/;
    const ext = allowedExtensions.test(path.extname(file.originalname).toLowerCase());
    const mime = allowedExtensions.test(file.mimetype) || file.mimetype.startsWith('image/');

    if (ext || mime) {
        cb(null, true);
    } else {
        cb(new Error('Invalid image file. Only JPEG, PNG, WebP, AVIF, TIFF, BMP, and GIF are supported.'));
    }
};

const upload = multer({
    storage,
    limits: { fileSize: 25 * 1024 * 1024 }, // Accept up to 25MB raw file for automatic compression
    fileFilter
});

// POST /api/upload (Admin Only)
// Query params: ?type=product (default) or ?type=category
router.post('/', authenticateAdmin, (req, res, next) => {
    upload.single('image')(req, res, (err) => {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        next();
    });
}, async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No image file uploaded.' });
        }

        const uploadType = req.query.type === 'category' ? 'category' : 'product';

        // Automatically compress, convert to WebP, resize, strip metadata, and generate thumbnail
        const result = await optimizeAndStoreImage(req.file.buffer, {
            type: uploadType
        });

        res.json({
            message: 'Image automatically optimized, compressed to WebP, and stored successfully.',
            ...result
        });
    } catch (err) {
        console.error('Image compression & upload error:', err);
        res.status(500).json({
            error: err.message || 'Image processing and compression failed. Please verify file integrity.'
        });
    }
});

module.exports = router;
