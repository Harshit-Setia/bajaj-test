/**
 * Validate POST /bfhl request
 */
function validateBfhlRequest(req, res, next) {
    const body = req.body;

    // Check if body exists
    if (!body || typeof body !== 'object') {
        return res.status(400).json({
            is_success: false,
            error: 'Request body must be a valid JSON object'
        });
    }

    // Get all keys from request
    const keys = Object.keys(body);

    // Must have exactly one key
    if (keys.length === 0) {
        return res.status(400).json({
            is_success: false,
            error: 'Request must contain exactly one operation key'
        });
    }

    if (keys.length > 1) {
        return res.status(400).json({
            is_success: false,
            error: 'Request must contain exactly one operation key'
        });
    }

    const key = keys[0];
    const validKeys = ['fibonacci', 'prime', 'lcm', 'hcf', 'AI'];

    // Validate key
    if (!validKeys.includes(key)) {
        return res.status(400).json({
            is_success: false,
            error: `Invalid operation key. Must be one of: ${validKeys.join(', ')}`
        });
    }

    const value = body[key];

    // Validate value based on key
    switch (key) {
        case 'fibonacci':
            if (!Number.isInteger(value)) {
                return res.status(400).json({
                    is_success: false,
                    error: 'fibonacci value must be an integer'
                });
            }
            if (value < 0) {
                return res.status(400).json({
                    is_success: false,
                    error: 'fibonacci value must be non-negative'
                });
            }
            if (value > 1000) {
                return res.status(400).json({
                    is_success: false,
                    error: 'fibonacci value must not exceed 1000'
                });
            }
            break;

        case 'prime':
        case 'lcm':
        case 'hcf':
            if (!Array.isArray(value)) {
                return res.status(400).json({
                    is_success: false,
                    error: `${key} value must be an array`
                });
            }
            if (value.length === 0) {
                return res.status(400).json({
                    is_success: false,
                    error: `${key} array cannot be empty`
                });
            }
            if (value.length > 1000) {
                return res.status(400).json({
                    is_success: false,
                    error: `${key} array size must not exceed 1000`
                });
            }
            for (let i = 0; i < value.length; i++) {
                if (!Number.isInteger(value[i])) {
                    return res.status(400).json({
                        is_success: false,
                        error: `All elements in ${key} array must be integers`
                    });
                }
                if ((key === 'lcm' || key === 'hcf') && value[i] <= 0) {
                    return res.status(400).json({
                        is_success: false,
                        error: `All elements in ${key} array must be positive integers`
                    });
                }
            }
            break;

        case 'AI':
            if (typeof value !== 'string') {
                return res.status(400).json({
                    is_success: false,
                    error: 'AI value must be a string'
                });
            }
            if (value.trim().length === 0) {
                return res.status(400).json({
                    is_success: false,
                    error: 'AI question cannot be empty'
                });
            }
            if (value.length > 1000) {
                return res.status(400).json({
                    is_success: false,
                    error: 'AI question must not exceed 1000 characters'
                });
            }
            break;
    }

    next();
}

module.exports = {
    validateBfhlRequest
};
