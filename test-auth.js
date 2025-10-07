const { google } = require('googleapis');

async function testAuth() {
    try {
        console.log('Testing Google Sheets authentication...');
        
        // Load credentials
        const credentials = require('./google-sheets-credentials.json');
        
        // Fix private key format
        if (credentials.private_key) {
            credentials.private_key = credentials.private_key.replace(/\\n/g, '\n');
        }
        
        console.log('Credentials loaded:', {
            type: credentials.type,
            project_id: credentials.project_id,
            client_email: credentials.client_email,
            private_key_length: credentials.private_key ? credentials.private_key.length : 0
        });
        
        // Initialize auth
        const auth = new google.auth.GoogleAuth({
            credentials: credentials,
            scopes: ['https://www.googleapis.com/auth/spreadsheets']
        });
        
        console.log('Auth initialized successfully');
        
        // Test with a simple API call
        const sheets = google.sheets({ version: 'v4', auth });
        
        console.log('Testing API access...');
        const response = await sheets.spreadsheets.get({
            spreadsheetId: '1GgoGvCzW74vSqoaQeQmeGYEdNvLMY64iklDjCTYYOcY'
        });
        
        console.log('✅ Success! Sheet title:', response.data.properties.title);
        console.log('✅ Sheet ID:', response.data.spreadsheetId);
        
    } catch (error) {
        console.error('❌ Error:', error.message);
        if (error.response) {
            console.error('Response status:', error.response.status);
            console.error('Response data:', error.response.data);
        }
    }
}

testAuth();


