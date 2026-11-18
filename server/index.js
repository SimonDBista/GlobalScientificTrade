require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const authRoutes = require('./routes/auth');
const categoryRoutes = require('./routes/categories');
const productRoutes = require('./routes/products');
const uploadRoutes = require('./routes/upload');
const orderRoutes = require('./routes/orders');
const inquiryRoutes = require('./routes/inquiries');
const contentRoutes = require('./routes/content');

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for client development
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// Static files for product uploads and public assets
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use('/uploads', express.static(uploadsDir));
app.use('/public', express.static(path.join(__dirname, '../public')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/inquiries', inquiryRoutes);
app.use('/api/content', contentRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        status: 'online',
        service: 'Global Scientific Trade API',
        timestamp: new Date().toISOString()
    });
});

// Production: Serve React frontend if client/dist exists
const clientDist = path.join(__dirname, '../client/dist');
if (fs.existsSync(clientDist)) {
    app.use(express.static(clientDist));
    app.get('*', (req, res) => {
        // Don't intercept API routes
        if (req.path.startsWith('/api')) {
            return res.status(404).json({ error: 'Endpoint not found' });
        }
        res.sendFile(path.join(clientDist, 'index.html'));
    });
}

// Start Server
app.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(`🚀 Global Scientific Trade Server running on port ${PORT}`);
    console.log(`   API Endpoint: http://localhost:${PORT}/api/health`);
    console.log(`====================================================`);
});

module.exports = app;
