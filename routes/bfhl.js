const express = require('express');
const router = express.Router();
const { validateBfhlRequest } = require('../middleware/validator');
const {
    generateFibonacci,
    filterPrimes,
    calculateHCF,
    calculateLCM
} = require('../utils/mathUtils');
const { getAIResponse } = require('../utils/aiService');

/**
 * POST /bfhl
 * Main endpoint for processing requests
 */
router.post('/', validateBfhlRequest, async (req, res, next) => {
    try {
        const officialEmail = process.env.OFFICIAL_EMAIL || 'student@chitkara.edu.in';
        const key = Object.keys(req.body)[0];
        const value = req.body[key];

        let data;

        switch (key) {
            case 'fibonacci':
                data = generateFibonacci(value);
                break;

            case 'prime':
                data = filterPrimes(value);
                break;

            case 'lcm':
                data = calculateLCM(value);
                break;

            case 'hcf':
                data = calculateHCF(value);
                break;

            case 'AI':
                data = await getAIResponse(value);
                break;

            default:
                throw new Error('Invalid operation');
        }

        res.status(200).json({
            is_success: true,
            official_email: officialEmail,
            data: data
        });

    } catch (error) {
        next(error);
    }
});

module.exports = router;
