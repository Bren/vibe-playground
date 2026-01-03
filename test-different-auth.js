const { google } = require('googleapis');

async function testDifferentAuth() {
    try {
        console.log('🔍 Trying different authentication methods...');
        
        // Load credentials
        const credentials = require('./google-sheets-credentials.json');
        
        // Method 1: Try with different scopes
        console.log('📋 Method 1: Different scopes...');
        try {
            const auth1 = new google.auth.GoogleAuth({
                credentials: credentials,
                scopes: [
                    'https://www.googleapis.com/auth/spreadsheets',
                    'https://www.googleapis.com/auth/drive'
                ]
            });
            
            const sheets1 = google.sheets({ version: 'v4', auth: auth1 });
            const response1 = await sheets1.spreadsheets.get({
                spreadsheetId: '1GgoGvCzW74vSqoaQeQmeGYEdNvLMY64iklDjCTYYOcY'
            });
            
            console.log('✅ SUCCESS with different scopes!');
            console.log('📊 Sheet title:', response1.data.properties.title);
            return;
            
        } catch (error1) {
            console.log('❌ Method 1 failed:', error1.message);
        }
        
        // Method 2: Try with environment variable
        console.log('📋 Method 2: Environment variable...');
        try {
            process.env.GOOGLE_APPLICATION_CREDENTIALS = './google-sheets-credentials.json';
            
            const auth2 = new google.auth.GoogleAuth({
                scopes: ['https://www.googleapis.com/auth/spreadsheets']
            });
            
            const sheets2 = google.sheets({ version: 'v4', auth: auth2 });
            const response2 = await sheets2.spreadsheets.get({
                spreadsheetId: '1GgoGvCzW74vSqoaQeQmeGYEdNvLMY64iklDjCTYYOcY'
            });
            
            console.log('✅ SUCCESS with environment variable!');
            console.log('📊 Sheet title:', response2.data.properties.title);
            return;
            
        } catch (error2) {
            console.log('❌ Method 2 failed:', error2.message);
        }
        
        // Method 3: Try with different token URI
        console.log('📋 Method 3: Different token URI...');
        try {
            const auth3 = new google.auth.GoogleAuth({
                credentials: {
                    ...credentials,
                    token_uri: 'https://oauth2.googleapis.com/token'
                },
                scopes: ['https://www.googleapis.com/auth/spreadsheets']
            });
            
            const sheets3 = google.sheets({ version: 'v4', auth: auth3 });
            const response3 = await sheets3.spreadsheets.get({
                spreadsheetId: '1GgoGvCzW74vSqoaQeQmeGYEdNvLMY64iklDjCTYYOcY'
            });
            
            console.log('✅ SUCCESS with different token URI!');
            console.log('📊 Sheet title:', response3.data.properties.title);
            return;
            
        } catch (error3) {
            console.log('❌ Method 3 failed:', error3.message);
        }
        
        console.log('❌ All methods failed. Need to create a new service account key.');
        
    } catch (error) {
        console.error('❌ General error:', error.message);
    }
}

testDifferentAuth();






