const axios = require('axios');

/**
 * Get AI response from Google Gemini API
 * @param {string} question - Question to ask AI
 * @returns {Promise<string>} Single-word answer
 */
async function getAIResponse(question) {
    if (typeof question !== 'string' || question.trim().length === 0) {
        throw new Error('Question must be a non-empty string');
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
        throw new Error('GEMINI_API_KEY not configured');
    }

    try {
        const response = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
            {
                contents: [{
                    parts: [{
                        text: `Answer the following question with ONLY a single word, no punctuation, no explanation: ${question}`
                    }]
                }],
                generationConfig: {
                    temperature: 0.1,
                    maxOutputTokens: 50,
                }
            },
            {
                headers: {
                    'Content-Type': 'application/json'
                },
                timeout: 20000
            }
        );

        if (response.data?.candidates?.[0]?.content?.parts?.[0]?.text) {
            // Extract single word from response
            const answer = response.data.candidates[0].content.parts[0].text
                .trim()
                .split(/[\s\n,.!?;:]+/)[0]; // Get first word only

            return answer;
        }

        throw new Error('Invalid response from AI service');
    } catch (error) {
        // Log full error for debugging
        console.error('AI Service Error Details:', {
            message: error.message,
            code: error.code,
            status: error.response?.status,
            statusText: error.response?.statusText,
            data: error.response?.data
        });

        if (error.response?.status === 429) {
            throw new Error('AI service rate limit exceeded');
        } else if (error.response?.status === 401 || error.response?.status === 403) {
            throw new Error('Invalid AI API key');
        } else if (error.response?.status === 400) {
            throw new Error(`AI service bad request: ${error.response?.data?.error?.message || 'Invalid request'}`);
        } else if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
            throw new Error('AI service timeout');
        } else if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
            throw new Error('AI service unreachable');
        }

        throw new Error(`AI service error: ${error.message}`);
    }
}

module.exports = {
    getAIResponse
};
