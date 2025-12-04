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
        const NOT_SUITABLE_SHEET = 'Not Suitable';

        // Initialize Google Sheets
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

        const auth = new google.auth.GoogleAuth({ credentials, scopes: ['https://www.googleapis.com/auth/spreadsheets'] });
        const sheets = google.sheets({ version: 'v4', auth });

        // Get existing celebrities and not suitable list
        const [publishedRes, notSuitableRes] = await Promise.all([
            sheets.spreadsheets.values.get({ spreadsheetId: SHEET_ID, range: `${SHEET_NAME}!A:G` }).catch(() => ({ data: { values: [] } })),
            sheets.spreadsheets.values.get({ spreadsheetId: SHEET_ID, range: `${NOT_SUITABLE_SHEET}!A:A` }).catch(() => ({ data: { values: [] } }))
        ]);

        const existingNames = new Set();
        (publishedRes.data.values || []).slice(1).forEach(row => {
            if (row[0]) existingNames.add(normalizeName(row[0]));
            if (row[6]) row[6].split(',').forEach(n => n.trim() && existingNames.add(normalizeName(n.trim())));
        });

        const notSuitableNames = new Set();
        (notSuitableRes.data.values || []).slice(1).forEach(row => {
            if (row[0]) notSuitableNames.add(normalizeName(row[0]));
        });

        // Analyze existing data for learning
        const existingCelebs = (publishedRes.data.values || []).slice(1).filter(r => r[0]);
        const professions = new Map(); // profession -> count
        const nationalities = new Map(); // nationality -> count
        
        existingCelebs.forEach(row => {
            if (row[2]) {
                const prof = row[2].toLowerCase();
                professions.set(prof, (professions.get(prof) || 0) + 1);
            }
            if (row[3]) {
                const nat = row[3].toLowerCase();
                nationalities.set(nat, (nationalities.get(nat) || 0) + 1);
            }
        });
        
        // Get most common professions and nationalities
        const topProfessions = Array.from(professions.entries())
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([prof]) => prof);
        
        const topNationalities = Array.from(nationalities.entries())
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([nat]) => nat);
        
        console.log('📊 Learning from existing data:');
        console.log('Top professions:', topProfessions);
        console.log('Top nationalities:', topNationalities);
        
        // Analyze not suitable list for patterns to avoid
        const notSuitableRows = (notSuitableRes.data.values || []).slice(1);
        const notSuitableReasons = new Map();
        notSuitableRows.forEach(row => {
            const reason = (row[1] || 'unknown').toLowerCase();
            notSuitableReasons.set(reason, (notSuitableReasons.get(reason) || 0) + 1);
        });
        
        console.log('Not suitable reasons:', Array.from(notSuitableReasons.entries()));

        // Generate 5 new celebrities using Wikipedia API
        const generatedCelebs = [];
        const generatedNames = new Set(); // Track names in current generation to avoid duplicates
        let attempts = 0;
        const maxAttempts = 150; // Increased attempts for better filtering

        // Categories to search for famous people - prioritize based on learning
        let categories = [
            'Living people',
            'Actors',
            'Musicians',
            'Scientists',
            'Writers',
            'Artists',
            'Athletes',
            'Politicians',
            'Businesspeople'
        ];
        
        // Reorder categories based on what's popular in existing data
        if (topProfessions.length > 0) {
            const professionToCategory = {
                'actor': 'Actors',
                'actress': 'Actors',
                'musician': 'Musicians',
                'singer': 'Musicians',
                'scientist': 'Scientists',
                'writer': 'Writers',
                'author': 'Writers',
                'artist': 'Artists',
                'painter': 'Artists',
                'athlete': 'Athletes',
                'politician': 'Politicians',
                'businessperson': 'Businesspeople',
                'entrepreneur': 'Businesspeople'
            };
            
            // Move popular categories to front
            const popularCategories = topProfessions
                .map(prof => professionToCategory[prof])
                .filter(cat => cat && categories.includes(cat));
            
            categories = [...new Set([...popularCategories, ...categories])];
        }

        // Try to get at least 5, but return what we have after maxAttempts
        while (generatedCelebs.length < 5 && attempts < maxAttempts) {
            attempts++;
            try {
                // Log progress every 20 attempts
                if (attempts % 20 === 0) {
                    console.log(`🔄 Attempt ${attempts}/${maxAttempts}, found ${generatedCelebs.length} so far...`);
                }
                // Search Wikipedia for random famous people
                const randomCategory = categories[Math.floor(Math.random() * categories.length)];
                const searchQuery = await searchWikipedia(randomCategory);
                
                if (!searchQuery) continue;

                // Get detailed info from Wikidata
                const celebInfo = await getCelebrityInfo(searchQuery);
                
                if (!celebInfo || !celebInfo.name) continue;

                // Check if already exists or not suitable
                const normalized = normalizeName(celebInfo.name);
                if (existingNames.has(normalized) || notSuitableNames.has(normalized) || generatedNames.has(normalized)) {
                    console.log(`⏭️ Skipping duplicate or existing: ${celebInfo.name}`);
                    continue;
                }
                
                // Check if name is just a profession (quick check first)
                const nameLower = celebInfo.name.toLowerCase().trim();
                const professionOnlyWords = ['actor', 'actress', 'musician', 'singer', 'scientist', 'writer', 
                    'artist', 'politician', 'businessperson', 'athlete', 'director', 'artist-in-residence'];
                if (professionOnlyWords.includes(nameLower)) {
                    console.log(`❌ Name is just a profession: ${celebInfo.name}`);
                    continue;
                }
                
                // Verify it's actually a person using Wikidata - but allow fallback
                const isPerson = await verifyIsPerson(celebInfo, searchQuery);
                if (isPerson === false) {
                    // Explicitly rejected (not a person)
                    console.log(`❌ Explicitly rejected as not a person: ${celebInfo.name}`);
                    continue;
                } else if (isPerson === null) {
                    // Uncertain - use fallback check (more lenient)
                    let allowFallback = false;
                    
                    // Check description for person indicators
                    if (celebInfo.description) {
                        const descLower = celebInfo.description.toLowerCase();
                        const strongPersonIndicators = ['born', 'died', 'birth', 'death', 'was an', 'is an', 'was a', 'is a', 
                            'actor', 'musician', 'scientist', 'writer', 'artist', 'politician', 'director', 'singer'];
                        if (strongPersonIndicators.some(ind => descLower.includes(ind))) {
                            allowFallback = true;
                            console.log(`⚠️ Wikidata check uncertain but allowing based on description: ${celebInfo.name}`);
                        }
                    }
                    
                    // Also allow if we have a profession (indicates it's likely a person)
                    if (!allowFallback && celebInfo.profession) {
                        const profLower = celebInfo.profession.toLowerCase();
                        const personProfessions = ['actor', 'actress', 'musician', 'singer', 'scientist', 'writer', 
                            'author', 'artist', 'athlete', 'politician', 'director', 'producer'];
                        if (personProfessions.some(pp => profLower.includes(pp))) {
                            allowFallback = true;
                            console.log(`⚠️ Wikidata check uncertain but allowing based on profession: ${celebInfo.name}`);
                        }
                    }
                    
                    // If title looks like a person's name (has multiple words or is a known single name), allow it
                    if (!allowFallback) {
                        const titleWords = celebInfo.name.split(' ').filter(w => w.length > 0);
                        // If it has 2+ words, likely a person's name
                        if (titleWords.length >= 2) {
                            allowFallback = true;
                            console.log(`⚠️ Wikidata check uncertain but allowing based on name format: ${celebInfo.name}`);
                        }
                    }
                    
                    if (!allowFallback) {
                        console.log(`❌ No fallback indicators found: ${celebInfo.name}`);
                        continue;
                    }
                }
                // If isPerson === true, we're good to go

                // Calculate recognizability score
                let score = await calculateRecognizabilityScore(celebInfo, searchQuery);
                
                // Apply learning bonuses/penalties
                if (celebInfo.profession) {
                    const profLower = celebInfo.profession.toLowerCase();
                    // Bonus if profession matches popular ones
                    if (topProfessions.some(topProf => profLower.includes(topProf) || topProf.includes(profLower))) {
                        score += 15;
                        console.log(`✅ Bonus for popular profession: ${celebInfo.profession}`);
                    }
                }
                
                if (celebInfo.nationality) {
                    const natLower = celebInfo.nationality.toLowerCase();
                    // Bonus if nationality matches popular ones
                    if (topNationalities.some(topNat => natLower.includes(topNat) || topNat.includes(natLower))) {
                        score += 10;
                        console.log(`✅ Bonus for popular nationality: ${celebInfo.nationality}`);
                    }
                }
                
                // Only include if score is above threshold (lowered to 40 to get more results)
                if (score < 40) {
                    console.log(`❌ Score too low: ${score} for ${celebInfo.name}`);
                    continue;
                }

                generatedCelebs.push({
                    ...celebInfo,
                    recognizabilityScore: score,
                    profession: celebInfo.profession || randomCategory,
                    nationality: celebInfo.nationality || 'Unknown'
                });
                
                generatedNames.add(normalized); // Track to avoid duplicates

            } catch (err) {
                console.error('Error generating celebrity:', err);
                continue;
            }
        }

        // Return what we have, even if less than 5
        console.log(`✅ Generated ${generatedCelebs.length} celebrities after ${attempts} attempts`);
        
        return {
            statusCode: 200,
            headers: { ...headers, 'Content-Type': 'application/json' },
            body: JSON.stringify({
                success: true,
                celebrities: generatedCelebs,
                count: generatedCelebs.length,
                attempts: attempts
            })
        };

    } catch (error) {
        console.error('Error generating celebrities:', error);
        return {
            statusCode: 500,
            headers: { ...headers, 'Content-Type': 'application/json' },
            body: JSON.stringify({ success: false, error: error.message })
        };
    }
};

