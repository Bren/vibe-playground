const { google } = require('googleapis');
const axios = require('axios');

// Google Sheets configuration
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

async function testSingleRow() {
    try {
        const auth = new google.auth.GoogleAuth({
            credentials: credentials,
            scopes: ['https://www.googleapis.com/auth/spreadsheets']
        });

        const sheets = google.sheets({ version: 'v4', auth });
        
        // Fetch all rows to find "Sting"
        console.log('📊 Fetching all rows from sheet...');
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: SHEET_ID,
            range: `${SHEET_NAME}!A:F`,
        });

        const rows = response.data.values || [];
        console.log(`✅ Found ${rows.length} total rows (including header)`);
        
        // Find a test row - try "ריהאנה" (Rihanna) first, or any row with missing data
        const dataRows = rows.slice(1);
        let testRow = null;
        let testRowIndex = null;
        const searchNames = ['ריהאנה', 'ריהאנה', 'Rihanna']; // Try Hebrew first, then English
        
        // Try to find a row with missing data to test
        for (const searchName of searchNames) {
            for (let i = 0; i < dataRows.length; i++) {
                const name = (dataRows[i][0] || '').trim();
                if (name === searchName || name.toLowerCase() === searchName.toLowerCase()) {
                    const rowData = {
                        rowIndex: i + 2,
                        name: name,
                        publishDate: (dataRows[i][1] || '').trim(),
                        gender: (dataRows[i][2] || '').trim(),
                        nationality: (dataRows[i][3] || '').trim(),
                        photo: (dataRows[i][4] || '').trim(),
                        nicknames: (dataRows[i][5] || '').trim()
                    };
                    // Use this row if it has missing data
                    if (!rowData.gender || !rowData.nationality || !rowData.photo || !rowData.nicknames) {
                        testRow = rowData;
                        testRowIndex = i;
                        break;
                    }
                }
            }
            if (testRow) break;
        }
        
        // If still not found, find first row with missing data
        if (!testRow) {
            for (let i = 0; i < Math.min(50, dataRows.length); i++) {
                const name = (dataRows[i][0] || '').trim();
                if (!name) continue;
                const rowData = {
                    rowIndex: i + 2,
                    name: name,
                    publishDate: (dataRows[i][1] || '').trim(),
                    gender: (dataRows[i][2] || '').trim(),
                    nationality: (dataRows[i][3] || '').trim(),
                    photo: (dataRows[i][4] || '').trim(),
                    nicknames: (dataRows[i][5] || '').trim()
                };
                // Use first row with missing data
                if (!rowData.gender || !rowData.nationality || !rowData.photo || !rowData.nicknames) {
                    testRow = rowData;
                    testRowIndex = i;
                    console.log(`🔍 Found row with missing data: "${name}"`);
                    break;
                }
            }
        }
        
        if (!testRow) {
            console.log('❌ Could not find a suitable test row with missing data');
            return;
        }
        
        console.log('\n🔍 Found test row:');
        console.log(`   Row Index: ${testRow.rowIndex}`);
        console.log(`   Name: ${testRow.name}`);
        console.log(`   Publish Date: ${testRow.publishDate}`);
        console.log(`   Gender: ${testRow.gender || '(empty)'}`);
        console.log(`   Nationality: ${testRow.nationality || '(empty)'}`);
        console.log(`   Photo: ${testRow.photo ? 'has URL' : '(empty)'}`);
        console.log(`   Nicknames: ${testRow.nicknames || '(empty)'}`);
        
        // Now try to get celebrity info
        console.log(`\n🔍 Fetching Wikipedia/Wikidata data for "${testRow.name}"...`);
        const celebInfo = await getCelebrityInfoFromName(testRow.name, testRow.nicknames);
        
        if (celebInfo) {
            console.log('\n✅ Found Wikipedia data:');
            console.log(`   Gender: ${celebInfo.gender || 'N/A'}`);
            console.log(`   Nationality: ${celebInfo.nationality || 'N/A'}`);
            console.log(`   Photo: ${celebInfo.photo ? 'has URL' : 'N/A'}`);
            console.log(`   Nicknames: ${celebInfo.nicknames || 'N/A'}`);
        } else {
            console.log('\n❌ Could not find Wikipedia data for Sting');
            return;
        }
        
        // Build updated row
        const updatedRow = {
            name: testRow.name,
            publishDate: testRow.publishDate || '',
            gender: (testRow.gender && testRow.gender.trim()) ? testRow.gender : (celebInfo?.gender || ''),
            nationality: (testRow.nationality && testRow.nationality.trim()) ? testRow.nationality : (celebInfo?.nationality || ''),
            photo: (testRow.photo && testRow.photo.trim()) ? testRow.photo : (celebInfo?.photo || ''),
            nicknames: mergeNicknames(testRow.nicknames, celebInfo?.nicknames)
        };
        
        console.log('\n📝 Updated row data:');
        console.log(`   Gender: "${updatedRow.gender || '(empty)'}"`);
        console.log(`   Nationality: "${updatedRow.nationality || '(empty)'}"`);
        console.log(`   Photo: "${updatedRow.photo ? 'has URL' : '(empty)'}"`);
        console.log(`   Nicknames: "${updatedRow.nicknames || '(empty)'}"`);
        
        // Check if anything changed
        const normalize = (val) => (val || '').trim();
        const hasChanges = 
            normalize(updatedRow.gender) !== normalize(testRow.gender) ||
            normalize(updatedRow.nationality) !== normalize(testRow.nationality) ||
            normalize(updatedRow.photo) !== normalize(testRow.photo) ||
            normalize(updatedRow.nicknames) !== normalize(testRow.nicknames);
        
        if (!hasChanges) {
            console.log('\n⏭️ No changes needed - all data already filled');
            return;
        }
        
        console.log('\n📊 Changes detected:');
        if (normalize(updatedRow.gender) !== normalize(testRow.gender)) {
            console.log(`   Gender: "${testRow.gender || '(empty)'}" → "${updatedRow.gender || '(empty)'}"`);
        }
        if (normalize(updatedRow.nationality) !== normalize(testRow.nationality)) {
            console.log(`   Nationality: "${testRow.nationality || '(empty)'}" → "${updatedRow.nationality || '(empty)'}"`);
        }
        if (normalize(updatedRow.photo) !== normalize(testRow.photo)) {
            console.log(`   Photo: "${testRow.photo ? 'has URL' : '(empty)'}" → "${updatedRow.photo ? 'has URL' : '(empty)'}"`);
        }
        if (normalize(updatedRow.nicknames) !== normalize(testRow.nicknames)) {
            console.log(`   Nicknames: "${testRow.nicknames || '(empty)'}" → "${updatedRow.nicknames || '(empty)'}"`);
        }
        
        // Update the row in the sheet
        console.log('\n💾 Updating Google Sheet...');
        const values = [[
            updatedRow.name,
            updatedRow.publishDate,
            updatedRow.gender,
            updatedRow.nationality,
            updatedRow.photo,
            updatedRow.nicknames
        ]];
        
        const updateResponse = await sheets.spreadsheets.values.update({
            spreadsheetId: SHEET_ID,
            range: `${SHEET_NAME}!A${testRow.rowIndex}:F${testRow.rowIndex}`,
            valueInputOption: 'RAW',
            resource: { values: values }
        });
        
        console.log('\n✅ Sheet update response:', JSON.stringify(updateResponse.data, null, 2));
        console.log(`\n✅ Successfully updated "${testRow.name}" row!`);
        
        // Verify the update by reading the row again
        console.log('\n🔍 Verifying update by reading row again...');
        const verifyResponse = await sheets.spreadsheets.values.get({
            spreadsheetId: SHEET_ID,
            range: `${SHEET_NAME}!A${testRow.rowIndex}:F${testRow.rowIndex}`,
        });
        
        const updatedRowData = verifyResponse.data.values?.[0] || [];
        console.log('\n📊 Updated row data from sheet:');
        console.log(`   Name: ${updatedRowData[0] || ''}`);
        console.log(`   Publish Date: ${updatedRowData[1] || ''}`);
        console.log(`   Gender: ${updatedRowData[2] || '(empty)'}`);
        console.log(`   Nationality: ${updatedRowData[3] || '(empty)'}`);
        console.log(`   Photo: ${updatedRowData[4] ? 'has URL' : '(empty)'}`);
        console.log(`   Nicknames: ${updatedRowData[5] || '(empty)'}`);
        
    } catch (error) {
        console.error('❌ Error:', error);
        throw error;
    }
}

