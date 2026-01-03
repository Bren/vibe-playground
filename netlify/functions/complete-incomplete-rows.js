const { google } = require('googleapis');
const axios = require('axios');

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
        
        // Fetch all rows
        console.log('📊 Fetching all rows from sheet...');
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: SHEET_ID,
            range: `${SHEET_NAME}!A:G`,
        });

        const rows = response.data.values || [];
        console.log(`✅ Found ${rows.length} total rows (including header)`);
        
        // Skip header row
        const dataRows = rows.slice(1);
        const incompleteRows = [];
        const completeRows = [];
        
        // Identify incomplete rows
        dataRows.forEach((row, index) => {
            const rowData = {
                rowIndex: index + 2, // +2 because we skip header (row 1) and arrays are 0-indexed
                name: (row[0] || '').trim(),
                publishDate: (row[1] || '').trim(),
                gender: (row[2] || '').trim(),
                nationality: (row[3] || '').trim(),
                status: (row[4] || '').trim(),
                photo: (row[5] || '').trim(),
                nicknames: (row[6] || '').trim()
            };
            
            // Check if row is complete (all 7 columns filled)
            const isComplete = rowData.name && 
                              rowData.publishDate && 
                              rowData.gender && 
                              rowData.nationality && 
                              rowData.status && 
                              rowData.photo && 
                              rowData.nicknames;
            
            if (isComplete) {
                completeRows.push(rowData);
            } else {
                incompleteRows.push(rowData);
            }
        });
        
        console.log(`📈 Analysis:`);
        console.log(`  - Complete rows: ${completeRows.length}`);
        console.log(`  - Incomplete rows: ${incompleteRows.length}`);
        
        if (incompleteRows.length === 0) {
            return {
                statusCode: 200,
                headers: { ...headers, 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    success: true,
                    message: 'All rows are already complete!',
                    completeRows: completeRows.length,
                    incompleteRows: 0,
                    updated: []
                })
            };
        }
        
        // Process incomplete rows
        const updatedRows = [];
        const errors = [];
        
        for (const row of incompleteRows) {
            // Skip rows without a name (can't look up data)
            if (!row.name) {
                console.log(`⏭️ Skipping row ${row.rowIndex} - no name`);
                errors.push({ rowIndex: row.rowIndex, error: 'No name provided' });
                continue;
            }
            
            try {
                console.log(`🔍 Processing row ${row.rowIndex}: ${row.name}`);
                console.log(`   Current data: gender=${row.gender}, nationality=${row.nationality}, status=${row.status}, photo=${row.photo ? 'yes' : 'no'}, nicknames=${row.nicknames}`);
                
                // Fetch data from Wikipedia/Wikidata (try with nicknames if available)
                const celebInfo = await getCelebrityInfoFromName(row.name, row.nicknames);
                
                if (!celebInfo) {
                    console.log(`❌ Could not find data for: ${row.name}`);
                    errors.push({ rowIndex: row.rowIndex, name: row.name, error: 'Could not find Wikipedia data' });
                    continue;
                }
                
                console.log(`   ✅ Found data: gender=${celebInfo.gender || 'N/A'}, nationality=${celebInfo.nationality || 'N/A'}, photo=${celebInfo.photo ? 'yes' : 'no'}`);
                
                // Fill in missing fields (only fill what's missing, preserve existing data)
                // But also fix misaligned columns - if status is in wrong place, fix it
                let fixedGender = row.gender;
                let fixedNationality = row.nationality;
                let fixedStatus = row.status;
                let fixedPhoto = row.photo;
                
                // Check if columns are misaligned (e.g., "Published" in gender column)
                if (row.gender && (row.gender.toLowerCase() === 'published' || row.gender.includes('http'))) {
                    // Gender column has wrong data, shift everything
                    console.log(`   ⚠️ Detected misaligned columns in row ${row.rowIndex}, fixing...`);
                    fixedGender = '';
                    fixedNationality = row.gender; // Gender column might have nationality
                    fixedStatus = row.nationality || 'Published';
                    fixedPhoto = row.status || row.photo || '';
                }
                
                const updatedRow = {
                    name: row.name, // Keep original name
                    publishDate: row.publishDate || '', // Keep publish date if exists
                    gender: fixedGender || celebInfo.gender || '',
                    nationality: fixedNationality || celebInfo.nationality || '',
                    status: fixedStatus || 'Published', // Default status to 'Published' if empty
                    photo: fixedPhoto || celebInfo.photo || '',
                    nicknames: row.nicknames || celebInfo.nicknames || ''
                };
                
                console.log(`   📝 Will update: gender=${updatedRow.gender || 'N/A'}, nationality=${updatedRow.nationality || 'N/A'}, status=${updatedRow.status || 'N/A'}`);
                
                // Update the row in the sheet
                const values = [[
                    updatedRow.name,
                    updatedRow.publishDate,
                    updatedRow.gender,
                    updatedRow.nationality,
                    updatedRow.status,
                    updatedRow.photo,
                    updatedRow.nicknames
                ]];
                
                await sheets.spreadsheets.values.update({
                    spreadsheetId: SHEET_ID,
                    range: `${SHEET_NAME}!A${row.rowIndex}:G${row.rowIndex}`,
                    valueInputOption: 'RAW',
                    resource: { values: values }
                });
                
                updatedRows.push({
                    rowIndex: row.rowIndex,
                    name: row.name,
                    updated: {
                        gender: !row.gender && updatedRow.gender ? updatedRow.gender : null,
                        nationality: !row.nationality && updatedRow.nationality ? updatedRow.nationality : null,
                        photo: !row.photo && updatedRow.photo ? 'Yes' : null,
                        nicknames: !row.nicknames && updatedRow.nicknames ? updatedRow.nicknames : null
                    }
                });
                
                console.log(`✅ Updated row ${row.rowIndex}: ${row.name}`);
                
                // Small delay to avoid rate limiting
                await new Promise(resolve => setTimeout(resolve, 500));
                
            } catch (error) {
                console.error(`❌ Error processing row ${row.rowIndex} (${row.name}):`, error.message);
                errors.push({ rowIndex: row.rowIndex, name: row.name, error: error.message });
            }
        }
        
        return {
            statusCode: 200,
            headers: { ...headers, 'Content-Type': 'application/json' },
            body: JSON.stringify({
                success: true,
                message: `Processed ${incompleteRows.length} incomplete rows`,
                completeRows: completeRows.length,
                incompleteRows: incompleteRows.length,
                updated: updatedRows.length,
                updatedRows: updatedRows,
                errors: errors.length,
                errorDetails: errors
            })
        };

    } catch (error) {
        console.error('Error completing incomplete rows:', error);
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

// Helper function to get celebrity info from name
async function getCelebrityInfoFromName(name, nicknames = '') {
    try {
        // Try multiple search strategies for Hebrew/English names
        const searchTerms = [name];
        
        // If we have nicknames, try those too (often contain English names)
        if (nicknames) {
            const nicknameList = nicknames.split(',').map(n => n.trim()).filter(n => n);
            // Look for English names in nicknames (non-Hebrew characters)
            nicknameList.forEach(nick => {
                if (/[a-zA-Z]/.test(nick) && nick.length > 2) {
                    searchTerms.push(nick);
                }
            });
        }
        
        let title = null;
        
        // Try each search term
        for (const searchTerm of searchTerms) {
            try {
                const searchRes = await axios.get('https://en.wikipedia.org/w/api.php', {
                    params: {
                        action: 'query',
                        list: 'search',
                        srsearch: searchTerm,
                        srlimit: 3,
                        srnamespace: 0,
                        format: 'json',
                        origin: '*'
                    },
                    headers: { 'User-Agent': 'PixelOptions/1.0 (contact@example.com)' },
                    timeout: 5000
                });
                
                const results = searchRes.data.query?.search || [];
                if (results.length > 0) {
                    title = results[0].title;
                    console.log(`   ✅ Found Wikipedia page: ${title} (searched: ${searchTerm})`);
                    break;
                }
            } catch (err) {
                console.log(`   ⚠️ Search failed for "${searchTerm}": ${err.message}`);
                continue;
            }
        }
        
        if (!title) {
            console.log(`   ❌ No Wikipedia results for any search term`);
            return null;
        }
        
        // Get detailed info
        const wikiRes = await axios.get(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`, {
            headers: { 'User-Agent': 'PixelOptions/1.0 (contact@example.com)' },
            timeout: 5000
        });

        const data = wikiRes.data;
        
        if (!data.extract || data.type !== 'standard') {
            return null;
        }
        
        // Get Wikidata ID
        let wikidataId = null;
        try {
            const wikidataRes = await axios.get('https://en.wikipedia.org/w/api.php', {
                params: {
                    action: 'query',
                    prop: 'pageprops',
                    ppprop: 'wikibase_item',
                    titles: title,
                    format: 'json',
                    origin: '*'
                },
                headers: { 'User-Agent': 'PixelOptions/1.0 (contact@example.com)' },
                timeout: 5000
            });
            
            const pages = wikidataRes.data.query?.pages || {};
            const pageId = Object.keys(pages)[0];
            wikidataId = pages[pageId]?.pageprops?.wikibase_item || null;
        } catch (err) {
            console.error('Error getting Wikidata ID:', err.message);
        }
        
        let gender = null;
        let nationality = null;
        let photo = data.thumbnail?.source || data.originalimage?.source || null;
        let nicknames = null;

        if (wikidataId) {
            try {
                const wdRes = await axios.get(`https://www.wikidata.org/w/api.php`, {
                    params: {
                        action: 'wbgetentities',
                        ids: wikidataId,
                        props: 'claims',
                        format: 'json',
                        origin: '*'
                    },
                    timeout: 5000
                });

                const entity = wdRes.data.entities?.[wikidataId];
                if (entity) {
                    // Get gender (P21)
                    const genders = entity.claims?.P21 || [];
                    if (genders.length > 0) {
                        const genderId = genders[0].mainsnak?.datavalue?.value?.id;
                        if (genderId) {
                            const genderRes = await axios.get(`https://www.wikidata.org/w/api.php`, {
                                params: {
                                    action: 'wbgetentities',
                                    ids: genderId,
                                    props: 'labels',
                                    languages: 'en',
                                    format: 'json',
                                    origin: '*'
                                }
                            });
                            const genderLabel = genderRes.data.entities?.[genderId]?.labels?.en?.value;
                            if (genderLabel) {
                                // Map to simple gender values
                                if (genderLabel.toLowerCase().includes('male') || genderLabel.toLowerCase() === 'male') {
                                    gender = 'Male';
                                } else if (genderLabel.toLowerCase().includes('female') || genderLabel.toLowerCase() === 'female') {
                                    gender = 'Female';
                                } else {
                                    gender = genderLabel;
                                }
                            }
                        }
                    }

                    // Get nationality (P27)
                    const nationalities = entity.claims?.P27 || [];
                    if (nationalities.length > 0) {
                        const natId = nationalities[0].mainsnak?.datavalue?.value?.id;
                        if (natId) {
                            const natRes = await axios.get(`https://www.wikidata.org/w/api.php`, {
                                params: {
                                    action: 'wbgetentities',
                                    ids: natId,
                                    props: 'labels',
                                    languages: 'en',
                                    format: 'json',
                                    origin: '*'
                                }
                            });
                            nationality = natRes.data.entities?.[natId]?.labels?.en?.value || null;
                        }
                    }
                    
                    // Get nicknames/aliases
                    // P1449 - nickname
                    // P1477 - birth name
                    // P1559 - name in native language
                    // P742 - pseudonym
                    const aliases = [];
                    
                    const nicknameClaims = entity.claims?.P1449 || [];
                    const birthNameClaims = entity.claims?.P1477 || [];
                    const nativeNameClaims = entity.claims?.P1559 || [];
                    const pseudonymClaims = entity.claims?.P742 || [];
                    
                    [nicknameClaims, birthNameClaims, nativeNameClaims, pseudonymClaims].forEach(claims => {
                        claims.forEach(claim => {
                            const value = claim.mainsnak?.datavalue?.value;
                            if (value) {
                                if (value.text) {
                                    aliases.push(value.text);
                                } else if (typeof value === 'string') {
                                    aliases.push(value);
                                }
                            }
                        });
                    });
                    
                    // Also check for aliases in Wikipedia page title variations
                    if (data.title && data.title !== name) {
                        aliases.push(data.title);
                    }
                    
                    if (aliases.length > 0) {
                        // Remove duplicates and the original name
                        const uniqueAliases = [...new Set(aliases)]
                            .filter(alias => alias && alias.toLowerCase() !== name.toLowerCase())
                            .slice(0, 3); // Limit to 3 nicknames
                        if (uniqueAliases.length > 0) {
                            nicknames = uniqueAliases.join(', ');
                        }
                    }
                }
            } catch (err) {
                console.error('Error fetching Wikidata:', err);
            }
        }

        return {
            name: data.title,
            gender: gender,
            nationality: nationality,
            photo: photo,
            nicknames: nicknames
        };

    } catch (error) {
        console.error('Error getting celebrity info:', error);
        return null;
    }
}