// Helper functions
function normalizeName(name) {
    return name.toLowerCase().replace(/\s+/g, '').replace(/[^\w\u0590-\u05FF]/g, '');
}

async function searchWikipedia(category) {
    // Better approach: Search for specific famous people by name
    // This ensures we get actual recognizable celebrities
    
    const famousPeople = {
        'Actors': ['Tom Hanks', 'Meryl Streep', 'Leonardo DiCaprio', 'Scarlett Johansson', 'Brad Pitt', 'Angelina Jolie', 'Robert Downey Jr', 'Chris Evans', 'Emma Stone', 'Ryan Gosling', 'Jennifer Lawrence', 'Chris Hemsworth', 'Natalie Portman', 'Tom Cruise', 'Will Smith'],
        'Musicians': ['Taylor Swift', 'Beyoncé', 'Ed Sheeran', 'Adele', 'Bruno Mars', 'Ariana Grande', 'Billie Eilish', 'The Weeknd', 'Drake', 'Post Malone', 'Justin Bieber', 'Lady Gaga', 'Rihanna', 'Dua Lipa', 'Harry Styles'],
        'Scientists': ['Albert Einstein', 'Stephen Hawking', 'Marie Curie', 'Isaac Newton', 'Charles Darwin', 'Nikola Tesla', 'Neil deGrasse Tyson', 'Jane Goodall', 'Richard Feynman', 'Rosalind Franklin', 'Carl Sagan', 'Alan Turing', 'Ada Lovelace'],
        'Writers': ['J.K. Rowling', 'Stephen King', 'Ernest Hemingway', 'Mark Twain', 'Jane Austen', 'George Orwell', 'Agatha Christie', 'Toni Morrison', 'Maya Angelou', 'Harper Lee', 'John Grisham', 'Dan Brown'],
        'Artists': ['Pablo Picasso', 'Vincent van Gogh', 'Leonardo da Vinci', 'Michelangelo', 'Frida Kahlo', 'Andy Warhol', 'Salvador Dalí', 'Claude Monet', 'Georgia O\'Keeffe', 'Jackson Pollock'],
        'Athletes': ['Michael Jordan', 'LeBron James', 'Serena Williams', 'Lionel Messi', 'Cristiano Ronaldo', 'Tom Brady', 'Usain Bolt', 'Roger Federer', 'Tiger Woods', 'Muhammad Ali', 'Kobe Bryant', 'Rafael Nadal'],
        'Politicians': ['Barack Obama', 'Nelson Mandela', 'Winston Churchill', 'Mahatma Gandhi', 'Martin Luther King Jr', 'Angela Merkel', 'Joe Biden', 'Hillary Clinton', 'Vladimir Putin'],
        'Businesspeople': ['Elon Musk', 'Bill Gates', 'Steve Jobs', 'Warren Buffett', 'Jeff Bezos', 'Mark Zuckerberg', 'Oprah Winfrey', 'Richard Branson', 'Larry Page', 'Sergey Brin']
    };
    
    // Map category to search list
    const categoryKey = category === 'Living people' ? 'Actors' : category;
    const searchList = famousPeople[categoryKey] || famousPeople['Actors'];
    
    // Pick a random famous person and search for them
    const randomPerson = searchList[Math.floor(Math.random() * searchList.length)];
    
    try {
        const searchRes = await axios.get('https://en.wikipedia.org/w/api.php', {
            params: {
                action: 'query',
                list: 'search',
                srsearch: randomPerson,
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
            // Return the first (most relevant) result
            console.log(`✅ Found via search: ${results[0].title}`);
            return results[0].title;
        }
    } catch (err) {
        console.error('Person search failed:', err.message);
    }
    
    // Fallback: Use category members with better filtering
    try {
        const searchRes = await axios.get('https://en.wikipedia.org/w/api.php', {
            params: {
                action: 'query',
                list: 'categorymembers',
                cmtitle: `Category:${category}`,
                cmlimit: 100,
                cmnamespace: 0,
                format: 'json',
                origin: '*'
            },
            timeout: 8000,
            headers: { 'User-Agent': 'PixelOptions/1.0 (contact@example.com)' }
        });
        
        const members = searchRes.data.query?.categorymembers || [];
        if (members.length > 0) {
            // Filter more aggressively - must look like a person's name
            const validMembers = members.filter(m => {
                const title = m.title;
                const words = title.split(' ').filter(w => w.length > 0);
                return words.length >= 2 && words.length <= 4 && // 2-4 words typical for names
                       !title.includes('(disambiguation)') && 
                       !title.includes('List of') &&
                       !title.includes('Category:') &&
                       !title.startsWith('List ') &&
                       !title.match(/^\d{4}/) &&
                       !title.toLowerCase().includes('film') &&
                       !title.toLowerCase().includes('album');
            });
            
            if (validMembers.length > 0) {
                const randomMember = validMembers[Math.floor(Math.random() * validMembers.length)];
                console.log(`✅ Found via category: ${randomMember.title}`);
                return randomMember.title;
            }
        }
    } catch (err) {
        console.error('Category search failed:', err.message);
    }
    
    return null;
}

async function getCelebrityInfo(title) {
    try {
        // Get Wikipedia page info
        const wikiRes = await axios.get(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`, {
            headers: { 'User-Agent': 'PixelOptions/1.0 (contact@example.com)' },
            timeout: 5000
        });

        const data = wikiRes.data;
        
        // Check if it's a person (has extract and is not a disambiguation)
        if (!data.extract || data.type !== 'standard' || 
            data.content_urls?.desktop?.page?.includes('disambiguation') ||
            title.includes('(disambiguation)') ||
            title.includes('List of')) {
            return null;
        }
        
        // Reject if title looks like a profession/category, not a person's name
        const titleLower = title.toLowerCase();
        const professionWords = ['actor', 'actress', 'musician', 'singer', 'scientist', 'writer', 'artist', 
            'politician', 'businessperson', 'athlete', 'director', 'producer', 'model', 'chef', 
            'doctor', 'lawyer', 'engineer', 'artist-in-residence'];
        
        // If title is just a profession word, reject it
        if (professionWords.includes(titleLower) || titleLower.includes('(profession)')) {
            console.log(`❌ Rejecting profession title: ${title}`);
            return null;
        }
        
        // Title should look like a person's name (has at least 2 words, or is a known single name)
        const titleWords = title.split(' ').filter(w => w.length > 0);
        if (titleWords.length < 1) {
            return null;
        }
        
        // Basic check: if extract doesn't mention birth/death or common person indicators, might not be a person
        const extractLower = data.extract.toLowerCase();
        const personIndicators = ['born', 'died', 'birth', 'death', 'was an', 'is an', 'was a', 'is a', 
            'actor', 'musician', 'scientist', 'writer', 'artist', 'politician', 'president', 'director', 'singer'];
        const hasPersonIndicator = personIndicators.some(indicator => extractLower.includes(indicator));
        
        if (!hasPersonIndicator && extractLower.length < 100) {
            // Might not be a person, skip
            console.log(`❌ No person indicators in extract for: ${title}`);
            return null;
        }

        // Get Wikidata ID from the page URL or extract from content
        let wikidataId = null;
        try {
            // Try to get Wikidata ID from Wikipedia API
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
        
        let profession = null;
        let nationality = null;
        let photo = data.thumbnail?.source || data.originalimage?.source || null;

        if (wikidataId) {
            try {
                const wdRes = await axios.get(`https://www.wikidata.org/w/api.php`, {
                    params: {
                        action: 'wbgetentities',
                        ids: wikidataId,
                        props: 'claims',
                        format: 'json',
                        origin: '*'
                    }
                });

                const entity = wdRes.data.entities?.[wikidataId];
                if (entity) {
                    // Get occupation
                    const occupations = entity.claims?.P106 || [];
                    if (occupations.length > 0) {
                        const occId = occupations[0].mainsnak?.datavalue?.value?.id;
                        if (occId) {
                            const occRes = await axios.get(`https://www.wikidata.org/w/api.php`, {
                                params: {
                                    action: 'wbgetentities',
                                    ids: occId,
                                    props: 'labels',
                                    languages: 'en',
                                    format: 'json',
                                    origin: '*'
                                }
                            });
                            profession = occRes.data.entities?.[occId]?.labels?.en?.value || null;
                        }
                    }

                    // Get nationality
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
                }
            } catch (err) {
                console.error('Error fetching Wikidata:', err);
            }
        }

        return {
            name: data.title,
            description: data.extract,
            photo: photo,
            profession: profession,
            nationality: nationality,
            wikipediaUrl: data.content_urls?.desktop?.page
        };

    } catch (error) {
        console.error('Error getting celebrity info:', error);
        return null;
    }
}

