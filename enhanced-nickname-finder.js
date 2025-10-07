const { google } = require('googleapis');
const axios = require('axios');
const credentials = require('./google-sheets-credentials.json');

const SHEET_ID = '1GgoGvCzW74vSqoaQeQmeGYEdNvLMY64iklDjCTYYOcY';
const SHEET_NAME = 'Published';
const BATCH_SIZE = 5;
const BATCH_DELAY = 2000;

const auth = new google.auth.JWT(
    credentials.client_email,
    null,
    credentials.private_key.replace(/\\n/g, '\n'),
    ['https://www.googleapis.com/auth/spreadsheets']
);

const sheets = google.sheets({ version: 'v4', auth });

// Character aliases and their real names (same character, different names)
const characterAliases = {
    "הענק הירוק": "ברוס באנר",
    "וונדרוומן": "דיאנה פרינס", 
    "דרדסבא": "דארת' ויידר", // Same character, different spelling
    "לוק סקייווקר": "מארק המיל",
    "הנסיכה ליאה": "קארי פישר",
    "הנסיך ג'ורג'": "ג'ורג' קיימברידג'",
    "השוטרת אז-אולי": "גל גדות",
    "השוטר אזולאי": "שי אברמי",
    "הג'וקר": "הית' לדג'ר",
    "באטמן": "כריסטיאן בייל",
    "סופרמן": "הנרי קאביל",
    "וונדרוומן": "גל גדות",
    "איירון מן": "רוברט דאוני ג'וניור",
    "קפטן אמריקה": "כריס אוונס",
    "תור": "כריס המסוורת'",
    "האלק": "מארק רופאלו",
    "בלאק וידו": "סקארלט יוהנסון",
    "ספיידרמן": "טום הולנד",
    "דוקטור סטריינג'": "בנדיקט קמברבאץ'",
    "אנטמן": "פול ראד",
    "וואספ": "אוונג'לין לילי",
    "בלאק פנתר": "צ'דוויק בוזמן",
    "קפטן מארוול": "ברי לארסון",
    "סקארלט וויץ'": "אליזבת אולסן",
    "ויז'ן": "פול בטאני",
    "וורלוק": "ארון טיילור-ג'ונסון",
    "ספיידר-גוון": "זנדאיה",
    "דוקטור אוקטופוס": "אלפרד מולינה",
    "גרין גובלין": "ווילם דפו",
    "וונום": "טום הארדי",
    "מורביוס": "ג'ארד לטו",
    "קרנייג'": "וודי הארלסון",
    "דדפול": "ראיין ריינולדס",
    "וולברין": "יו ג'קמן",
    "פרופסור X": "פטריק סטיוארט",
    "מגנטו": "איאן מקלן",
    "סטורם": "האלי ברי",
    "סייקלופס": "ג'יימס מרסדן",
    "ג'ין גריי": "פאם גריר",
    "רוג": "אנה פקווין",
    "קולוסוס": "דניאל קדמור",
    "נייטקרולר": "אלן קאמינג",
    "ביסט": "ניקולס הולט",
    "קוויקסילבר": "אוון פיטרס",
    "אפוקליפס": "אוסקר אייזק",
    "דדפול 2": "ג'וש ברולין",
    "דומינו": "זאזי ביטס",
    "קאבל": "ג'וש ברולין",
    "נגסאקי": "ביל סקארסגארד",
    "יוקיו": "שיוטי ימאמוטו",
    "פיירפיסט": "טרי קרוז",
    "בדפול": "רוב דלני",
    "שוגר ביר": "בריאן טיירי הנרי",
    "זייג'יק": "אנדריי זאגרב",
    "טיימסליפ": "דומיניק מונאגהאן",
    "סנדמן": "תומאס היידן צ'רץ'",
    "ויליאם סטרייקר": "בריאן קוקס",
    "לוגאן": "יו ג'קמן",
    "לורה": "דפני קין",
    "צ'ארלס": "פטריק סטיוארט",
    "קליבו": "ריצ'רד אי. גרנט",
    "דונלד פירס": "בויד הולברוק",
    "זנדר רייס": "ריצ'רד אי. גרנט",
    "קאליבן": "סטיבן מרצ'נט",
    "פייר": "אלן טודיק",
    "אנג'ל": "בן הארדי",
    "בישופ": "אומר סי",
    "פורג": "קייטי סטיוארט",
    "וורלוק": "ארון טיילור-ג'ונסון",
    "קוויקסילבר": "אוון פיטרס",
    "סטורם": "האלי ברי",
    "נייטקרולר": "אלן קאמינג",
    "קולוסוס": "דניאל קדמור",
    "רוג": "אנה פקווין",
    "ג'ין גריי": "פאם גריר",
    "סייקלופס": "ג'יימס מרסדן",
    "מגנטו": "איאן מקלן",
    "פרופסור X": "פטריק סטיוארט",
    "וולברין": "יו ג'קמן",
    "דדפול": "ראיין ריינולדס",
    "קרנייג'": "וודי הארלסון",
    "מורביוס": "ג'ארד לטו",
    "וונום": "טום הארדי",
    "גרין גובלין": "ווילם דפו",
    "דוקטור אוקטופוס": "אלפרד מולינה",
    "ספיידר-גוון": "זנדאיה",
    "ויז'ן": "פול בטאני",
    "סקארלט וויץ'": "אליזבת אולסן",
    "קפטן מארוול": "ברי לארסון",
    "בלאק פנתר": "צ'דוויק בוזמן",
    "וואספ": "אוונג'לין לילי",
    "אנטמן": "פול ראד",
    "דוקטור סטריינג'": "בנדיקט קמברבאץ'",
    "ספיידרמן": "טום הולנד",
    "בלאק וידו": "סקארלט יוהנסון",
    "האלק": "מארק רופאלו",
    "תור": "כריס המסוורת'",
    "קפטן אמריקה": "כריס אוונס",
    "איירון מן": "רוברט דאוני ג'וניור",
    "וונדרוומן": "גל גדות",
    "סופרמן": "הנרי קאביל",
    "באטמן": "כריסטיאן בייל",
    "הג'וקר": "הית' לדג'ר",
    "השוטר אזולאי": "שי אברמי",
    "השוטרת אז-אולי": "גל גדות",
    "הנסיך ג'ורג'": "ג'ורג' קיימברידג'",
    "הנסיכה ליאה": "קארי פישר",
    "לוק סקייווקר": "מארק המיל",
    "דרדסבא": "דארת' ויידר",
    "הרמיוני גריינג'ר": "אמה ווטסון",
    "הארי פוטר": "דניאל רדקליף",
    "וונדרוומן": "דיאנה פרינס",
    "הענק הירוק": "ברוס באנר"
};

