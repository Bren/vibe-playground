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

async function fixStingRow() {
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
        
        // Find "Sting" row (case-insensitive, or in nicknames)
        const dataRows = rows.slice(1);
        let stingRow = null;
        let stingRowIndex = null;
        
        // First try exact match
        for (let i = 0; i < dataRows.length; i++) {
            const name = (dataRows[i][0] || '').trim();
            const nicknames = (dataRows[i][5] || '').trim();
            
            if (name.toLowerCase() === 'sting' || 
                name.toLowerCase().includes('sting') ||
                nicknames.toLowerCase().includes('sting')) {
                stingRow = {
                    rowIndex: i + 2,
                    name: name,
                    publishDate: (dataRows[i][1] || '').trim(),
                    gender: (dataRows[i][2] || '').trim(),
                    nationality: (dataRows[i][3] || '').trim(),
                    photo: (dataRows[i][4] || '').trim(),
                    nicknames: nicknames
                };
                stingRowIndex = i;
                console.log(`✅ Found row matching "Sting": "${name}" at row ${stingRow.rowIndex}`);
                break;
            }
        }
        
        if (!stingRow) {
            console.log('❌ Could not find "Sting" in the sheet');
            console.log('\n📋 Searching for rows with "sting" in name or nicknames...');
            // Show rows that might be related
            for (let i = 0; i < Math.min(100, dataRows.length); i++) {
                const name = (dataRows[i][0] || '').trim();
                const nicknames = (dataRows[i][5] || '').trim();
                if (name.toLowerCase().includes('sting') || nicknames.toLowerCase().includes('sting')) {
                    console.log(`   Row ${i + 2}: "${name}" (nicknames: ${nicknames || 'none'})`);
                }
            }
            return;
        }
        
        console.log('\n🔍 Current row data:');
        console.log(`   Row Index: ${stingRow.rowIndex}`);
        console.log(`   Name: ${stingRow.name}`);
        console.log(`   Publish Date: ${stingRow.publishDate}`);
        console.log(`   Gender: ${stingRow.gender || '(empty)'}`);
        console.log(`   Nationality: ${stingRow.nationality || '(empty)'}`);
        console.log(`   Photo: ${stingRow.photo ? 'has URL' : '(empty)'}`);
        console.log(`   Nicknames: ${stingRow.nicknames || '(empty)'}`);
        
        // Now get celebrity info - use the actual function logic
        console.log(`\n🔍 Fetching Wikipedia/Wikidata data...`);
        const celebInfo = await getCelebrityInfoFromName(stingRow.name, stingRow.nicknames);
        
        if (celebInfo) {
            console.log('\n✅ Found Wikipedia data:');
            console.log(`   Gender: ${celebInfo.gender || 'N/A'}`);
            console.log(`   Nationality: ${celebInfo.nationality || 'N/A'}`);
            console.log(`   Photo: ${celebInfo.photo ? 'has URL' : 'N/A'}`);
            console.log(`   Nicknames: ${celebInfo.nicknames || 'N/A'}`);
        } else {
            console.log('\n❌ Could not find Wikipedia data');
            return;
        }
        
        // Build updated row using the same logic as the function
        const fixedGender = stingRow.gender;
        const fixedNationality = stingRow.nationality;
        const fixedPhoto = stingRow.photo;
        
        const updatedRow = {
            name: stingRow.name,
            publishDate: stingRow.publishDate || '',
            gender: (fixedGender && fixedGender.trim()) ? fixedGender : (celebInfo?.gender || ''),
            nationality: (fixedNationality && fixedNationality.trim()) ? fixedNationality : (celebInfo?.nationality || ''),
            photo: (fixedPhoto && fixedPhoto.trim()) ? fixedPhoto : (celebInfo?.photo || ''),
            nicknames: mergeNicknames(stingRow.nicknames, celebInfo?.nicknames)
        };
        
        console.log('\n📝 Updated row data:');
        console.log(`   Gender: "${updatedRow.gender || '(empty)'}"`);
        console.log(`   Nationality: "${updatedRow.nationality || '(empty)'}"`);
        console.log(`   Photo: "${updatedRow.photo ? 'has URL' : '(empty)'}"`);
        console.log(`   Nicknames: "${updatedRow.nicknames || '(empty)'}"`);
        
        // Check if anything changed
        const normalize = (val) => (val || '').trim();
        const hasChanges = 
            normalize(updatedRow.gender) !== normalize(stingRow.gender) ||
            normalize(updatedRow.nationality) !== normalize(stingRow.nationality) ||
            normalize(updatedRow.photo) !== normalize(stingRow.photo) ||
            normalize(updatedRow.nicknames) !== normalize(stingRow.nicknames);
        
        if (!hasChanges) {
            console.log('\n⏭️ No changes needed - all data already filled');
            return;
        }
        
        console.log('\n📊 Changes detected:');
        if (normalize(updatedRow.gender) !== normalize(stingRow.gender)) {
            console.log(`   Gender: "${stingRow.gender || '(empty)'}" → "${updatedRow.gender || '(empty)'}"`);
        }
        if (normalize(updatedRow.nationality) !== normalize(stingRow.nationality)) {
            console.log(`   Nationality: "${stingRow.nationality || '(empty)'}" → "${updatedRow.nationality || '(empty)'}"`);
        }
        if (normalize(updatedRow.photo) !== normalize(stingRow.photo)) {
            console.log(`   Photo: "${stingRow.photo ? 'has URL' : '(empty)'}" → "${updatedRow.photo ? 'has URL' : '(empty)'}"`);
        }
        if (normalize(updatedRow.nicknames) !== normalize(stingRow.nicknames)) {
            console.log(`   Nicknames: "${stingRow.nicknames || '(empty)'}" → "${updatedRow.nicknames || '(empty)'}"`);
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
            range: `${SHEET_NAME}!A${stingRow.rowIndex}:F${stingRow.rowIndex}`,
            valueInputOption: 'RAW',
            resource: { values: values }
        });
        
        console.log('\n✅ Sheet update response:', JSON.stringify(updateResponse.data, null, 2));
        console.log(`\n✅ Successfully updated "${stingRow.name}" row!`);
        
        // Verify the update
        console.log('\n🔍 Verifying update...');
        const verifyResponse = await sheets.spreadsheets.values.get({
            spreadsheetId: SHEET_ID,
            range: `${SHEET_NAME}!A${stingRow.rowIndex}:F${stingRow.rowIndex}`,
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

// Import the getCelebrityInfoFromName function - simplified version
async function getCelebrityInfoFromName(name, nicknames = '') {
    try {
        // Try multiple search strategies
        const searchTerms = [];
        const isHebrewName = /[\u0590-\u05FF]/.test(name);
        
        // If we have nicknames, try those FIRST (often contain English names)
        if (nicknames) {
            const nicknameList = nicknames.split(',').map(n => n.trim()).filter(n => n);
            const englishNicks = nicknameList
                .filter(nick => /[a-zA-Z]/.test(nick) && nick.length > 2)
                .sort((a, b) => b.length - a.length);
            
            englishNicks.forEach(nick => {
                searchTerms.push({ term: nick, lang: 'en', priority: 1 });
            });
        }
        
        // Then try the original name
        if (isHebrewName) {
            searchTerms.push({ term: name, lang: 'he', priority: 2 });
            searchTerms.push({ term: name, lang: 'en', priority: 3 });
        } else {
            searchTerms.push({ term: name, lang: 'en', priority: 2 });
        }
        
        searchTerms.sort((a, b) => (a.priority || 3) - (b.priority || 3));
        
        let title = null;
        let wikiLang = 'en';
        
        // Try each search term
        for (const { term, lang } of searchTerms) {
            try {
                const wikiBase = lang === 'he' ? 'https://he.wikipedia.org' : 'https://en.wikipedia.org';
                const searchRes = await axios.get(`${wikiBase}/w/api.php`, {
                    params: {
                        action: 'query',
                        list: 'search',
                        srsearch: term,
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
                    wikiLang = lang;
                    console.log(`   ✅ Found Wikipedia page: ${title} (searched: ${term})`);
                    break;
                }
            } catch (err) {
                continue;
            }
        }
        
        // Try Wikidata search first to get the correct entity (better for disambiguation)
        let wikidataId = null;
        console.log(`   🔍 Searching Wikidata directly for: "${searchTerms[0].term}"...`);
        try {
            const wdSearchRes = await axios.get('https://www.wikidata.org/w/api.php', {
                params: {
                    action: 'wbsearchentities',
                    search: searchTerms[0].term,
                    language: 'en',
                    limit: 5,
                    format: 'json',
                    origin: '*'
                },
                headers: { 'User-Agent': 'PixelOptions/1.0 (contact@example.com)' },
                timeout: 5000
            });
            
            const wdResults = wdSearchRes.data?.search || [];
            if (wdResults.length > 0) {
                // Prefer results that look like people (have "musician", "singer", "actor", etc. in description)
                const personResults = wdResults.filter(r => 
                    r.description && (
                        r.description.toLowerCase().includes('musician') ||
                        r.description.toLowerCase().includes('singer') ||
                        r.description.toLowerCase().includes('actor') ||
                        r.description.toLowerCase().includes('person') ||
                        r.description.toLowerCase().includes('born')
                    )
                );
                const bestResult = personResults.length > 0 ? personResults[0] : wdResults[0];
                wikidataId = bestResult.id;
                console.log(`   ✅ Found Wikidata entity: ${wikidataId} (${bestResult.description || 'no description'})`);
            }
        } catch (err) {
            console.log(`   ⚠️ Wikidata search failed: ${err.message}`);
        }
        
        // If Wikidata search failed, try Wikipedia
        if (!wikidataId && title) {
            console.log(`   🔍 Falling back to Wikipedia page: ${title}`);
            const wikiBase = wikiLang === 'he' ? 'https://he.wikipedia.org' : 'https://en.wikipedia.org';
            try {
                const wikidataRes = await axios.get(`${wikiBase}/w/api.php`, {
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
                if (wikidataId) {
                    console.log(`   ✅ Found Wikidata ID from Wikipedia: ${wikidataId}`);
                }
            } catch (err) {
                console.error('   ⚠️ Error getting Wikidata ID from Wikipedia:', err.message);
            }
        }
        
        if (!wikidataId) {
            console.log('   ⚠️ No Wikidata ID found');
            return null;
        }
        
        // Get summary from Wikipedia for photo
        let photo = null;
        if (title) {
            try {
                const wikiBase = wikiLang === 'he' ? 'https://he.wikipedia.org' : 'https://en.wikipedia.org';
                const wikiRes = await axios.get(`${wikiBase}/api/rest_v1/page/summary/${encodeURIComponent(title)}`, {
                    headers: { 'User-Agent': 'PixelOptions/1.0 (contact@example.com)' },
                    timeout: 5000
                });
                const data = wikiRes.data;
                photo = data.thumbnail?.source || data.originalimage?.source || null;
                console.log(`   📊 Photo from Wikipedia: ${photo ? 'found' : 'not found'}`);
            } catch (err) {
                console.log(`   ⚠️ Could not get Wikipedia summary: ${err.message}`);
            }
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
                        props: 'claims|labels|sitelinks',
                        languages: 'en',
                        format: 'json',
                        origin: '*'
                    },
                    headers: { 'User-Agent': 'PixelOptions/1.0 (contact@example.com)' },
                    timeout: 5000
                });

                entity = wdRes.data.entities?.[wikidataId];
                if (entity) {
                    console.log(`   📊 Entity found, checking claims...`);
                    console.log(`   📊 Available claim properties: ${Object.keys(entity.claims || {}).join(', ')}`);
                    // Get gender
                    const genders = entity.claims?.P21 || [];
                    console.log(`   📊 Gender claims (P21): ${genders.length}`);
                    if (genders.length > 0) {
                        const genderId = genders[0].mainsnak?.datavalue?.value?.id;
                        console.log(`   📊 Gender ID: ${genderId}`);
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
                            console.log(`   📊 Gender label: ${genderLabel}`);
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

                    // Get nationality
                    let nationalityId = null;
                    const nationalities = entity.claims?.P27 || [];
                    console.log(`   📊 Nationality claims (P27): ${nationalities.length}`);
                    if (nationalities.length > 0) {
                        nationalityId = nationalities[0].mainsnak?.datavalue?.value?.id;
                        console.log(`   📊 Nationality ID (P27): ${nationalityId}`);
                    }
                    if (!nationalityId) {
                        const originCountries = entity.claims?.P495 || [];
                        console.log(`   📊 Origin country claims (P495): ${originCountries.length}`);
                        if (originCountries.length > 0) {
                            nationalityId = originCountries[0].mainsnak?.datavalue?.value?.id;
                            console.log(`   📊 Nationality ID (P495): ${nationalityId}`);
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
                        console.log(`   📊 Nationality label: ${nationality}`);
                    } else {
                        console.log(`   ⚠️ No nationality ID found`);
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

        // Get name from Wikidata labels or Wikipedia title
        let finalName = title || name;
        if (wikidataId && entity) {
            const labels = entity.labels || {};
            if (labels.en) {
                finalName = labels.en.value;
            }
        }
        
        return {
            name: finalName,
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

// Run the fix
fixStingRow()
    .then(() => {
        console.log('\n✅ Fix completed successfully!');
        process.exit(0);
    })
    .catch((error) => {
        console.error('\n❌ Fix failed:', error);
        process.exit(1);
    });