async function calculateRecognizabilityScore(celebInfo, title) {
    let score = 0;

    try {
        // Get Wikipedia page views (last 30 days average)
        const now = new Date();
        const endDate = new Date(now);
        const startDate = new Date(now);
        startDate.setDate(startDate.getDate() - 30);
        
        const formatDate = (date) => {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}${month}${day}`;
        };
        
        const startStr = formatDate(startDate);
        const endStr = formatDate(endDate);
        
        const viewsRes = await axios.get(
            `https://wikimedia.org/api/rest_v1/metrics/pageviews/per-article/en.wikipedia/all-access/user/${encodeURIComponent(title)}/daily/${startStr}/${endStr}`,
            {
                headers: { 'User-Agent': 'PixelOptions/1.0 (contact@example.com)' },
                timeout: 5000
            }
        );

        const views = viewsRes.data.items || [];
        if (views.length > 0) {
            const avgViews = views.reduce((sum, item) => sum + (item.views || 0), 0) / views.length;
            // Normalize: 1000 views = 20 points, 10000 views = 50 points, 100000 views = 80 points
            score += Math.min(80, Math.log10(avgViews + 1) * 15);
        } else {
            score += 20; // Base score if no views data
        }
    } catch (err) {
        // If can't get views (page might not exist or API error), give base score
        console.log(`Could not get page views for ${title}: ${err.message}`);
        score += 25;
    }

    // Bonus for having profession
    if (celebInfo.profession) score += 10;

    // Bonus for having photo
    if (celebInfo.photo) score += 10;

    // Bonus for having nationality
    if (celebInfo.nationality) score += 5;

    return Math.round(score);
}

