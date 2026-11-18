const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

// Ensure destination directories exist
const UPLOADS_ROOT = path.join(__dirname, '../../uploads');
const PRODUCTS_DIR = path.join(UPLOADS_ROOT, 'products');
const CATEGORIES_DIR = path.join(UPLOADS_ROOT, 'categories');

[UPLOADS_ROOT, PRODUCTS_DIR, CATEGORIES_DIR].forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
});

const PRESETS = {
    product: {
        dir: PRODUCTS_DIR,
        prefix: 'prod',
        main: { width: 1200, height: 1200, quality: 82 },
        thumb: { width: 450, height: 450, quality: 80 }
    },
    category: {
        dir: CATEGORIES_DIR,
        prefix: 'cat',
        main: { width: 800, height: 800, quality: 82 },
        thumb: { width: 350, height: 350, quality: 80 }
    },
    general: {
        dir: PRODUCTS_DIR,
        prefix: 'img',
        main: { width: 1200, height: 1200, quality: 82 },
        thumb: { width: 400, height: 400, quality: 80 }
    }
};

/**
 * Optimizes an uploaded image buffer:
 * 1. Honors EXIF rotation then strips all metadata.
 * 2. Resizes excessively large images preserving aspect ratio (fit: 'inside', withoutEnlargement: true).
 * 3. Compresses to high-efficiency modern WebP.
 * 4. Simultaneously generates an optimized thumbnail variant for cards/grids.
 * 5. Returns comprehensive optimization metrics.
 */
async function optimizeAndStoreImage(buffer, options = {}) {
    const type = options.type || 'product';
    const preset = PRESETS[type] || PRESETS.product;

    const originalSize = buffer.length;

    // Read metadata
    const metadata = await sharp(buffer).metadata();
    const originalWidth = metadata.width || 0;
    const originalHeight = metadata.height || 0;
    const originalFormat = metadata.format || 'unknown';

    // Generate unique base filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const mainFilename = `${preset.prefix}-${uniqueSuffix}.webp`;
    const thumbFilename = `${preset.prefix}-${uniqueSuffix}-thumb.webp`;

    const mainFilePath = path.join(preset.dir, mainFilename);
    const thumbFilePath = path.join(preset.dir, thumbFilename);

    // 1. Process Main Image:
    // .rotate() automatically rotates based on EXIF orientation tag before stripping metadata
    const mainPipeline = sharp(buffer)
        .rotate()
        .resize({
            width: preset.main.width,
            height: preset.main.height,
            fit: 'inside',
            withoutEnlargement: true
        })
        .webp({
            quality: preset.main.quality,
            effort: 5,
            smartSubsample: true
        });

    const mainBuffer = await mainPipeline.toBuffer();
    await fs.promises.writeFile(mainFilePath, mainBuffer);
    const mainMetadata = await sharp(mainBuffer).metadata();

    // 2. Process Thumbnail Variant:
    const thumbPipeline = sharp(buffer)
        .rotate()
        .resize({
            width: preset.thumb.width,
            height: preset.thumb.height,
            fit: 'inside',
            withoutEnlargement: true
        })
        .webp({
            quality: preset.thumb.quality,
            effort: 4
        });

    const thumbBuffer = await thumbPipeline.toBuffer();
    await fs.promises.writeFile(thumbFilePath, thumbBuffer);
    const thumbMetadata = await sharp(thumbBuffer).metadata();

    // Calculate metrics
    const optimizedSize = mainBuffer.length;
    const thumbSize = thumbBuffer.length;
    const savedBytes = Math.max(0, originalSize - optimizedSize);
    const savedPercent = originalSize > 0 ? Math.round((savedBytes / originalSize) * 100) : 0;

    const relativeFolder = type === 'category' ? '/uploads/categories' : '/uploads/products';

    return {
        url: `${relativeFolder}/${mainFilename}`,
        thumbnail_url: `${relativeFolder}/${thumbFilename}`,
        thumbnailUrl: `${relativeFolder}/${thumbFilename}`,
        filename: mainFilename,
        thumbnail_filename: thumbFilename,
        format: 'webp',
        width: mainMetadata.width,
        height: mainMetadata.height,
        thumb_width: thumbMetadata.width,
        thumb_height: thumbMetadata.height,
        dimensions: { width: mainMetadata.width, height: mainMetadata.height },
        thumbnailDimensions: { width: thumbMetadata.width, height: thumbMetadata.height },
        size: optimizedSize,
        thumbnail_size: thumbSize,
        thumbnailSize: thumbSize,
        original_size: originalSize,
        originalSize: originalSize,
        original_format: originalFormat,
        original_dimensions: `${originalWidth}x${originalHeight}`,
        optimized_dimensions: `${mainMetadata.width}x${mainMetadata.height}`,
        saved_bytes: savedBytes,
        saved_percent: savedPercent,
        savingsPercent: savedPercent
    };
}

module.exports = {
    optimizeAndStoreImage
};
