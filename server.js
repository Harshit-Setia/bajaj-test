require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const bfhlRoutes = require('./routes/bfhl');
const healthRoutes = require('./routes/health');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors());

// Disable JSON pretty-printing for compact output
app.set('json spaces', 0);

// Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// Routes
app.use('/bfhl', bfhlRoutes);
app.use('/health', healthRoutes);

// Root endpoint
app.get('/', (req, res) => {
    res.status(200).json({
        message: 'BFHL API Server',
        endpoints: {
            health: 'GET /health',
            bfhl: 'POST /bfhl'
        },
        version: '1.0.0'
    });
});

// 404 handler
app.use(notFoundHandler);

// Global error handler
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`Official Email: ${process.env.OFFICIAL_EMAIL || 'Not configured'}`);
    console.log(`Gemini API: ${process.env.GEMINI_API_KEY ? 'Configured' : 'Not configured'}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM signal received: closing HTTP server');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('SIGINT signal received: closing HTTP server');
    process.exit(0);
});

module.exports = app;