// Character + descriptor patterns
const characterDescriptors = {
    "פופאי": "פופאי המלח",
    "קרמיט": "קרמיט הצפרדע",
    "מיקי": "מיקי מאוס",
    "דונלד": "דונלד דאק",
    "גופי": "גופי הכלב",
    "פלוטו": "פלוטו הכלב",
    "מיני": "מיני מאוס",
    "דייזי": "דייזי דאק",
    "היואי": "היואי דאק",
    "דיואי": "דיואי דאק",
    "לואי": "לואי דאק",
    "סקרוג'": "סקרוג' מקדאק",
    "ביגס": "ביגס באדג'ר",
    "ליטל": "ליטל באדג'ר",
    "בוזו": "בוזו הדוב",
    "במבי": "במבי האייל",
    "תומאס": "תומאס הקטר",
    "פרד": "פרד הקטר",
    "גורדון": "גורדון הקטר",
    "הנרי": "הנרי הקטר",
    "ג'יימס": "ג'יימס הקטר",
    "פרסי": "פרסי הקטר",
    "טובי": "טובי הקטר",
    "דאק": "דאק הקטר",
    "אוליבר": "אוליבר הקטר",
    "דאגלס": "דאגלס הקטר",
    "דונלד": "דונלד הקטר",
    "דאגלס": "דאגלס הקטר",
    "ביל": "ביל הקטר",
    "בן": "בן הקטר",
    "ברטי": "ברטי הקטר",
    "בילי": "בילי הקטר",
    "צ'רלי": "צ'רלי הקטר",
    "דאגלס": "דאגלס הקטר",
    "אדוארד": "אדוארד הקטר",
    "פרד": "פרד הקטר",
    "ג'ורג'": "ג'ורג' הקטר",
    "הנרי": "הנרי הקטר",
    "אייזק": "אייזק הקטר",
    "ג'יימס": "ג'יימס הקטר",
    "ליאו": "ליאו הקטר",
    "מיילס": "מיילס הקטר",
    "נואל": "נואל הקטר",
    "אוליבר": "אוליבר הקטר",
    "פרסי": "פרסי הקטר",
    "קווינטין": "קווינטין הקטר",
    "רוברט": "רוברט הקטר",
    "סמואל": "סמואל הקטר",
    "תומאס": "תומאס הקטר",
    "אוליבר": "אוליבר הקטר",
    "ויליאם": "ויליאם הקטר",
    "זאקרי": "זאקרי הקטר"
};

