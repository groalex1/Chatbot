

// server.js
// Main backend server file handling API requests and OpenAI integration
const express = require('express');
const cors = require('cors');
const { OpenAI } = require('openai');
require('dotenv').config();

// Initialize Express app
const app = express();

// Middleware setup
app.use(cors());                   // Enable CORS for all routes
app.use(express.json());          // Parse JSON request bodies
app.use(express.static('public')); // Serve static files

// Initialize OpenAI client
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

// Verify API key exists
if (!process.env.OPENAI_API_KEY) {
    console.error('OPENAI_API_KEY is not set in .env file');
    process.exit(1);
}

// Chat endpoint handling message exchange with OpenAI
app.post('/api/chat', async (req, res) => {
    try {
        const { message } = req.body;

        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }

        // Make request to OpenAI API
        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: message }],
            max_tokens: 150
        });

        // Return successful response
        res.json({ 
            response: completion.choices[0].message.content,
            status: 'success'
        });

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ 
            error: 'An error occurred while processing your request',
            details: error.message 
        });
    }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
