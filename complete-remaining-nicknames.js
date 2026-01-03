const { google } = require('googleapis');
const credentials = require('./google-sheets-credentials.json');

const SHEET_ID = '1GgoGvCzW74vSqoaQeQmeGYEdNvLMY64iklDjCTYYOcY';
const SHEET_NAME = 'Published';
const BATCH_SIZE = 10;
const BATCH_DELAY = 1000;

const auth = new google.auth.JWT(
    credentials.client_email,
    null,
    credentials.private_key.replace(/\\n/g, '\n'),
    ['https://www.googleapis.com/auth/spreadsheets']
);

const sheets = google.sheets({ version: 'v4', auth });

const additionalNicknames = {
    "בר רפאלי": ["בר", "Bar Refaeli"],
    "הרצל": ["תיאודור", "Theodor Herzl"],
    "אמיר אוחנה": ["אמיר", "Amir Ohana"],
    "אורנה בנאי": ["אורנה", "Orna Banai"],
    "אסתר חיות": ["אסתר", "Esther Hayut"],
    "נטע ברזילי": ["נטע", "Netta Barzilai"],
    "ערן זהבי": ["ערן", "Eran Zahavi"],
    "מנסור עבאס": ["מנסור", "Mansour Abbas"],
    "אביב גפן": ["אביב", "Aviv Geffen"],
    "גילה אלמגור": ["גילה", "Gila Almagor"],
    "איילה חסון": ["איילה", "Ayelet Hasson"],
    "אבי מעוז": ["אבי", "Avi Maoz"],
    "ריהאנה": ["Rihanna", "Rihanna"],
    "וונדרוומן": ["Wonder Woman", "Diana Prince"],
    "שמחה רוטמן": ["שמחה", "Simcha Rotman"],
    "מישל אובמה": ["מישל", "Michelle Obama"],
    "אהוד ברק": ["אהוד", "Ehud Barak"],
    "מיקי מאוס": ["מיקי", "Mickey Mouse"],
    "גלי בהרב-מיארה": ["גלי", "Gali Baharav-Miara"],
    "שקמה ברסלר": ["שקמה", "Shakma Bressler"],
    "אלון מוסקוביץ'": ["אלון", "Alon Moscovitz"],
    "יוסי כהן": ["יוסי", "Yossi Cohen"],
    "אליעזר שמואלי": ["אליעזר", "Eliezer Shmueli"],
    "אורי אריאל": ["אורי", "Uri Ariel"],
    "אלי ישי": ["אלי", "Eli Yishai"],
    "אריה דרעי": ["אריה", "Aryeh Deri"],
    "בצלאל סמוטריץ'": ["בצלאל", "Bezalel Smotrich"],
    "איתמר בן גביר": ["איתמר", "Itamar Ben-Gvir"],
    "משה כחלון": ["משה", "Moshe Kahlon"],
    "יאיר נתניהו": ["יאיר", "Yair Netanyahu"],
    "שרה נתניהו": ["שרה", "Sara Netanyahu"],
    "בנימין נתניהו": ["בנימין", "Benjamin Netanyahu", "ביבי"],
    "יוסי יונה": ["יוסי", "Yossi Yona"],
    "איילת שקד": ["איילת", "Ayelet Shaked"],
    "נפתלי בנט": ["נפתלי", "Naftali Bennett"],
    "יאיר לפיד": ["יאיר", "Yair Lapid"],
    "בני גנץ": ["בני", "Benny Gantz"],
    "משה יעלון": ["משה", "Moshe Ya'alon"],
    "ציפי לבני": ["ציפי", "Tzipi Livni"],
    "אהוד אולמרט": ["אהוד", "Ehud Olmert"],
    "אריאל שרון": ["אריאל", "Ariel Sharon"],
    "אהוד ברק": ["אהוד", "Ehud Barak"],
    "בנימין נתניהו": ["בנימין", "Benjamin Netanyahu", "ביבי"],
    "יצחק רבין": ["יצחק", "Yitzhak Rabin"],
    "שמעון פרס": ["שמעון", "Shimon Peres", "פרס"],
    "יצחק שמיר": ["יצחק", "Yitzhak Shamir"],
    "מנחם בגין": ["מנחם", "Menachem Begin"],
    "גולדה מאיר": ["גולדה", "Golda Meir"],
    "לוי אשכול": ["לוי", "Levi Eshkol"],
    "דוד בן-גוריון": ["דוד", "David Ben-Gurion"],
    "חיים ויצמן": ["חיים", "Chaim Weizmann"],
    "אליעזר בן-יהודה": ["אליעזר", "Eliezer Ben-Yehuda"],
    "תיאודור הרצל": ["תיאודור", "Theodor Herzl"],
    "משה מונטיפיורי": ["משה", "Moses Montefiore"],
    "הרב קוק": ["הרב קוק", "Rav Kook"],
    "הרב עובדיה יוסף": ["הרב עובדיה", "Rav Ovadia"],
    "הרב שך": ["הרב שך", "Rav Shach"],
    "הרב אלישיב": ["הרב אלישיב", "Rav Elyashiv"],
    "הרב שטיינמן": ["הרב שטיינמן", "Rav Steinman"],
    "הרב קנייבסקי": ["הרב קנייבסקי", "Rav Kanievsky"],
    "הרב סולובייצ'יק": ["הרב סולובייצ'יק", "Rav Soloveitchik"],
    "הרב לטנשטיין": ["הרב לטנשטיין", "Rav Lichtenstein"],
    "הרב לאו": ["הרב לאו", "Rav Lau"],
    "הרב דרוקמן": ["הרב דרוקמן", "Rav Druckman"],
    "הרב שפירא": ["הרב שפירא", "Rav Shapira"],
    "הרב אבינר": ["הרב אבינר", "Rav Aviner"],
    "הרב מלמד": ["הרב מלמד", "Rav Melamed"],
    "הרב רוזן": ["הרב רוזן", "Rav Rosen"],
    "הרב גולדברג": ["הרב גולדברג", "Rav Goldberg"],
    "הרב שטרן": ["הרב שטרן", "Rav Stern"],
    "הרב כהן": ["הרב כהן", "Rav Cohen"],
    "הרב לוי": ["הרב לוי", "Rav Levi"],
    "הרב ישראלי": ["הרב ישראלי", "Rav Israeli"],
    "הרב הרצוג": ["הרב הרצוג", "Rav Herzog"],
    "הרב עמיטל": ["הרב עמיטל", "Rav Amital"],
    "הרב לטנשטיין": ["הרב לטנשטיין", "Rav Lichtenstein"],
    "הרב סולובייצ'יק": ["הרב סולובייצ'יק", "Rav Soloveitchik"],
    "הרב קנייבסקי": ["הרב קנייבסקי", "Rav Kanievsky"],
    "הרב שטיינמן": ["הרב שטיינמן", "Rav Steinman"],
    "הרב אלישיב": ["הרב אלישיב", "Rav Elyashiv"],
    "הרב שך": ["הרב שך", "Rav Shach"],
    "הרב עובדיה יוסף": ["הרב עובדיה", "Rav Ovadia"],
    "הרב קוק": ["הרב קוק", "Rav Kook"],
    "משה מונטיפיורי": ["משה", "Moses Montefiore"],
    "תיאודור הרצל": ["תיאודור", "Theodor Herzl"],
    "אליעזר בן-יהודה": ["אליעזר", "Eliezer Ben-Yehuda"],
    "חיים ויצמן": ["חיים", "Chaim Weizmann"],
    "דוד בן-גוריון": ["דוד", "David Ben-Gurion"],
    "לוי אשכול": ["לוי", "Levi Eshkol"],
    "גולדה מאיר": ["גולדה", "Golda Meir"],
    "מנחם בגין": ["מנחם", "Menachem Begin"],
    "יצחק שמיר": ["יצחק", "Yitzhak Shamir"],
    "שמעון פרס": ["שמעון", "Shimon Peres", "פרס"],
    "יצחק רבין": ["יצחק", "Yitzhak Rabin"],
    "בנימין נתניהו": ["בנימין", "Benjamin Netanyahu", "ביבי"],
    "אהוד ברק": ["אהוד", "Ehud Barak"],
    "אריאל שרון": ["אריאל", "Ariel Sharon"],
    "אהוד אולמרט": ["אהוד", "Ehud Olmert"],
    "ציפי לבני": ["ציפי", "Tzipi Livni"],
    "משה יעלון": ["משה", "Moshe Ya'alon"],
    "בני גנץ": ["בני", "Benny Gantz"],
    "יאיר לפיד": ["יאיר", "Yair Lapid"],
    "נפתלי בנט": ["נפתלי", "Naftali Bennett"],
    "איילת שקד": ["איילת", "Ayelet Shaked"],
    "יוסי יונה": ["יוסי", "Yossi Yona"],
    "בנימין נתניהו": ["בנימין", "Benjamin Netanyahu", "ביבי"],
    "שרה נתניהו": ["שרה", "Sara Netanyahu"],
    "יאיר נתניהו": ["יאיר", "Yair Netanyahu"],
    "משה כחלון": ["משה", "Moshe Kahlon"],
    "איתמר בן גביר": ["איתמר", "Itamar Ben-Gvir"],
    "בצלאל סמוטריץ'": ["בצלאל", "Bezalel Smotrich"],
    "אריה דרעי": ["אריה", "Aryeh Deri"],
    "אלי ישי": ["אלי", "Eli Yishai"],
    "אורי אריאל": ["אורי", "Uri Ariel"],
    "אליעזר שמואלי": ["אליעזר", "Eliezer Shmueli"],
    "יוסי כהן": ["יוסי", "Yossi Cohen"],
    "אלון מוסקוביץ'": ["אלון", "Alon Moscovitz"],
    "שקמה ברסלר": ["שקמה", "Shakma Bressler"],
    "גלי בהרב-מיארה": ["גלי", "Gali Baharav-Miara"],
    "מיקי מאוס": ["מיקי", "Mickey Mouse"],
    "אהוד ברק": ["אהוד", "Ehud Barak"],
    "מישל אובמה": ["מישל", "Michelle Obama"],
    "שמחה רוטמן": ["שמחה", "Simcha Rotman"],
    "וונדרוומן": ["Wonder Woman", "Diana Prince"],
    "ריהאנה": ["Rihanna", "Rihanna"],
    "אבי מעוז": ["אבי", "Avi Maoz"],
    "איילה חסון": ["איילה", "Ayelet Hasson"],
    "גילה אלמגור": ["גילה", "Gila Almagor"],
    "אביב גפן": ["אביב", "Aviv Geffen"],
    "מנסור עבאס": ["מנסור", "Mansour Abbas"],
    "ערן זהבי": ["ערן", "Eran Zahavi"],
    "נטע ברזילי": ["נטע", "Netta Barzilai"],
    "אסתר חיות": ["אסתר", "Esther Hayut"],
    "אורנה בנאי": ["אורנה", "Orna Banai"],
    "אמיר אוחנה": ["אמיר", "Amir Ohana"],
    "הרצל": ["תיאודור", "Theodor Herzl"],
    "בר רפאלי": ["בר", "Bar Refaeli"]
};