// Name variation patterns for Hebrew names
const nameVariations = {
    "אינשטיין": ["איינשטיין", "איינשטין", "אינשטין"],
    "איינשטיין": ["אינשטיין", "איינשטין", "אינשטין"],
    "איינשטין": ["אינשטיין", "איינשטיין", "אינשטין"],
    "אינשטין": ["אינשטיין", "איינשטיין", "איינשטין"],
    "פרנקלין": ["פרנקלין", "פרנקלין"],
    "רוזוולט": ["רוזוולט", "רוזוולט"],
    "קנדי": ["קנדי", "קנדי"],
    "לינקולן": ["לינקולן", "לינקולן"],
    "וושינגטון": ["וושינגטון", "וושינגטון"],
    "ג'פרסון": ["ג'פרסון", "ג'פרסון"],
    "מדיסון": ["מדיסון", "מדיסון"],
    "מונרו": ["מונרו", "מונרו"],
    "אדמס": ["אדמס", "אדמס"],
    "ג'קסון": ["ג'קסון", "ג'קסון"],
    "ואן ביורן": ["ואן ביורן", "ואן ביורן"],
    "האריסון": ["האריסון", "האריסון"],
    "טיילר": ["טיילר", "טיילר"],
    "פולק": ["פולק", "פולק"],
    "טיילור": ["טיילור", "טיילור"],
    "פילמור": ["פילמור", "פילמור"],
    "פירס": ["פירס", "פירס"],
    "בוקנן": ["בוקנן", "בוקנן"],
    "לינקולן": ["לינקולן", "לינקולן"],
    "ג'ונסון": ["ג'ונסון", "ג'ונסון"],
    "גרנט": ["גרנט", "גרנט"],
    "הייז": ["הייז", "הייז"],
    "גרפילד": ["גרפילד", "גרפילד"],
    "ארתור": ["ארתור", "ארתור"],
    "קליבלנד": ["קליבלנד", "קליבלנד"],
    "האריסון": ["האריסון", "האריסון"],
    "מקינלי": ["מקינלי", "מקינלי"],
    "רוזוולט": ["רוזוולט", "רוזוולט"],
    "טאפט": ["טאפט", "טאפט"],
    "וילסון": ["וילסון", "וילסון"],
    "הרדינג": ["הרדינג", "הרדינג"],
    "קולידג'": ["קולידג'", "קולידג'"],
    "הובר": ["הובר", "הובר"],
    "רוזוולט": ["רוזוולט", "רוזוולט"],
    "טרומן": ["טרומן", "טרומן"],
    "אייזנהאואר": ["אייזנהאואר", "אייזנהאואר"],
    "קנדי": ["קנדי", "קנדי"],
    "ג'ונסון": ["ג'ונסון", "ג'ונסון"],
    "ניקסון": ["ניקסון", "ניקסון"],
    "פורד": ["פורד", "פורד"],
    "קרטר": ["קרטר", "קרטר"],
    "רייגן": ["רייגן", "רייגן"],
    "בוש": ["בוש", "בוש"],
    "קלינטון": ["קלינטון", "קלינטון"],
    "בוש": ["בוש", "בוש"],
    "אובמה": ["אובמה", "אובמה"],
    "טראמפ": ["טראמפ", "טראמפ"],
    "ביידן": ["ביידן", "ביידן"]
};

class EnhancedNicknameFinder {
    constructor() {
        this.rateLimitDelay = 1500;
    }

    async delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Generate name variations
    generateNameVariations(name) {
        const variations = new Set();
        
        // Add original name
        variations.add(name);
        
        // Check for known variations
        Object.keys(nameVariations).forEach(key => {
            if (name.includes(key)) {
                nameVariations[key].forEach(variation => {
                    variations.add(name.replace(key, variation));
                });
            }
        });
        
        // Add common Hebrew name variations
        const hebrewVariations = this.generateHebrewVariations(name);
        hebrewVariations.forEach(variation => variations.add(variation));
        
        return Array.from(variations);
    }

