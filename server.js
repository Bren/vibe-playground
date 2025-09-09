const express = require('express');
const cors = require('cors');
const { google } = require('googleapis');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// Google Sheets configuration
const SHEET_ID = '1GgoGvCzW74vSqoaQeQmeGYEdNvLMY64iklDjCTYYOcY';
const SHEET_NAME = 'Sheet1';

// Initialize Google Sheets API
async function initializeSheets() {
    try {
        // Load credentials from the JSON file
        const credentials = require('./google-sheets-credentials.json');
        
        const auth = new google.auth.GoogleAuth({
            credentials: credentials,
            scopes: ['https://www.googleapis.com/auth/spreadsheets']
        });

        const sheets = google.sheets({ version: 'v4', auth });
        return sheets;
    } catch (error) {
        console.error('Error initializing Google Sheets:', error);
        throw error;
    }
}

// API Routes

// Get all celebrities from the sheet
app.get('/api/celebrities', async (req, res) => {
    try {
        const sheets = await initializeSheets();
        
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: SHEET_ID,
            range: `${SHEET_NAME}!A:C`, // Get columns A, B, C
        });

        const rows = response.data.values || [];
        const celebrities = rows.slice(1).map(row => ({
            name: row[0] || '',
            photo: row[1] || '',
            alternatives: row[2] ? row[2].split(', ') : []
        })).filter(celebrity => celebrity.name);

        res.json({
            success: true,
            celebrities: celebrities,
            count: celebrities.length
        });
    } catch (error) {
        console.error('Error fetching celebrities:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Add a new celebrity to the sheet
app.post('/api/celebrities', async (req, res) => {
    try {
        const { name, photo, alternatives } = req.body;
        
        if (!name) {
            return res.status(400).json({
                success: false,
                error: 'Name is required'
            });
        }

        const sheets = await initializeSheets();
        
        // Add the new row
        const values = [[name, photo || '', alternatives ? alternatives.join(', ') : '']];
        
        const response = await sheets.spreadsheets.values.append({
            spreadsheetId: SHEET_ID,
            range: `${SHEET_NAME}!A:C`,
            valueInputOption: 'RAW',
            resource: {
                values: values
            }
        });

        res.json({
            success: true,
            message: 'Celebrity added successfully',
            updatedRows: response.data.updates?.updatedRows || 1
        });
    } catch (error) {
        console.error('Error adding celebrity:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Serve the main HTML files
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/pixel-options', (req, res) => {
    res.sendFile(path.join(__dirname, 'pixel-options.html'));
});

app.get('/logic-crossword', (req, res) => {
    res.sendFile(path.join(__dirname, 'logic-crossword.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📊 Google Sheets integration ready!`);
    console.log(`📋 Sheet ID: ${SHEET_ID}`);
});
