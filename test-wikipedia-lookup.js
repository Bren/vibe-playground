const axios = require('axios');

// Test Wikipedia lookup for a few names
async function testLookup(name, nicknames = '') {
    console.log(`\n🔍 Testing lookup for: "${name}"${nicknames ? ` (nicknames: ${nicknames})` : ''}`);
    
    try {
        // Build search terms (same logic as the function)
        const searchTerms = [];
        const isHebrewName = /[\u0590-\u05FF]/.test(name);
        
        if (nicknames) {
            const nicknameList = nicknames.split(',').map(n => n.trim()).filter(n => n);
            const englishNicks = nicknameList
                .filter(nick => /[a-zA-Z]/.test(nick) && nick.length > 2)
                .sort((a, b) => b.length - a.length);
            
            englishNicks.forEach(nick => {
                searchTerms.push({ term: nick, lang: 'en', priority: 1 });
            });
        }
        
        if (isHebrewName) {
            searchTerms.push({ term: name, lang: 'he', priority: 2 });
            searchTerms.push({ term: name, lang: 'en', priority: 3 });
        } else {
            searchTerms.push({ term: name, lang: 'en', priority: 2 });
        }
        
        searchTerms.sort((a, b) => (a.priority || 3) - (b.priority || 3));
        
        // Try Wikidata search FIRST
        let wikidataId = null;
        console.log(`   🔍 Searching Wikidata for: "${searchTerms[0].term}"...`);
        
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
                    wikidataId = bestResult.id;
                    console.log(`   ✅ Found Wikidata: ${wikidataId} (${bestResult.description || 'no description'})`);
                    break;
                }
            } catch (err) {
                console.log(`   ⚠️ Wikidata search failed for "${term}": ${err.message}`);
                continue;
            }
        }
        
        if (!wikidataId) {
            console.log(`   ❌ No Wikidata results found`);
            return null;
        }
        
        // Get entity data
        console.log(`   📥 Fetching Wikidata entity data...`);
        const entityRes = await axios.get('https://www.wikidata.org/w/api.php', {
            params: {
                action: 'wbgetentities',
                ids: wikidataId,
                props: 'claims|labels',
                languages: 'en',
                format: 'json',
                origin: '*'
            },
            headers: { 'User-Agent': 'PixelOptions/1.0 (contact@example.com)' },
            timeout: 5000
        });
        
        const entity = entityRes.data.entities?.[wikidataId];
        if (!entity) {
            console.log(`   ❌ Entity not found`);
            return null;
        }
        
        // Extract data
        let gender = null;
        let nationality = null;
        let photo = null;
        let extractedNicknames = null;
        
        // Gender
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
                    if (genderLabel.toLowerCase().includes('male')) {
                        gender = 'Male';
                    } else if (genderLabel.toLowerCase().includes('female')) {
                        gender = 'Female';
                    }
                }
            }
        }
        
        // Photo
        const photos = entity.claims?.P18 || [];
        if (photos.length > 0) {
            const photoValue = photos[0].mainsnak?.datavalue?.value;
            if (photoValue) {
                const filename = photoValue.replace(/ /g, '_');
                const firstChar = filename.substring(0, 1);
                const firstTwoChars = filename.substring(0, 2);
                photo = `https://upload.wikimedia.org/wikipedia/commons/${firstChar}/${firstTwoChars}/${encodeURIComponent(filename)}`;
            }
        }
        
        // Nationality
        const nationalities = entity.claims?.P27 || [];
        if (nationalities.length > 0) {
            const nationalityId = nationalities[0].mainsnak?.datavalue?.value?.id;
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
        }
        
        // Nicknames
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
                .filter(alias => alias && alias.trim())
                .slice(0, 10);
            if (uniqueAliases.length > 0) {
                extractedNicknames = uniqueAliases.join(', ');
            }
        }
        
        console.log(`   ✅ Results:`);
        console.log(`      Gender: ${gender || 'N/A'}`);
        console.log(`      Nationality: ${nationality || 'N/A'}`);
        console.log(`      Photo: ${photo ? 'YES (' + photo.substring(0, 60) + '...)' : 'N/A'}`);
        console.log(`      Nicknames: ${extractedNicknames || 'N/A'}`);
        
        return { gender, nationality, photo, nicknames: extractedNicknames };
        
    } catch (error) {
        console.error(`   ❌ Error: ${error.message}`);
        return null;
    }
}

// Test with a few names
async function runTests() {
    console.log('🧪 Testing Wikipedia/Wikidata lookups...\n');
    
    await testLookup('Sting', 'Gordon Sumner');
    await testLookup('Chris Martin', '');
    await testLookup('Janis Joplin', '');
    await testLookup('Adele', 'Adele Laurie Blue Adkins');
    
    console.log('\n✅ Tests complete');
}

runTests().catch(console.error);

