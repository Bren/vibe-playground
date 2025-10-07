const { google } = require('googleapis');

async function checkSheet() {
    try {
        console.log('🔍 Checking Google Sheet structure...');
        
        // Load credentials
        const credentials = require('./google-sheets-credentials.json');
        
        // Fix private key format
        if (credentials.private_key) {
            credentials.private_key = credentials.private_key.replace(/\\n/g, '\n');
        }
        
        const auth = new google.auth.GoogleAuth({
            credentials: credentials,
            scopes: ['https://www.googleapis.com/auth/spreadsheets']
        });

        const sheets = google.sheets({ version: 'v4', auth });
        
        // Get sheet info
        const response = await sheets.spreadsheets.get({
            spreadsheetId: '1GgoGvCzW74vSqoaQeQmeGYEdNvLMY64iklDjCTYYOcY'
        });
        
        console.log('✅ Sheet found!');
        console.log('📊 Sheet title:', response.data.properties.title);
        console.log('📋 Available sheets:');
        
        response.data.sheets.forEach((sheet, index) => {
            console.log(`  ${index + 1}. "${sheet.properties.title}" (ID: ${sheet.properties.sheetId})`);
        });
        
        // Try to read from the first sheet
        const firstSheet = response.data.sheets[0];
        if (firstSheet) {
            console.log(`\n🔍 Reading from first sheet: "${firstSheet.properties.title}"`);
            
            try {
                const dataResponse = await sheets.spreadsheets.values.get({
                    spreadsheetId: '1GgoGvCzW74vSqoaQeQmeGYEdNvLMY64iklDjCTYYOcY',
                    range: `${firstSheet.properties.title}!A:Z`
                });
                
                console.log('✅ Data read successfully!');
                console.log('📊 Rows found:', dataResponse.data.values ? dataResponse.data.values.length : 0);
                
                if (dataResponse.data.values && dataResponse.data.values.length > 0) {
                    console.log('📋 First few rows:');
                    dataResponse.data.values.slice(0, 5).forEach((row, index) => {
                        console.log(`  Row ${index + 1}:`, row);
                    });
                }
                
            } catch (dataError) {
                console.log('❌ Error reading data:', dataError.message);
            }
        }
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

checkSheet();