    // Generate Hebrew name variations
    generateHebrewVariations(name) {
        const variations = [];
        
        // Common Hebrew letter substitutions
        const substitutions = {
            'י': ['י', 'יי'],
            'ו': ['ו', 'וו'],
            'ה': ['ה', ''],
            'א': ['א', ''],
            'ע': ['ע', 'א'],
            'ח': ['ח', 'כ'],
            'כ': ['כ', 'ח'],
            'ב': ['ב', 'ו'],
            'פ': ['פ', 'ב'],
            'ק': ['ק', 'כ'],
            'ר': ['ר', 'ד'],
            'ש': ['ש', 'ס'],
            'ת': ['ת', 'ט'],
            'ט': ['ט', 'ת'],
            'צ': ['צ', 'ס'],
            'ס': ['ס', 'ש'],
            'ז': ['ז', 'ס'],
            'ג': ['ג', 'ז'],
            'ד': ['ד', 'ת'],
            'ל': ['ל', 'ר'],
            'מ': ['מ', 'נ'],
            'נ': ['נ', 'מ']
        };
        
        // Generate variations by substituting letters
        Object.keys(substitutions).forEach(letter => {
            if (name.includes(letter)) {
                substitutions[letter].forEach(substitution => {
                    if (substitution !== letter) {
                        variations.push(name.replace(letter, substitution));
                    }
                });
            }
        });
        
        return variations;
    }

    // Add character descriptors
    addCharacterDescriptors(name, nicknames) {
        Object.keys(characterDescriptors).forEach(character => {
            if (name.includes(character)) {
                nicknames.add(characterDescriptors[character]);
            }
        });
    }

    // Add character aliases
    addCharacterAliases(name, nicknames) {
        Object.keys(characterAliases).forEach(alias => {
            if (name.includes(alias)) {
                nicknames.add(characterAliases[alias]);
            }
        });
    }

