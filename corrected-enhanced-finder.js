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
    "הג'וקר": "הית' לדג'ר",
    "באטמן": "ברוס ויין",
    "סופרמן": "קלארק קנט",
    "איירון מן": "טוני סטארק",
    "קפטן אמריקה": "סטיב רוג'רס",
    "תור": "תור אודינסון",
    "האלק": "ברוס באנר",
    "ספיידרמן": "פיטר פארקר",
    "וולברין": "לוגאן",
    "דדפול": "ווייד וילסון"
};

// Characters and their actors (character -> actor)
const characterActors = {
    "הארי פוטר": "דניאל רדקליף",
    "הרמיוני גריינג'ר": "אמה ווטסון",
    "רון ויזלי": "רופרט גרינט",
    "לוק סקייווקר": "מארק המיל",
    "הנסיכה ליאה": "קארי פישר",
    "דרדסבא": "דייוויד פרוז",
    "הג'וקר": "הית' לדג'ר",
    "באטמן": "כריסטיאן בייל",
    "סופרמן": "הנרי קאביל",
    "איירון מן": "רוברט דאוני ג'וניור",
    "קפטן אמריקה": "כריס אוונס",
    "תור": "כריס המסוורת'",
    "האלק": "מארק רופאלו",
    "ספיידרמן": "טום הולנד",
    "וולברין": "יו ג'קמן",
    "דדפול": "ראיין ריינולדס",
    "השוטרת אז-אולי": "גל גדות",
    "השוטר אזולאי": "שי אברמי",
    "וונדרוומן": "גל גדות",
    "בלאק וידו": "סקארלט יוהנסון",
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
    "קרנייג'": "וודי הארלסון"
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
    "במבי": "במבי האייל",
    "תומאס": "תומאס הקטר"
};

// Name variation patterns for Hebrew names
const nameVariations = {
    "אינשטיין": ["איינשטיין", "איינשטין", "אינשטין"],
    "איינשטיין": ["אינשטיין", "איינשטין", "אינשטין"],
    "איינשטין": ["אינשטיין", "איינשטיין", "אינשטין"],
    "אינשטין": ["אינשטיין", "איינשטיין", "איינשטין"]
};

class CorrectedEnhancedFinder {
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
        
        return Array.from(variations);
    }

    // Add character descriptors
    addCharacterDescriptors(name, nicknames) {
        Object.keys(characterDescriptors).forEach(character => {
            if (name.includes(character)) {
                nicknames.add(characterDescriptors[character]);
            }
        });
    }

    // Add character aliases (same character, different names)
    addCharacterAliases(name, nicknames) {
        Object.keys(characterAliases).forEach(alias => {
            if (name.includes(alias)) {
                nicknames.add(characterAliases[alias]);
            }
        });
    }

    // Add character actors (character -> actor who plays them)
    addCharacterActors(name, nicknames) {
        Object.keys(characterActors).forEach(character => {
            if (name.includes(character)) {
                nicknames.add(characterActors[character]);
            }
        });
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

    // Main function to find all nicknames
    async findNicknames(celebrityName) {
        console.log(`\n🔍 Corrected enhanced search for: ${celebrityName}`);
        
        const allNicknames = new Set();
        
        // 1. Generate name variations
        const nameVariations = this.generateNameVariations(celebrityName);
        nameVariations.forEach(variation => allNicknames.add(variation));
        
        // 2. Add character descriptors
        this.addCharacterDescriptors(celebrityName, allNicknames);
        
        // 3. Add character aliases (same character, different names)
        this.addCharacterAliases(celebrityName, allNicknames);
        
        // 4. Add character actors (character -> actor who plays them)
        this.addCharacterActors(celebrityName, allNicknames);
        
        // 5. Add common variations
        this.addCommonVariations(celebrityName, allNicknames);
        
        const result = this.cleanNicknames(Array.from(allNicknames), celebrityName);
        console.log(`  ✅ Found ${result.length} corrected nicknames: ${result.join(', ')}`);
        
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

    // Process all celebrities with corrected nickname finding
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
        
        console.log(`\n🎉 Completed corrected processing of ${processed} celebrities!`);
    }
}

// Test the corrected finder
async function testCorrectedFinder() {
    const finder = new CorrectedEnhancedFinder();
    
    const testCelebrities = [
        "אינשטיין",
        "פופאי", 
        "קרמיט",
        "הענק הירוק",
        "הארי פוטר",
        "דרדסבא"
    ];
    
    console.log('🚀 Testing corrected enhanced nickname finder...\n');
    
    for (const celebrity of testCelebrities) {
        const nicknames = await finder.findNicknames(celebrity);
        console.log(`\n${celebrity}: ${nicknames.join(', ')}`);
    }
}

// Run the corrected finder
async function runCorrectedFinder() {
    const finder = new CorrectedEnhancedFinder();
    await finder.processAllCelebrities();
}

// Test first
testCorrectedFinder().catch(console.error);
