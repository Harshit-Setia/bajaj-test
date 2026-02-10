const express = require('express');
const router = express.Router();

/**
 * GET /health
 * Health check endpoint
 */
router.get('/', (req, res) => {
    const officialEmail = process.env.OFFICIAL_EMAIL || 'student@chitkara.edu.in';

    res.status(200).json({
        is_success: true,
        official_email: officialEmail
    });
});

module.exports = router;
