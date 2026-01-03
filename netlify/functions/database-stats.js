const { google } = require('googleapis');

exports.handler = async (event, context) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
    };

    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers, body: '' };
    }

    try {
        const SHEET_ID = '1GgoGvCzW74vSqoaQeQmeGYEdNvLMY64iklDjCTYYOcY';
        const SHEET_NAME = 'Published';

        // Initialize Google Sheets API
        const credentials = {
            type: "service_account",
            project_id: "pixel-picker-460417",
            private_key_id: "7f37b86e842cc3665357d8c0d5043d278838f558",
            private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCjHFfmZBVB5TB8\nCc504qbrGIfpXrSh2qxDAk57G8lrdTotsoFcf0k64dq92V3gmlPXO+cWF9YZjH11\nVsTF+Y85Pcnz2ssimJ3HHZXMzr7KKus1vHloOzW0RWSOiosfT9uV0jc7G9tgl6CX\nq1u9FnV3bvM5OQOwUiTMzGbLu2sxc1zRgqvCtRrgJXt/1qFr7qUfINfDo2FTaody\nADyzaiBHnBO3zhHHF6MqLCGJ2T61xuNpgr3op22dnYEQs7mjA9cBDpEAQmc4rPDI\n35ckE3EPDwo5ch+4zP1mlSGR5TAWWYDX8SYgusyjvazScy/BzlmBeWML3C09Cn4d\nez8B85XrAgMBAAECggEAAtGQEUqkdWWM/2+58hoikUh0vMsmqu9Y77V//q+dvO4j\nKbv+cUc/0DUr7wDtFt8D2OHPnfmeeQWM+3Sa5OLpny8aqMycmwXxIAo6VvYxpNO2\nCdEudeckB+/1C2OIgOuD22RtEOfr1BD6tPRAmxVixUQVDuWV0zuwKBvWIOolsY6K\nOLP++FzGMHLHkZsYUyWcNgsSEWenq0D0JU3P1V4K6t/b4yIdH1hMrmIzGdkdVCuR\nRsDdz+Q6f/iO5Ex0l9WkdZ+iiqFPCXYjTtLrnYoKtAUpKg57bF65i85cN0QbZQRw\nm28ovalscUDoGM3inOzwnXy1n0dJab57ZWM/7x1PEQKBgQDS61gFniggGCmy/Wwj\ngYsKBsEB5aDQT33VTDKEJ3qo4Pc1dRGwvF04Mv0wKOH+e+6GDt/x5JBy9CpwQ/IQ\n2kjjScUtrxvGGYM7nfLdaLRAqlxYWHEmaBrTwxC3oCXzXVjuZBVpk1gAq+5UdOue\naZiAA8rCLfWWDD89HUh5RyzJ+wKBgQDF+RsDMZs1gOX3NuD0/Q2DcD5a5wBm/a43\nWFXFZBDbcjkYzxyeMofG7QnC6j3Z3+a7F3ebW3LHh6RgD+1slvJEd9vUgeXxFPOC\nFt4ouxw5TupC1wZKYxXeeHnlyldx0ONFSRMxHuyMv1T5Q6arCzqWXvqrRIwgu/NY\nig4UbNkQ0QKBgEToVHqJYCyUGFN8ze6PrQAaksXu4moL/l1IJpzcVQuFa95QH/Zw\no7fvmJ46TRMaJCQyCeH6PWMA+DhzSktNNVDkUgIJ2nYO8bvxb138jh8uSTsnsdfN\nXS5f5T9Il/15OsuvcPtsAu09PoDjLfM0Jnl0Q7LK1xgtah+qSHou0agvAoGAedfh\n3ypVuy0029zjwQRJn96iEfJgVgLFiXyNdWor0dPP/kvh8h9pX24d9t+R55kc+YLs\n8ynqT5FVAmZrGs0gGDGok3bLHYBmimcmnezi5waBuVd7oKaxG/YMF/hbr0n/xnG+\nJRpCPjG3y53uYxELIucb4fLTR4ZFs/Vryvhe9DECgYEAh6Hmps9KjMA+bFEhx8ei\nWhOodwRzBlsuTQ/uTSbX94YiskXb2fH9QOmqOaA4egKwgiBNkoWv71nARhUlo0r1\nTcQTpoKS1ImQkD99eNg70IH6ZXMhjGrfdN6VLR3MDBs298X6Up2VsaeH6I53jsvV\nrnhOFkRJGb2W3XMBzdfee98=\n-----END PRIVATE KEY-----\n",
            client_email: "pixel-picker@pixel-picker-460417.iam.gserviceaccount.com",
            client_id: "113758469462493372770",
            auth_uri: "https://accounts.google.com/o/oauth2/auth",
            token_uri: "https://oauth2.googleapis.com/token",
            auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
            client_x509_cert_url: "https://www.googleapis.com/robot/v1/metadata/x509/pixel-picker%40pixel-picker-460417.iam.gserviceaccount.com",
            universe_domain: "googleapis.com"
        };

        const auth = new google.auth.GoogleAuth({
            credentials: credentials,
            scopes: ['https://www.googleapis.com/auth/spreadsheets']
        });

        const sheets = google.sheets({ version: 'v4', auth });
        
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: SHEET_ID,
            range: `${SHEET_NAME}!A:G`,
        });

        const rows = response.data.values || [];
        const dataRows = rows.slice(1); // Skip header
        
        const totalEntries = dataRows.length;
        
        // Count complete/incomplete for each column
        const stats = {
            name: { complete: 0, incomplete: 0 },
            publishDate: { complete: 0, incomplete: 0 },
            gender: { complete: 0, incomplete: 0 },
            nationality: { complete: 0, incomplete: 0 },
            status: { complete: 0, incomplete: 0 },
            photo: { complete: 0, incomplete: 0 },
            nicknames: { complete: 0, incomplete: 0 }
        };
        
        dataRows.forEach(row => {
            // Check each column
            stats.name[row[0] && row[0].trim() ? 'complete' : 'incomplete']++;
            stats.publishDate[row[1] && row[1].trim() ? 'complete' : 'incomplete']++;
            stats.gender[row[2] && row[2].trim() ? 'complete' : 'incomplete']++;
            stats.nationality[row[3] && row[3].trim() ? 'complete' : 'incomplete']++;
            stats.status[row[4] && row[4].trim() ? 'complete' : 'incomplete']++;
            stats.photo[row[5] && row[5].trim() ? 'complete' : 'incomplete']++;
            stats.nicknames[row[6] && row[6].trim() ? 'complete' : 'incomplete']++;
        });
        
        return {
            statusCode: 200,
            headers: { ...headers, 'Content-Type': 'application/json' },
            body: JSON.stringify({
                success: true,
                totalEntries: totalEntries,
                stats: stats
            })
        };

    } catch (error) {
        console.error('Error fetching database stats:', error);
        return {
            statusCode: 500,
            headers: { ...headers, 'Content-Type': 'application/json' },
            body: JSON.stringify({
                success: false,
                error: error.message
            })
        };
    }
};