// Copy the getCelebrityInfoFromName function from complete-incomplete-rows.js
// (I'll import the key parts)
async function getCelebrityInfoFromName(name, nicknames = '') {
    // Simplified version - just get basic info
    try {
        // Search Wikipedia - try with nicknames first if available
        let searchTerm = name;
        if (nicknames) {
            const nicknameList = nicknames.split(',').map(n => n.trim()).filter(n => n);
            // Look for English names in nicknames
            const englishNicks = nicknameList.filter(nick => /[a-zA-Z]/.test(nick) && nick.length > 2);
            if (englishNicks.length > 0) {
                // Use longest English nickname
                searchTerm = englishNicks.sort((a, b) => b.length - a.length)[0];
                console.log(`   🔍 Using nickname for search: "${searchTerm}"`);
            }
        }
        
        const searchRes = await axios.get(`https://en.wikipedia.org/w/api.php`, {
            params: {
                action: 'query',
                list: 'search',
                srsearch: searchTerm,
                srlimit: 5,
                srnamespace: 0,
                format: 'json',
                origin: '*'
            },
            headers: { 'User-Agent': 'PixelOptions/1.0 (contact@example.com)' },
            timeout: 5000
        });
        
        const results = searchRes.data.query?.search || [];
        if (results.length === 0) {
            console.log('   ⚠️ No Wikipedia results');
            return null;
        }
        
        const title = results[0].title;
        console.log(`   ✅ Found Wikipedia page: ${title}`);
        
        // Get summary
        const wikiRes = await axios.get(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`, {
            headers: { 'User-Agent': 'PixelOptions/1.0 (contact@example.com)' },
            timeout: 5000
        });

        const data = wikiRes.data;
        let photo = data.thumbnail?.source || data.originalimage?.source || null;
        
        // Get Wikidata ID
        let wikidataId = null;
        try {
            const wikidataRes = await axios.get(`https://en.wikipedia.org/w/api.php`, {
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
            console.error('   ⚠️ Error getting Wikidata ID:', err.message);
        }
        
        let gender = null;
        let nationality = null;
        let extractedNicknames = null;
        
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
                    headers: { 'User-Agent': 'PixelOptions/1.0 (contact@example.com)' },
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
                                },
                                headers: { 'User-Agent': 'PixelOptions/1.0 (contact@example.com)' },
                                timeout: 3000
                            });
                            const genderLabel = genderRes.data.entities?.[genderId]?.labels?.en?.value;
                            if (genderLabel) {
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

                    // Get nationality (P27 or P495)
                    let nationalityId = null;
                    const nationalities = entity.claims?.P27 || [];
                    if (nationalities.length > 0) {
                        nationalityId = nationalities[0].mainsnak?.datavalue?.value?.id;
                    }
                    if (!nationalityId) {
                        const originCountries = entity.claims?.P495 || [];
                        if (originCountries.length > 0) {
                            nationalityId = originCountries[0].mainsnak?.datavalue?.value?.id;
                        }
                    }
                    
                    if (nationalityId) {
                        const natRes = await axios.get(`https://www.wikidata.org/w/api.php`, {
                            params: {
                                action: 'wbgetentities',
                                ids: nationalityId,
                                props: 'labels',
                                languages: 'en',
                                format: 'json',
                                origin: '*'
                            },
                            headers: { 'User-Agent': 'PixelOptions/1.0 (contact@example.com)' },
                            timeout: 3000
                        });
                        nationality = natRes.data.entities?.[nationalityId]?.labels?.en?.value || null;
                    }
                    
                    // Get nicknames
                    const aliases = [];
                    const extractTextValue = (claim) => {
                        const value = claim.mainsnak?.datavalue?.value;
                        if (value) {
                            if (value.text) return value.text;
                            if (typeof value === 'string') return value;
                        }
                        return null;
                    };
                    
                    const nicknameClaims = entity.claims?.P1449 || [];
                    const birthNameClaims = entity.claims?.P1477 || [];
                    const nativeNameClaims = entity.claims?.P1559 || [];
                    const pseudonymClaims = entity.claims?.P742 || [];
                    
                    [nicknameClaims, birthNameClaims, nativeNameClaims, pseudonymClaims].forEach(claims => {
                        claims.forEach(claim => {
                            const text = extractTextValue(claim);
                            if (text) aliases.push(text);
                        });
                    });
                    
                    if (aliases.length > 0) {
                        const uniqueAliases = [...new Set(aliases)]
                            .filter(alias => alias && alias.trim() && alias.toLowerCase() !== name.toLowerCase())
                            .slice(0, 10);
                        if (uniqueAliases.length > 0) {
                            extractedNicknames = uniqueAliases.join(', ');
                        }
                    }
                }
            } catch (err) {
                console.error('   ⚠️ Error fetching Wikidata:', err);
            }
        }

        return {
            name: data.title,
            gender: gender,
            nationality: nationality,
            photo: photo,
            nicknames: extractedNicknames
        };

    } catch (error) {
        console.error('   ❌ Error getting celebrity info:', error);
        return null;
    }
}

function mergeNicknames(existing, fromWiki) {
    const existingList = existing ? existing.split(',').map(n => n.trim()).filter(n => n) : [];
    const wikiList = fromWiki ? fromWiki.split(',').map(n => n.trim()).filter(n => n) : [];
    
    const all = [...existingList];
    wikiList.forEach(nick => {
        const normalized = nick.toLowerCase();
        if (!all.some(ex => ex.toLowerCase() === normalized)) {
            all.push(nick);
        }
    });
    
    return all.length > 0 ? all.join(', ') : '';
}

// Run the test
testSingleRow()
    .then(() => {
        console.log('\n✅ Test completed successfully!');
        process.exit(0);
    })
    .catch((error) => {
        console.error('\n❌ Test failed:', error);
        process.exit(1);
    });

