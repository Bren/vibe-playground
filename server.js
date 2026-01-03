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
const SHEET_NAME = 'Published';

// Initialize Google Sheets API
async function initializeSheets() {
    try {
        // Load credentials from the JSON file
        const credentials = require('./google-sheets-credentials.json');
        
        // Fix the private key format - ensure it has proper line breaks
        if (credentials.private_key) {
            credentials.private_key = credentials.private_key.replace(/\\n/g, '\n');
        }
        
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
            range: `${SHEET_NAME}!A:F`, // Get columns A through F (including nicknames)
        });

        const rows = response.data.values || [];
        const celebrities = rows.slice(1).map(row => ({
            name: row[0] || '',
            publishDate: row[1] || '',
            gender: row[2] || '',
            nationality: row[3] || '',
            photo: row[4] || '',
            nicknames: row[5] || ''
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
        
        // Get current date in DD/MM/YYYY format
        const today = new Date();
        const publishDate = `${today.getDate().toString().padStart(2, '0')}/${(today.getMonth() + 1).toString().padStart(2, '0')}/${today.getFullYear()}`;
        
        // Add the new row with the correct structure: Name, Publish date, Gender, Nationality, Status, Photo URL
        const values = [[name, publishDate, '', '', '', photo || '']];
        
        const response = await sheets.spreadsheets.values.append({
            spreadsheetId: SHEET_ID,
            range: `${SHEET_NAME}!A:F`,
            valueInputOption: 'RAW',
            resource: {
                values: values
            }
        });

        res.json({
            success: true,
            message: 'Celebrity added successfully',
            updatedRows: response.data.updates?.updatedRows || 1,
            data: {
                name: name,
                publishDate: publishDate,
                photo: photo || ''
            }
        });
    } catch (error) {
        console.error('Error adding celebrity:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Delete the last row (latest celebrity)
app.delete('/api/celebrities/latest', async (req, res) => {
    try {
        const sheets = await initializeSheets();
        
        // First, get the current data to find the last row
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: SHEET_ID,
            range: `${SHEET_NAME}!A:F`,
        });

        const rows = response.data.values || [];
        const lastRowIndex = rows.length; // This is the row number to delete
        
        // Delete the last row
        await sheets.spreadsheets.batchUpdate({
            spreadsheetId: SHEET_ID,
            resource: {
                requests: [{
                    deleteDimension: {
                        range: {
                            sheetId: 0, // Published sheet ID
                            dimension: 'ROWS',
                            startIndex: lastRowIndex - 1, // 0-based index
                            endIndex: lastRowIndex
                        }
                    }
                }]
            }
        });

        res.json({
            success: true,
            message: 'Latest celebrity deleted successfully',
            deletedRow: lastRowIndex
        });
    } catch (error) {
        console.error('Error deleting latest celebrity:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Update a specific row with new data
app.put('/api/celebrities/row/:rowIndex', async (req, res) => {
    try {
        const { rowIndex } = req.params;
        const { name, photo } = req.body;
        
        if (!name) {
            return res.status(400).json({
                success: false,
                error: 'Name is required'
            });
        }

        const sheets = await initializeSheets();
        
        // Get tomorrow's date in DD/MM/YYYY format
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const publishDate = `${tomorrow.getDate().toString().padStart(2, '0')}/${(tomorrow.getMonth() + 1).toString().padStart(2, '0')}/${tomorrow.getFullYear()}`;
        
        // Update the specific row
        const values = [[name, publishDate, '', '', '', photo || '']];
        
        await sheets.spreadsheets.values.update({
            spreadsheetId: SHEET_ID,
            range: `${SHEET_NAME}!A${rowIndex}:F${rowIndex}`,
            valueInputOption: 'RAW',
            resource: {
                values: values
            }
        });

        res.json({
            success: true,
            message: 'Celebrity updated successfully',
            rowIndex: rowIndex,
            data: {
                name: name,
                publishDate: publishDate,
                photo: photo || ''
            }
        });
    } catch (error) {
        console.error('Error updating celebrity:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Clear content from a specific row but keep the date
app.put('/api/celebrities/row/:rowIndex/clear', async (req, res) => {
    try {
        const { rowIndex } = req.params;
        const sheets = await initializeSheets();
        
        // Clear only the name, gender, nationality, status, and photo columns
        // Keep the date column (column B) unchanged
        // We'll do this in two separate operations
        
        // First, clear column A (name)
        await sheets.spreadsheets.values.update({
            spreadsheetId: SHEET_ID,
            range: `${SHEET_NAME}!A${rowIndex}`,
            valueInputOption: 'RAW',
            resource: {
                values: [['']]
            }
        });
        
        // Then, clear columns C, D, E, F (gender, nationality, status, photo)
        await sheets.spreadsheets.values.update({
            spreadsheetId: SHEET_ID,
            range: `${SHEET_NAME}!C${rowIndex}:F${rowIndex}`,
            valueInputOption: 'RAW',
            resource: {
                values: [['', '', '', '']]
            }
        });

        res.json({
            success: true,
            message: 'Row content cleared successfully (date preserved)',
            rowIndex: rowIndex,
            clearedColumns: ['A', 'C', 'D', 'E', 'F'],
            preservedColumns: ['B (date)']
        });
    } catch (error) {
        console.error('Error clearing row content:', error);
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
