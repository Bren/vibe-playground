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
            range: `${SHEET_NAME}!A:F`,
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
                photo: (row[4] || '').trim(),
                nicknames: (row[5] || '').trim()
            };
            
            // Check if row is complete (all 6 columns filled)
            const isComplete = rowData.name && 
                              rowData.publishDate && 
                              rowData.gender && 
                              rowData.nationality && 
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
        
        // Process incomplete rows in batches to avoid timeout
        // Netlify free tier has ~10-26 second timeout, so we'll process in batches
        const BATCH_SIZE = 100; // Process 100 rows at a time
        const rowsToProcess = incompleteRows.slice(0, BATCH_SIZE);
        
        console.log(`📊 Processing ${rowsToProcess.length} rows (out of ${incompleteRows.length} incomplete rows)`);
        console.log(`   Note: Processing in batches of ${BATCH_SIZE} to avoid timeout. Click again to process more.`);
        console.log(`   Sample of rows to process: ${rowsToProcess.slice(0, 5).map(r => r.name).join(', ')}...`);
        
        const updatedRows = [];
        const errors = [];
        let processedCount = 0;
        let skippedCount = 0;
        
        for (const row of rowsToProcess) {
            // Skip rows without a name (can't look up data)
            if (!row.name) {
                console.log(`⏭️ Skipping row ${row.rowIndex} - no name`);
                errors.push({ rowIndex: row.rowIndex, error: 'No name provided' });
                continue;
            }
            
            try {
                console.log(`🔍 Processing row ${row.rowIndex}: ${row.name}`);
                console.log(`   Current data: gender=${row.gender}, nationality=${row.nationality}, photo=${row.photo ? 'yes' : 'no'}, nicknames=${row.nicknames}`);
                
                // Fill in missing fields (only fill what's missing, preserve existing data)
                // Also fix misaligned columns - if URLs are in wrong places, fix them
                let fixedGender = row.gender;
                let fixedNationality = row.nationality;
                let fixedPhoto = row.photo;
                
                // Check if columns are misaligned (e.g., URLs in wrong places)
                // More aggressive misalignment detection
                if (row.gender && (
                    row.gender.includes('http') ||
                    row.gender.includes('://') ||
                    row.gender.match(/^https?:\/\//)
                )) {
                    // Gender column has URL, shift to photo
                    console.log(`   ⚠️ Detected URL in gender column for row ${row.rowIndex}, fixing...`);
                    fixedPhoto = row.gender; // Move URL to photo
                    fixedGender = '';
                }
                
                // Check if nationality column has URL (should be in photo column)
                if (row.nationality && (row.nationality.includes('http') || row.nationality.includes('://'))) {
                    console.log(`   ⚠️ Detected URL in nationality column for row ${row.rowIndex}, fixing...`);
                    fixedPhoto = row.nationality; // Move URL to photo
                    fixedNationality = '';
                }
                
                // Try to fetch data from Wikipedia/Wikidata (try with nicknames if available)
                let celebInfo = null;
                try {
                    console.log(`   🔍 Attempting Wikipedia lookup for: "${row.name}"${row.nicknames ? ` (nicknames: ${row.nicknames})` : ''}`);
                    const lookupStartTime = Date.now();
                    celebInfo = await getCelebrityInfoFromName(row.name, row.nicknames);
                    const lookupDuration = Date.now() - lookupStartTime;
                    console.log(`   ⏱️ Lookup took ${lookupDuration}ms`);
                    
                    if (celebInfo) {
                        console.log(`   ✅ Found Wikipedia data: gender=${celebInfo.gender || 'N/A'}, nationality=${celebInfo.nationality || 'N/A'}, photo=${celebInfo.photo ? 'yes (' + celebInfo.photo.substring(0, 50) + '...)' : 'no'}, nicknames=${celebInfo.nicknames || 'N/A'}`);
                    } else {
                        console.log(`   ⚠️ Could not find Wikipedia data for: ${row.name}`);
                        console.log(`   📊 Row needs: gender=${!row.gender ? 'YES' : 'no'}, nationality=${!row.nationality ? 'YES' : 'no'}, photo=${!row.photo ? 'YES' : 'no'}, nicknames=${!row.nicknames ? 'YES' : 'no'}`);
                    }
                } catch (err) {
                    console.log(`   ❌ Error fetching Wikipedia data: ${err.message}`);
                    console.log(`   📋 Error details: ${err.stack || 'No stack trace'}`);
                }
                
                // Build updated row - fill missing fields with Wikipedia data
                // Only use existing data if it's not empty, otherwise use Wikipedia data
                const updatedRow = {
                    name: row.name, // Keep original name
                    publishDate: row.publishDate || '', // Keep publish date if exists
                    // Use existing value if present, otherwise use Wikipedia data
                    gender: (fixedGender && fixedGender.trim()) ? fixedGender : (celebInfo?.gender || ''),
                    nationality: (fixedNationality && fixedNationality.trim()) ? fixedNationality : (celebInfo?.nationality || ''),
                    photo: (fixedPhoto && fixedPhoto.trim()) ? fixedPhoto : (celebInfo?.photo || ''),
                    // For nicknames, merge existing with Wikipedia data (avoid duplicates)
                    nicknames: mergeNicknames(row.nicknames, celebInfo?.nicknames)
                };
                
                // Normalize empty strings for comparison
                const normalize = (val) => (val || '').trim();
                const originalRow = {
                    gender: normalize(row.gender),
                    nationality: normalize(row.nationality),
                    photo: normalize(row.photo),
                    nicknames: normalize(row.nicknames)
                };
                const updatedRowNormalized = {
                    gender: normalize(updatedRow.gender),
                    nationality: normalize(updatedRow.nationality),
                    photo: normalize(updatedRow.photo),
                    nicknames: normalize(updatedRow.nicknames)
                };
                
                // Check if anything actually changed
                const hasChanges = 
                    updatedRowNormalized.gender !== originalRow.gender ||
                    updatedRowNormalized.nationality !== originalRow.nationality ||
                    updatedRowNormalized.photo !== originalRow.photo ||
                    updatedRowNormalized.nicknames !== originalRow.nicknames;
                
                // Debug: Log comparison details
                console.log(`   🔍 Change detection for row ${row.rowIndex}:`);
                console.log(`      Gender: "${originalRow.gender || '(empty)'}" vs "${updatedRowNormalized.gender || '(empty)'}" → ${updatedRowNormalized.gender !== originalRow.gender ? '✅ CHANGE' : '❌ same'}`);
                console.log(`      Nationality: "${originalRow.nationality || '(empty)'}" vs "${updatedRowNormalized.nationality || '(empty)'}" → ${updatedRowNormalized.nationality !== originalRow.nationality ? '✅ CHANGE' : '❌ same'}`);
                console.log(`      Photo: "${originalRow.photo ? 'has URL' : '(empty)'}" vs "${updatedRowNormalized.photo ? 'has URL' : '(empty)'}" → ${updatedRowNormalized.photo !== originalRow.photo ? '✅ CHANGE' : '❌ same'}`);
                console.log(`      Nicknames: "${originalRow.nicknames || '(empty)'}" vs "${updatedRowNormalized.nicknames || '(empty)'}" → ${updatedRowNormalized.nicknames !== originalRow.nicknames ? '✅ CHANGE' : '❌ same'}`);
                
                // Additional debug: Show what celebInfo provided
                if (celebInfo) {
                    console.log(`   📊 celebInfo provided: gender="${celebInfo.gender || 'none'}", nationality="${celebInfo.nationality || 'none'}", photo="${celebInfo.photo ? 'yes' : 'no'}", nicknames="${celebInfo.nicknames || 'none'}"`);
                } else {
                    console.log(`   ⚠️ celebInfo is null - no Wikipedia data found`);
                }
                
                if (!hasChanges) {
                    console.log(`   ⏭️ No changes needed for row ${row.rowIndex}: ${row.name}`);
                    console.log(`   💡 Reason: All fields are either already filled OR Wikipedia lookup returned no data`);
                    skippedCount++;
                    continue;
                }
                
                processedCount++;
                
                console.log(`   📊 Changes detected:`);
                if (updatedRowNormalized.gender !== originalRow.gender) {
                    console.log(`      Gender: "${originalRow.gender || '(empty)'}" → "${updatedRowNormalized.gender || '(empty)'}"`);
                }
                if (updatedRowNormalized.nationality !== originalRow.nationality) {
                    console.log(`      Nationality: "${originalRow.nationality || '(empty)'}" → "${updatedRowNormalized.nationality || '(empty)'}"`);
                }
                if (updatedRowNormalized.photo !== originalRow.photo) {
                    console.log(`      Photo: "${originalRow.photo ? 'has URL' : '(empty)'}" → "${updatedRowNormalized.photo ? 'has URL' : '(empty)'}"`);
                }
                if (updatedRowNormalized.nicknames !== originalRow.nicknames) {
                    console.log(`      Nicknames: "${originalRow.nicknames || '(empty)'}" → "${updatedRowNormalized.nicknames || '(empty)'}"`);
                }
                
                console.log(`   📝 Final values: gender="${updatedRow.gender || '(empty)'}", nationality="${updatedRow.nationality || '(empty)'}", photo="${updatedRow.photo ? 'has URL' : '(empty)'}", nicknames="${updatedRow.nicknames || '(empty)'}"`);
                
                // Update the row in the sheet
                const values = [[
                    updatedRow.name,
                    updatedRow.publishDate,
                    updatedRow.gender,
                    updatedRow.nationality,
                    updatedRow.photo,
                    updatedRow.nicknames
                ]];
                
                try {
                    const updateResponse = await sheets.spreadsheets.values.update({
                        spreadsheetId: SHEET_ID,
                        range: `${SHEET_NAME}!A${row.rowIndex}:F${row.rowIndex}`,
                        valueInputOption: 'RAW',
                        resource: { values: values }
                    });
                    
                    console.log(`   ✅ Sheet update response: ${JSON.stringify(updateResponse.data)}`);
                    
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
                    
                    console.log(`✅ Successfully updated row ${row.rowIndex}: ${row.name}`);
                } catch (updateError) {
                    console.error(`❌ Error updating row ${row.rowIndex} in sheet:`, updateError);
                    errors.push({ rowIndex: row.rowIndex, name: row.name, error: `Update failed: ${updateError.message}` });
                    continue;
                }
                
                // Small delay to avoid rate limiting (reduced for faster processing)
                // Only delay every 10 rows to speed up processing
                if (updatedRows.length % 10 === 0) {
                    await new Promise(resolve => setTimeout(resolve, 100));
                }
                
            } catch (error) {
                console.error(`❌ Error processing row ${row.rowIndex} (${row.name}):`, error.message);
                errors.push({ rowIndex: row.rowIndex, name: row.name, error: error.message });
            }
        }
        
        console.log(`\n📊 Final Summary:`);
        console.log(`   - Total rows processed: ${rowsToProcess.length}`);
        console.log(`   - Rows with changes detected: ${processedCount}`);
        console.log(`   - Rows skipped (no changes): ${skippedCount}`);
        console.log(`   - Rows successfully updated: ${updatedRows.length}`);
        console.log(`   - Errors: ${errors.length}`);
        
        return {
            statusCode: 200,
            headers: { ...headers, 'Content-Type': 'application/json' },
            body: JSON.stringify({
                success: true,
                message: `Processed ${rowsToProcess.length} rows (${incompleteRows.length - rowsToProcess.length} remaining)`,
                completeRows: completeRows.length,
                incompleteRows: incompleteRows.length,
                processed: rowsToProcess.length,
                remaining: incompleteRows.length - rowsToProcess.length,
                updated: updatedRows.length,
                skipped: skippedCount,
                updatedRows: updatedRows.slice(0, 50), // Limit to first 50 for response size
                errors: errors.length,
                errorDetails: errors.slice(0, 20) // Limit error details to first 20
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
        // PRIORITIZE nicknames first (they often have English names)
        const searchTerms = [];
        const isHebrewName = /[\u0590-\u05FF]/.test(name);
        
        // If we have nicknames, try those FIRST (often contain English names)
        if (nicknames) {
            const nicknameList = nicknames.split(',').map(n => n.trim()).filter(n => n);
            // Look for English names in nicknames (non-Hebrew characters)
            // Prioritize longer names (more likely to be full names)
            const englishNicks = nicknameList
                .filter(nick => /[a-zA-Z]/.test(nick) && nick.length > 2)
                .sort((a, b) => b.length - a.length); // Sort by length, longest first
            
            englishNicks.forEach(nick => {
                searchTerms.push({ term: nick, lang: 'en', priority: 1 }); // High priority
            });
        }
        
        // Then try the original name
        if (isHebrewName) {
            // Try Hebrew Wikipedia first for Hebrew names
            searchTerms.push({ term: name, lang: 'he', priority: 2 });
            searchTerms.push({ term: name, lang: 'en', priority: 3 }); // Also try English
        } else {
            // English name, try English Wikipedia
            searchTerms.push({ term: name, lang: 'en', priority: 2 });
        }
        
        // Sort by priority (lower number = higher priority)
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
                    console.log(`   ✅ Found Wikipedia page: ${title} (searched: ${term} on ${lang === 'he' ? 'Hebrew' : 'English'} Wikipedia)`);
                    break;
                }
            } catch (err) {
                console.log(`   ⚠️ Search failed for "${term}" on ${lang === 'he' ? 'Hebrew' : 'English'} Wikipedia: ${err.message}`);
                continue;
            }
        }
        
        // Try Wikidata search directly FIRST (better for disambiguation)
        // This helps avoid getting disambiguation pages from Wikipedia
        let wikidataIdFromSearch = null;
        console.log(`   🔍 Searching Wikidata directly for: "${searchTerms[0].term}"...`);
        for (const { term, lang } of searchTerms.slice(0, 3)) {
            try {
                const wdSearchRes = await axios.get('https://www.wikidata.org/w/api.php', {
                    params: {
                        action: 'wbsearchentities',
                        search: term,
                        language: lang === 'he' ? 'he' : 'en',
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
                            r.description.toLowerCase().includes('born') ||
                            r.description.toLowerCase().includes('character')
                        )
                    );
                    const bestResult = personResults.length > 0 ? personResults[0] : wdResults[0];
                    wikidataIdFromSearch = bestResult.id;
                    console.log(`   ✅ Found Wikidata entity: ${wikidataIdFromSearch} (${bestResult.description || 'no description'})`);
                    break;
                }
            } catch (err) {
                console.log(`   ⚠️ Wikidata search failed for "${term}": ${err.message}`);
                continue;
            }
        }
        
        // If Wikidata search failed, try Wikipedia
        if (!wikidataIdFromSearch && !title) {
            console.log(`   ⚠️ No Wikidata results, trying Wikipedia search...`);
            // Continue with Wikipedia search below
        }
        
        // If we found Wikidata ID directly, use it
        if (wikidataIdFromSearch) {
            return await getCelebrityInfoFromWikidataId(wikidataIdFromSearch);
        }
        
        // If Wikipedia search also failed, return null
        if (!title) {
            console.log(`   ❌ No results from Wikipedia or Wikidata`);
            return null;
        }
        
        // Get detailed info from the appropriate Wikipedia
        const wikiBase = wikiLang === 'he' ? 'https://he.wikipedia.org' : 'https://en.wikipedia.org';
        const wikiRes = await axios.get(`${wikiBase}/api/rest_v1/page/summary/${encodeURIComponent(title)}`, {
            headers: { 'User-Agent': 'PixelOptions/1.0 (contact@example.com)' },
            timeout: 5000
        });

        const data = wikiRes.data;
        
        if (!data.extract || data.type !== 'standard') {
            return null;
        }
        
        // Try to get photo from Wikipedia summary first (best quality)
        let photo = data.thumbnail?.source || data.originalimage?.source || null;
        if (photo) {
            console.log(`   📸 Found photo from Wikipedia summary: ${photo.substring(0, 80)}...`);
        }
        
        // Get Wikidata ID from the appropriate Wikipedia
        let wikidataId = null;
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
        } catch (err) {
            console.error('Error getting Wikidata ID:', err.message);
        }
        
        let gender = null;
        let nationality = null;
        // Photo already extracted from Wikipedia summary above, but we'll try to get better one from Wikidata
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
                    headers: { 'User-Agent': 'PixelOptions/1.0 (contact@example.com)' },
                    timeout: 5000
                });

                const entity = wdRes.data.entities?.[wikidataId];
                if (entity) {
                    // Get photo from Wikidata P18 (image property) - try multiple formats
                    const photos = entity.claims?.P18 || [];
                    if (photos.length > 0) {
                        const photoValue = photos[0].mainsnak?.datavalue?.value;
                        if (photoValue) {
                            const filename = photoValue.replace(/ /g, '_');
                            
                            // Try direct Commons file URL (most reliable format)
                            // Format: https://upload.wikimedia.org/wikipedia/commons/[first char]/[first 2 chars]/[filename]
                            const firstChar = filename.substring(0, 1);
                            const firstTwoChars = filename.substring(0, 2);
                            const directCommonsUrl = `https://upload.wikimedia.org/wikipedia/commons/${firstChar}/${firstTwoChars}/${encodeURIComponent(filename)}`;
                            
                            if (!photo) {
                                photo = directCommonsUrl;
                                console.log(`   📸 Found photo from Wikidata P18 (direct): ${photo.substring(0, 80)}...`);
                            } else {
                                // Upgrade to Commons direct URL for better quality
                                console.log(`   📸 Upgrading to Commons direct URL: ${directCommonsUrl.substring(0, 80)}...`);
                                photo = directCommonsUrl;
                            }
                        }
                    }
                    
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

        // Get nationality - try multiple properties (same logic as getCelebrityInfoFromWikidataId)
        let nationalityId = null;
        
        // First try P27 (citizenship) - most common for real people
        const nationalities = entity.claims?.P27 || [];
        if (nationalities.length > 0) {
            nationalityId = nationalities[0].mainsnak?.datavalue?.value?.id;
        }
        
        // If no citizenship, try P495 (country of origin) - for fictional characters
        if (!nationalityId) {
            const originCountries = entity.claims?.P495 || [];
            if (originCountries.length > 0) {
                nationalityId = originCountries[0].mainsnak?.datavalue?.value?.id;
            }
        }
        
        // If still no nationality, try P19 (place of birth) - can infer nationality
        if (!nationalityId) {
            const birthPlaces = entity.claims?.P19 || [];
            if (birthPlaces.length > 0) {
                const birthPlaceId = birthPlaces[0].mainsnak?.datavalue?.value?.id;
                if (birthPlaceId) {
                    // Get the birth place entity to see if it has country info
                    try {
                        const birthPlaceRes = await axios.get(`https://www.wikidata.org/w/api.php`, {
                            params: {
                                action: 'wbgetentities',
                                ids: birthPlaceId,
                                props: 'claims',
                                format: 'json',
                                origin: '*'
                            },
                            headers: { 'User-Agent': 'PixelOptions/1.0 (contact@example.com)' },
                            timeout: 3000
                        });
                        const birthPlaceEntity = birthPlaceRes.data.entities?.[birthPlaceId];
                        // Check if birth place has P17 (country) property
                        const countryClaims = birthPlaceEntity?.claims?.P17 || [];
                        if (countryClaims.length > 0) {
                            nationalityId = countryClaims[0].mainsnak?.datavalue?.value?.id;
                        }
                    } catch (e) {
                        // Ignore errors, just continue
                    }
                }
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
                    
                    // Get comprehensive nicknames/aliases/name variations
                    // P1449 - nickname
                    // P1477 - birth name (full real name)
                    // P1559 - name in native language
                    // P742 - pseudonym
                    // P1705 - native label (full name)
                    // P2561 - name (full name)
                    const aliases = [];
                    
                    const extractTextValue = (claim) => {
                        const value = claim.mainsnak?.datavalue?.value;
                        if (value) {
                            if (value.text) return value.text;
                            if (typeof value === 'string') return value;
                        }
                        return null;
                    };
                    
                    // Extract from various name properties
                    const nicknameClaims = entity.claims?.P1449 || [];
                    const birthNameClaims = entity.claims?.P1477 || [];
                    const nativeNameClaims = entity.claims?.P1559 || [];
                    const pseudonymClaims = entity.claims?.P742 || [];
                    const nativeLabelClaims = entity.claims?.P1705 || [];
                    const nameClaims = entity.claims?.P2561 || [];
                    
                    [nicknameClaims, birthNameClaims, nativeNameClaims, pseudonymClaims, nativeLabelClaims, nameClaims].forEach(claims => {
                        claims.forEach(claim => {
                            const text = extractTextValue(claim);
                            if (text) aliases.push(text);
                        });
                    });
                    
                    // Also check for aliases in Wikipedia page title variations
                    if (data.title && data.title !== name) {
                        aliases.push(data.title);
                    }
                    
                    // Get all labels (English, Hebrew, etc.) as potential name variations
                    const entityLabels = entity.labels || {};
                    Object.values(entityLabels).forEach(label => {
                        if (label && label.value && label.value !== name) {
                            aliases.push(label.value);
                        }
                    });
                    
                    if (aliases.length > 0) {
                        // Remove duplicates and the original name, limit to reasonable number
                        const uniqueAliases = [...new Set(aliases)]
                            .filter(alias => alias && alias.trim() && alias.toLowerCase() !== name.toLowerCase())
                            .slice(0, 10); // Increased limit to get more name variations
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

// Helper function to get celebrity info directly from Wikidata ID
async function getCelebrityInfoFromWikidataId(wikidataId) {
    try {
        const wdRes = await axios.get(`https://www.wikidata.org/w/api.php`, {
            params: {
                action: 'wbgetentities',
                ids: wikidataId,
                props: 'claims|labels',
                languages: 'en|he',
                format: 'json',
                origin: '*'
            },
            headers: { 'User-Agent': 'PixelOptions/1.0 (contact@example.com)' },
            timeout: 5000
        });

        const entity = wdRes.data.entities?.[wikidataId];
        if (!entity) {
            return null;
        }
        
        let gender = null;
        let nationality = null;
        let photo = null;
        let nicknames = null;
        
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

        // Get nationality - try multiple properties
        // P27 - country of citizenship (for real people)
        // P495 - country of origin (for fictional characters/works)
        // P19 - place of birth (can infer nationality)
        let nationalityId = null;
        
        // First try P27 (citizenship) - most common for real people
        const nationalities = entity.claims?.P27 || [];
        if (nationalities.length > 0) {
            nationalityId = nationalities[0].mainsnak?.datavalue?.value?.id;
        }
        
        // If no citizenship, try P495 (country of origin) - for fictional characters
        if (!nationalityId) {
            const originCountries = entity.claims?.P495 || [];
            if (originCountries.length > 0) {
                nationalityId = originCountries[0].mainsnak?.datavalue?.value?.id;
            }
        }
        
        // If still no nationality, try P19 (place of birth) - can infer nationality
        if (!nationalityId) {
            const birthPlaces = entity.claims?.P19 || [];
            if (birthPlaces.length > 0) {
                const birthPlaceId = birthPlaces[0].mainsnak?.datavalue?.value?.id;
                if (birthPlaceId) {
                    // Get the birth place entity to see if it has country info
                    try {
                        const birthPlaceRes = await axios.get(`https://www.wikidata.org/w/api.php`, {
                            params: {
                                action: 'wbgetentities',
                                ids: birthPlaceId,
                                props: 'claims',
                                format: 'json',
                                origin: '*'
                            },
                            headers: { 'User-Agent': 'PixelOptions/1.0 (contact@example.com)' },
                            timeout: 3000
                        });
                        const birthPlaceEntity = birthPlaceRes.data.entities?.[birthPlaceId];
                        // Check if birth place has P17 (country) property
                        const countryClaims = birthPlaceEntity?.claims?.P17 || [];
                        if (countryClaims.length > 0) {
                            nationalityId = countryClaims[0].mainsnak?.datavalue?.value?.id;
                        }
                    } catch (e) {
                        // Ignore errors, just continue
                    }
                }
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
        
        // Get photo (P18) - try multiple sources for best quality
        const photos = entity.claims?.P18 || [];
        if (photos.length > 0) {
            const photoValue = photos[0].mainsnak?.datavalue?.value;
            if (photoValue) {
                const filename = photoValue.replace(/ /g, '_');
                
                // Strategy 1: Try Wikipedia summary API for thumbnail (fast, good quality)
                try {
                    const wikiTitle = entity.labels?.en?.value || entity.labels?.he?.value;
                    if (wikiTitle) {
                        try {
                            const wikiSummary = await axios.get(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(wikiTitle)}`, {
                                headers: { 'User-Agent': 'PixelOptions/1.0 (contact@example.com)' },
                                timeout: 3000
                            });
                            if (wikiSummary.data.thumbnail?.source) {
                                photo = wikiSummary.data.thumbnail.source;
                                console.log(`   📸 Found photo from Wikipedia summary: ${photo.substring(0, 80)}...`);
                            } else if (wikiSummary.data.originalimage?.source) {
                                photo = wikiSummary.data.originalimage.source;
                                console.log(`   📸 Found photo from Wikipedia original: ${photo.substring(0, 80)}...`);
                            }
                        } catch (e) {
                            // Fall through to Commons URL
                        }
                    }
                } catch (e) {
                    // Fall through
                }
                
                // Strategy 2: Try Commons direct file URL (multiple formats for reliability)
                if (!photo) {
                    // Try direct upload.wikimedia.org URL (most reliable)
                    const firstChar = filename.substring(0, 1);
                    const firstTwoChars = filename.substring(0, 2);
                    photo = `https://upload.wikimedia.org/wikipedia/commons/${firstChar}/${firstTwoChars}/${encodeURIComponent(filename)}`;
                    console.log(`   📸 Using Commons direct URL: ${photo.substring(0, 80)}...`);
                } else {
                    // We have a photo from Wikipedia, but let's upgrade to Commons for better quality
                    const firstChar = filename.substring(0, 1);
                    const firstTwoChars = filename.substring(0, 2);
                    const directCommonsUrl = `https://upload.wikimedia.org/wikipedia/commons/${firstChar}/${firstTwoChars}/${encodeURIComponent(filename)}`;
                    console.log(`   📸 Upgrading to Commons direct URL: ${directCommonsUrl.substring(0, 80)}...`);
                    
                    // Prefer Commons direct URL for better quality
                    photo = directCommonsUrl;
                }
            }
        } else {
            console.log(`   ⚠️ No P18 image property found in Wikidata`);
        }
        
        // Get comprehensive nicknames/aliases/name variations
        const aliases = [];
        
        const extractTextValue = (claim) => {
            const value = claim.mainsnak?.datavalue?.value;
            if (value) {
                if (value.text) return value.text;
                if (typeof value === 'string') return value;
            }
            return null;
        };
        
        // Extract from various name properties
        const nicknameClaims = entity.claims?.P1449 || [];
        const birthNameClaims = entity.claims?.P1477 || [];
        const nativeNameClaims = entity.claims?.P1559 || [];
        const pseudonymClaims = entity.claims?.P742 || [];
        const nativeLabelClaims = entity.claims?.P1705 || [];
        const nameClaims = entity.claims?.P2561 || [];
        
        [nicknameClaims, birthNameClaims, nativeNameClaims, pseudonymClaims, nativeLabelClaims, nameClaims].forEach(claims => {
            claims.forEach(claim => {
                const text = extractTextValue(claim);
                if (text) aliases.push(text);
            });
        });
        
        // Get all labels (English, Hebrew, etc.) as potential name variations
        const labels = entity.labels || {};
        const mainName = labels.en?.value || labels.he?.value || '';
        Object.values(labels).forEach(label => {
            if (label && label.value && label.value !== mainName) {
                aliases.push(label.value);
            }
        });
        
        if (aliases.length > 0) {
            // Remove duplicates and the original name, limit to reasonable number
            const uniqueAliases = [...new Set(aliases)]
                .filter(alias => alias && alias.trim() && alias.toLowerCase() !== mainName.toLowerCase())
                .slice(0, 10); // Increased limit to get more name variations
            if (uniqueAliases.length > 0) {
                nicknames = uniqueAliases.join(', ');
            }
        }
        
        return {
            name: labels.en?.value || labels.he?.value || 'Unknown',
            gender: gender,
            nationality: nationality,
            photo: photo,
            nicknames: nicknames
        };
        
    } catch (error) {
        console.error('Error getting info from Wikidata ID:', error);
        return null;
    }
}

// Helper function to merge nicknames, avoiding duplicates
function mergeNicknames(existing, fromWiki) {
    const existingList = existing ? existing.split(',').map(n => n.trim()).filter(n => n) : [];
    const wikiList = fromWiki ? fromWiki.split(',').map(n => n.trim()).filter(n => n) : [];
    
    // Combine and deduplicate (case-insensitive)
    const all = [...existingList];
    wikiList.forEach(nick => {
        const normalized = nick.toLowerCase();
        if (!all.some(ex => ex.toLowerCase() === normalized)) {
            all.push(nick);
        }
    });
    
    return all.length > 0 ? all.join(', ') : '';
}

