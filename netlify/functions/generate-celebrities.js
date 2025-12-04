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
        let attempts = 0;
        const maxAttempts = 50;

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

        while (generatedCelebs.length < 5 && attempts < maxAttempts) {
            attempts++;
            try {
                // Search Wikipedia for random famous people
                const randomCategory = categories[Math.floor(Math.random() * categories.length)];
                const searchQuery = await searchWikipedia(randomCategory);
                
                if (!searchQuery) continue;

                // Get detailed info from Wikidata
                const celebInfo = await getCelebrityInfo(searchQuery);
                
                if (!celebInfo || !celebInfo.name) continue;

                // Check if already exists or not suitable
                const normalized = normalizeName(celebInfo.name);
                if (existingNames.has(normalized) || notSuitableNames.has(normalized)) {
                    continue;
                }

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
                
                // Only include if score is above threshold
                if (score < 30) {
                    console.log(`❌ Score too low: ${score} for ${celebInfo.name}`);
                    continue;
                }

                generatedCelebs.push({
                    ...celebInfo,
                    recognizabilityScore: score,
                    profession: celebInfo.profession || randomCategory,
                    nationality: celebInfo.nationality || 'Unknown'
                });

            } catch (err) {
                console.error('Error generating celebrity:', err);
                continue;
            }
        }

        return {
            statusCode: 200,
            headers: { ...headers, 'Content-Type': 'application/json' },
            body: JSON.stringify({
                success: true,
                celebrities: generatedCelebs,
                count: generatedCelebs.length
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
    try {
        // Method 1: Get random page from category
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
            // Filter out disambiguation pages and non-person pages
            const validMembers = members.filter(m => 
                !m.title.includes('(disambiguation)') && 
                !m.title.includes('List of')
            );
            
            if (validMembers.length > 0) {
                const randomMember = validMembers[Math.floor(Math.random() * validMembers.length)];
                return randomMember.title;
            }
        }
    } catch (err) {
        console.error('Category search failed:', err.message);
    }

    // Method 2: Fallback to random page
    try {
        const randomRes = await axios.get('https://en.wikipedia.org/api/rest_v1/page/random/summary', {
            headers: { 'User-Agent': 'PixelOptions/1.0 (contact@example.com)' },
            timeout: 5000
        });
        // Check if it's a person (has extract and type is standard)
        if (randomRes.data.type === 'standard' && randomRes.data.extract) {
            return randomRes.data.title;
        }
    } catch (err) {
        console.error('Random page failed:', err.message);
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
        
        // Basic check: if extract doesn't mention birth/death or common person indicators, might not be a person
        const extractLower = data.extract.toLowerCase();
        const personIndicators = ['born', 'died', 'actor', 'musician', 'scientist', 'writer', 'artist', 'politician', 'president', 'director', 'singer'];
        const hasPersonIndicator = personIndicators.some(indicator => extractLower.includes(indicator));
        
        if (!hasPersonIndicator && extractLower.length < 100) {
            // Might not be a person, skip
            return null;
        }

        // Get Wikidata ID
        const wikidataId = data.content_urls?.desktop?.page?.match(/Q\d+/)?.[0];
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

