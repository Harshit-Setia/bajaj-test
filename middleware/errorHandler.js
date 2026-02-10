/**
 * Global error handler middleware
 */
function errorHandler(err, req, res, next) {
    console.error('Error:', err);

    // Default error response
    const errorResponse = {
        is_success: false,
        error: err.message || 'Internal server error'
    };

    // Determine status code
    let statusCode = 500;

    if (err.message.includes('must be') ||
        err.message.includes('Invalid') ||
        err.message.includes('cannot be empty')) {
        statusCode = 400; // Bad Request
    } else if (err.message.includes('not configured') ||
        err.message.includes('Invalid AI API key')) {
        statusCode = 503; // Service Unavailable
    } else if (err.message.includes('timeout') ||
        err.message.includes('rate limit')) {
        statusCode = 503; // Service Unavailable
    }

    res.status(statusCode).json(errorResponse);
}

/**
 * 404 handler
 */
function notFoundHandler(req, res) {
    res.status(404).json({
        is_success: false,
        error: 'Endpoint not found'
    });
}

module.exports = {
    errorHandler,
    notFoundHandler
};