    // Search Wikipedia for actor information
    async searchWikipediaForActor(characterName) {
        try {
            const response = await axios.get(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(characterName)}`);
            
            if (response.data && response.data.extract) {
                const extract = response.data.extract;
                
                // Look for actor information
                const actorPatterns = [
                    /(?:played by|portrayed by|actor|actress)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/gi,
                    /(?:role of|character of)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/gi
                ];
                
                const actors = [];
                actorPatterns.forEach(pattern => {
                    let match;
                    while ((match = pattern.exec(extract)) !== null) {
                        if (match[1] && match[1].length > 2) {
                            actors.push(match[1].trim());
                        }
                    }
                });
                
                return actors;
            }
        } catch (error) {
            // No Wikipedia page found
        }
        return [];
    }

    // Clean and filter nicknames
    cleanNicknames(nicknames, originalName) {
        const cleaned = new Set();
        
        nicknames.forEach(nick => {
            if (!nick || typeof nick !== 'string') return;
            
            const cleanNick = nick.trim();
            
            // Skip if empty, too short, or same as original
            if (cleanNick.length < 2 || cleanNick === originalName) return;
            
            // Skip movie titles, years, and other noise
            if (this.isNoise(cleanNick)) return;
            
            cleaned.add(cleanNick);
        });
        
        return Array.from(cleaned);
    }

    // Check if a string is likely noise
    isNoise(str) {
        const noisePatterns = [
            /\d{4}/, // Years
            /\(.*\)/, // Parentheses content
            /movie|film|actor|actress|director|producer/i,
            /the\s+\w+\s+of/i,
            /:\s+/, // Colons
            /&/, // Ampersands
            /breaking|dies|isolation|spirit|secrets|introducing/i
        ];
        
        return noisePatterns.some(pattern => pattern.test(str));
    }

    // Add common name variations
    addCommonVariations(celebrityName, nicknames) {
        const name = celebrityName.trim();
        const nameParts = name.split(' ');
        
        if (nameParts.length > 1) {
            // First name only
            nicknames.add(nameParts[0]);
            
            // Last name only
            nicknames.add(nameParts[nameParts.length - 1]);
            
            // Initial + Last name
            const firstInitial = nameParts[0].charAt(0);
            const lastName = nameParts[nameParts.length - 1];
            nicknames.add(`${firstInitial}. ${lastName}`);
            
            // First + Last (if middle names exist)
            if (nameParts.length > 2) {
                nicknames.add(`${nameParts[0]} ${nameParts[nameParts.length - 1]}`);
            }
        }
    }

    // Main function to find all nicknames
    async findNicknames(celebrityName) {
        console.log(`\n🔍 Enhanced search for: ${celebrityName}`);
        
        const allNicknames = new Set();
        
        // 1. Generate name variations
        const nameVariations = this.generateNameVariations(celebrityName);
        nameVariations.forEach(variation => allNicknames.add(variation));
        
        // 2. Add character descriptors
        this.addCharacterDescriptors(celebrityName, allNicknames);
        
        // 3. Add character aliases
        this.addCharacterAliases(celebrityName, allNicknames);
        
        // 4. Search Wikipedia for actor information
        console.log('  🎭 Checking for actor information...');
        const actors = await this.searchWikipediaForActor(celebrityName);
        actors.forEach(actor => allNicknames.add(actor));
        await this.delay(this.rateLimitDelay);
        
        // 5. Add common variations
        this.addCommonVariations(celebrityName, allNicknames);
        
        const result = this.cleanNicknames(Array.from(allNicknames), celebrityName);
        console.log(`  ✅ Found ${result.length} enhanced nicknames: ${result.join(', ')}`);
        
        return result;
    }

    // Get celebrities without nicknames from Google Sheet
    async getCelebritiesWithoutNicknames() {
        try {
            const response = await sheets.spreadsheets.values.get({
                spreadsheetId: SHEET_ID,
                range: `${SHEET_NAME}!A:G`,
            });
            
            const rows = response.data.values || [];
            const celebritiesWithoutNicknames = [];
            
            for (let i = 1; i < rows.length; i++) {
                const row = rows[i];
                const name = row[0];
                const currentNicknames = row[6];
                
                if (name && (!currentNicknames || currentNicknames.trim() === '')) {
                    celebritiesWithoutNicknames.push({
                        name: name,
                        rowIndex: i + 1
                    });
                }
            }
            
            return celebritiesWithoutNicknames;
        } catch (error) {
            console.error('Error getting celebrities:', error);
            return [];
        }
    }

    // Update Google Sheet with nicknames
    async updateSheetWithNicknames(updates) {
        try {
            await sheets.spreadsheets.values.batchUpdate({
                spreadsheetId: SHEET_ID,
                resource: {
                    valueInputOption: 'RAW',
                    data: updates
                }
            });
            return true;
        } catch (error) {
            console.error('Error updating sheet:', error);
            return false;
        }
    }

    // Process all celebrities with enhanced nickname finding
    async processAllCelebrities() {
        console.log('🔍 Getting celebrities without nicknames...');
        const celebrities = await this.getCelebritiesWithoutNicknames();
        
        console.log(`📊 Found ${celebrities.length} celebrities without nicknames`);
        
        if (celebrities.length === 0) {
            console.log('✅ All celebrities already have nicknames!');
            return;
        }
        
        const updates = [];
        let processed = 0;
        
        for (const celebrity of celebrities) {
            try {
                const nicknames = await this.findNicknames(celebrity.name);
                
                if (nicknames.length > 0) {
                    const nicknameString = nicknames.join(', ');
                    updates.push({
                        range: `${SHEET_NAME}!G${celebrity.rowIndex}`,
                        values: [[nicknameString]]
                    });
                }
                
                processed++;
                
                // Update in batches
                if (updates.length >= BATCH_SIZE) {
                    console.log(`\n📝 Updating batch of ${updates.length} celebrities...`);
                    const success = await this.updateSheetWithNicknames(updates);
                    if (success) {
                        console.log(`✅ Successfully updated ${updates.length} celebrities`);
                    }
                    updates.length = 0;
                    await this.delay(BATCH_DELAY);
                }
                
                await this.delay(this.rateLimitDelay);
                
            } catch (error) {
                console.error(`Error processing ${celebrity.name}:`, error.message);
            }
        }
        
        // Update remaining updates
        if (updates.length > 0) {
            console.log(`\n📝 Updating final batch of ${updates.length} celebrities...`);
            const success = await this.updateSheetWithNicknames(updates);
            if (success) {
                console.log(`✅ Successfully updated final ${updates.length} celebrities`);
            }
        }
        
        console.log(`\n🎉 Completed enhanced processing of ${processed} celebrities!`);
    }
}

// Test the enhanced finder
async function testEnhancedFinder() {
    const finder = new EnhancedNicknameFinder();
    
    const testCelebrities = [
        "אינשטיין",
        "פופאי",
        "קרמיט",
        "הענק הירוק",
        "הארי פוטר"
    ];
    
    console.log('🚀 Testing enhanced nickname finder...\n');
    
    for (const celebrity of testCelebrities) {
        const nicknames = await finder.findNicknames(celebrity);
        console.log(`\n${celebrity}: ${nicknames.join(', ')}`);
    }
}

// Run the enhanced finder
async function runEnhancedFinder() {
    const finder = new EnhancedNicknameFinder();
    await finder.processAllCelebrities();
}

// Uncomment to test
// testEnhancedFinder().catch(console.error);

// Uncomment to run full processing
runEnhancedFinder().catch(console.error);