// Verify that the entity is actually a person (human) using Wikidata
async function verifyIsPerson(celebInfo, title) {
    // STRICT: Must verify via Wikidata that it's a human
    // Reject if title is just a profession word
    const titleLower = title.toLowerCase().trim();
    const professionOnlyTitles = ['actor', 'actress', 'musician', 'singer', 'scientist', 'writer', 
        'author', 'artist', 'painter', 'athlete', 'politician', 'businessperson', 'entrepreneur',
        'director', 'producer', 'comedian', 'model', 'chef', 'doctor', 'lawyer', 'engineer',
        'artist-in-residence'];
    
    if (professionOnlyTitles.includes(titleLower)) {
        console.log(`❌ Title is just a profession: ${title}`);
        return false;
    }
    
    // Title must look like a person's name (not a category or profession)
    if (titleLower.includes('(profession)') || titleLower.includes('(occupation)') || 
        titleLower.includes('category:') || titleLower.startsWith('list of')) {
        console.log(`❌ Title looks like category/profession: ${title}`);
        return false;
    }
    
    // Try to get Wikidata ID and STRICTLY check instance of human
    try {
        // Get Wikidata ID
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
        const wikidataId = pages[pageId]?.pageprops?.wikibase_item;
        
        if (!wikidataId) {
            console.log(`⚠️ No Wikidata ID for: ${title} - will use fallback check`);
            // Don't reject immediately - allow fallback check
            return null; // Return null to indicate "uncertain, use fallback"
        }
        
        // Check if instance of human (Q5) - THIS IS REQUIRED
        const entityRes = await axios.get(`https://www.wikidata.org/w/api.php`, {
            params: {
                action: 'wbgetentities',
                ids: wikidataId,
                props: 'claims',
                format: 'json',
                origin: '*'
            },
            timeout: 5000
        });
        
        const entity = entityRes.data.entities?.[wikidataId];
        if (!entity) {
            console.log(`❌ No entity found for Wikidata ID: ${wikidataId}`);
            return false;
        }
        
        // Check instance of (P31) - MUST include human (Q5)
        const instances = entity.claims?.P31 || [];
        const isHuman = instances.some(inst => {
            const value = inst.mainsnak?.datavalue?.value;
            return value?.id === 'Q5'; // Human
        });
        
        if (!isHuman) {
            console.log(`❌ Not a human in Wikidata: ${title} (instances: ${instances.map(i => i.mainsnak?.datavalue?.value?.id).join(', ')})`);
            return false;
        }
        
        // Additional check: reject if it's explicitly a painting, artwork, or other non-person entity
        const rejectedTypes = ['Q3305213', 'Q838948', 'Q860861']; // Painting, artwork, etc. (but NOT Q5 which is human)
        const hasRejectedType = instances.some(inst => {
            const value = inst.mainsnak?.datavalue?.value;
            return rejectedTypes.includes(value?.id);
        });
        
        if (hasRejectedType) {
            console.log(`❌ Has rejected type: ${title}`);
            return false;
        }
        
        console.log(`✅ Verified as human: ${title}`);
        return true;
        
    } catch (err) {
        console.error(`Error verifying person for ${title}:`, err.message);
        return null; // Return null to allow fallback check
    }
}