async function completeRemainingNicknames() {
    try {
        // 1. Get all existing data
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: SHEET_ID,
            range: `${SHEET_NAME}!A:G`, // Get all columns including nicknames
        });
        let rows = response.data.values || [];
        console.log(`📊 Found ${rows.length} rows in the sheet`);

        if (rows.length === 0) {
            console.log('No data found in the sheet.');
            return;
        }

        // 2. Prepare updates for celebrities without nicknames
        const allUpdates = [];
        for (let i = 1; i < rows.length; i++) { // Start from 1 to skip header
            const row = rows[i];
            const name = row[0]; // Name is in column A
            const currentNicknames = row[6]; // Nicknames are in column G

            // Only process if name exists and nicknames are empty
            if (name && (!currentNicknames || currentNicknames.trim() === '')) {
                const nicknames = additionalNicknames[name];
                if (nicknames && nicknames.length > 0) {
                    const nicknameString = nicknames.join(', ');
                    allUpdates.push({
                        range: `${SHEET_NAME}!G${i + 1}`, // Column G, row i+1
                        values: [[nicknameString]]
                    });
                    console.log(`✅ Prepared nicknames for ${name}: ${nicknameString}`);
                }
            }
        }

        console.log(`📝 Found ${allUpdates.length} celebrities needing nicknames`);

        // 3. Process updates in batches
        for (let i = 0; i < allUpdates.length; i += BATCH_SIZE) {
            const batch = allUpdates.slice(i, i + BATCH_SIZE);
            if (batch.length > 0) {
                await sheets.spreadsheets.values.batchUpdate({
                    spreadsheetId: SHEET_ID,
                    resource: {
                        valueInputOption: 'RAW',
                        data: batch
                    }
                });
                console.log(`📝 Updated batch ${Math.floor(i / BATCH_SIZE) + 1}: ${batch.length} celebrities`);
                await new Promise(resolve => setTimeout(resolve, BATCH_DELAY)); // Wait to avoid rate limits
            }
        }

        console.log(`🎉 Successfully completed nicknames for ${allUpdates.length} additional celebrities!`);

    } catch (error) {
        console.error(`❌ Error completing nicknames:`, error);
    }
}

console.log('🔍 Completing remaining nicknames...');
completeRemainingNicknames();






