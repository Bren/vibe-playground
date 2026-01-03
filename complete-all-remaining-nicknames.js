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

// Comprehensive list of nicknames for remaining celebrities
const comprehensiveNicknames = {
    "וולודימיר זלנסקי": ["וולודימיר", "Volodymyr Zelensky"],
    "שלמה ארצי": ["שלמה", "Shlomo Artzi"],
    "רן דנקר": ["רן", "Ran Danker"],
    "בארט סימפסון": ["בארט", "Bart Simpson"],
    "נלי תגר": ["נלי", "Nelly Tagar"],
    "נינט טייב": ["נינט", "Ninette Tayeb"],
    "בראד פיט": ["בראד", "Brad Pitt"],
    "אנג'לינה ג'ולי": ["אנג'לינה", "Angelina Jolie"],
    "מוני מושונוב": ["מוני", "Moni Moshonov"],
    "נעמה לזימי": ["נעמה", "Naama Lazimi"],
    "אלון אבוטבול": ["אלון", "Alon Abutbul"],
    "יוסי בנאי": ["יוסי", "Yossi Banai"],
    "אורי גלר": ["אורי", "Uri Geller"],
    "דני רובס": ["דני", "Danny Robas"],
    "אלון דהן": ["אלון", "Alon Dahan"],
    "יוסי יונה": ["יוסי", "Yossi Yona"],
    "איילת שקד": ["איילת", "Ayelet Shaked"],
    "אריה דרעי": ["אריה", "Aryeh Deri"],
    "בצלאל סמוטריץ'": ["בצלאל", "Bezalel Smotrich"],
    "איתמר בן גביר": ["איתמר", "Itamar Ben-Gvir"],
    "משה כחלון": ["משה", "Moshe Kahlon"],
    "יאיר נתניהו": ["יאיר", "Yair Netanyahu"],
    "שרה נתניהו": ["שרה", "Sara Netanyahu"],
    "בנימין נתניהו": ["בנימין", "Benjamin Netanyahu", "ביבי"],
    "ציפי לבני": ["ציפי", "Tzipi Livni"],
    "אהוד אולמרט": ["אהוד", "Ehud Olmert"],
    "אריאל שרון": ["אריאל", "Ariel Sharon"],
    "אהוד ברק": ["אהוד", "Ehud Barak"],
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
    "אלון מוסקוביץ'": ["אלון", "Alon Moscovitz"],
    "יוסי כהן": ["יוסי", "Yossi Cohen"],
    "אליעזר שמואלי": ["אליעזר", "Eliezer Shmueli"],
    "אורי אריאל": ["אורי", "Uri Ariel"],
    "אלי ישי": ["אלי", "Eli Yishai"],
    "שקמה ברסלר": ["שקמה", "Shakma Bressler"],
    "גלי בהרב-מיארה": ["גלי", "Gali Baharav-Miara"],
    "מיקי מאוס": ["מיקי", "Mickey Mouse"],
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
    "בר רפאלי": ["בר", "Bar Refaeli"],
    "טום קרוז": ["טום", "Tom Cruise"],
    "ג'ניפר לורנס": ["ג'ניפר", "Jennifer Lawrence"],
    "רוברט דאוני ג'וניור": ["רוברט", "Robert Downey Jr.", "RDJ"],
    "סקרלט ג'והנסון": ["סקרלט", "Scarlett Johansson"],
    "כריס אוונס": ["כריס", "Chris Evans"],
    "מארק רופלו": ["מארק", "Mark Ruffalo"],
    "כריס המסוורת'": ["כריס", "Chris Hemsworth"],
    "ג'רמי רנר": ["ג'רמי", "Jeremy Renner"],
    "סמואל ל. ג'קסון": ["סמואל", "Samuel L. Jackson"],
    "גווינת' פאלטרו": ["גווינת'", "Gwyneth Paltrow"],
    "דון צ'ידל": ["דון", "Don Cheadle"],
    "פול ראד": ["פול", "Paul Rudd"],
    "בנדיקט קמברבאץ'": ["בנדיקט", "Benedict Cumberbatch"],
    "טום הולנד": ["טום", "Tom Holland"],
    "זנדאיה": ["Zendaya", "Zendaya"],
    "ג'ייקוב בטלון": ["ג'ייקוב", "Jacob Batalon"],
    "טוני רוולורי": ["טוני", "Tony Revolori"],
    "מריסה טומיי": ["מריסה", "Marisa Tomei"],
    "ג'ון פאברו": ["ג'ון", "Jon Favreau"],
    "רוברט דה נירו": ["רוברט", "Robert De Niro"],
    "אל פצ'ינו": ["אל", "Al Pacino"],
    "ג'ו פשי": ["ג'ו", "Joe Pesci"],
    "ריימונד אנתוני": ["ריימונד", "Raymond Anthony"],
    "פרנק וינצנט": ["פרנק", "Frank Vincent"],
    "טוני ליפ": ["טוני", "Tony Lip"],
    "לואיס גוזמן": ["לואיס", "Luis Guzmán"],
    "דסטין הופמן": ["דסטין", "Dustin Hoffman"],
    "טום הנקס": ["טום", "Tom Hanks"],
    "מורגן פרימן": ["מורגן", "Morgan Freeman"],
    "דנזל וושינגטון": ["דנזל", "Denzel Washington"],
    "ויל סמית'": ["ויל", "Will Smith"],
    "ג'יימי פוקס": ["ג'יימי", "Jamie Foxx"],
    "קווין ספייסי": ["קווין", "Kevin Spacey"],
    "ג'ון טרבולטה": ["ג'ון", "John Travolta"],
    "סמואל ל. ג'קסון": ["סמואל", "Samuel L. Jackson"],
    "ברוס ויליס": ["ברוס", "Bruce Willis"],
    "אלן ריקמן": ["אלן", "Alan Rickman"],
    "בוני בדליה": ["בוני", "Bonnie Bedelia"],
    "רג'ינה קינג": ["רג'ינה", "Regina King"],
    "לורנס פישבורן": ["לורנס", "Laurence Fishburne"],
    "ג'ו פנטוליאנו": ["ג'ו", "Joe Pantoliano"],
    "מאט דילון": ["מאט", "Matt Dillon"],
    "קריסטין דייויס": ["קריסטין", "Kristin Davis"],
    "קים קטרל": ["קים", "Kim Cattrall"],
    "סינתיה ניקסון": ["סינתיה", "Cynthia Nixon"],
    "שרה ג'סיקה פארקר": ["שרה", "Sarah Jessica Parker"],
    "כריס נות'": ["כריס", "Chris Noth"],
    "דייוויד אייגנברג": ["דייוויד", "David Eigenberg"],
    "אוון הנדלר": ["אוון", "Evan Handler"],
    "וילי גרסון": ["וילי", "Willie Garson"],
    "מריו קנטונה": ["מריו", "Mario Cantone"],
    "ג'ייסון לואיס": ["ג'ייסון", "Jason Lewis"],
    "ג'ון קורבט": ["ג'ייסון", "John Corbett"],
    "רון ליבינגסטון": ["רון", "Ron Livingston"],
    "קארי ברדשו": ["קארי", "Carrie Bradshaw"],
    "מירנדה הובס": ["מירנדה", "Miranda Hobbes"],
    "שארלוט יורק": ["שארלוט", "Charlotte York"],
    "סמנתה ג'ונס": ["סמנתה", "Samantha Jones"],
    "ביג": ["ביג", "Mr. Big"],
    "איידן שו": ["איידן", "Aidan Shaw"],
    "סטיב בריידי": ["סטיב", "Steve Brady"],
    "הארי גולדן": ["הארי", "Harry Goldenblatt"],
    "טרי מקדוגל": ["טרי", "Trey MacDougal"],
    "רוברט ליץ'": ["רוברט", "Robert Leach"],
    "ג'יימס רמר": ["ג'יימס", "James Remar"],
    "דייוויד דוכובני": ["דייוויד", "David Duchovny"],
    "ג'ון סלוטרי": ["ג'ון", "John Slattery"],
    "ג'ון קורבט": ["ג'ון", "John Corbett"],
    "רון ליבינגסטון": ["רון", "Ron Livingston"],
    "וילי גרסון": ["וילי", "Willie Garson"],
    "מריו קנטונה": ["מריו", "Mario Cantone"],
    "ג'ייסון לואיס": ["ג'ייסון", "Jason Lewis"],
    "דייוויד אייגנברג": ["דייוויד", "David Eigenberg"],
    "אוון הנדלר": ["אוון", "Evan Handler"],
    "כריס נות'": ["כריס", "Chris Noth"],
    "שרה ג'סיקה פארקר": ["שרה", "Sarah Jessica Parker"],
    "סינתיה ניקסון": ["סינתיה", "Cynthia Nixon"],
    "קים קטרל": ["קים", "Kim Cattrall"],
    "קריסטין דייוויס": ["קריסטין", "Kristin Davis"],
    "מאט דילון": ["מאט", "Matt Dillon"],
    "ג'ו פנטוליאנו": ["ג'ו", "Joe Pantoliano"],
    "לורנס פישבורן": ["לורנס", "Laurence Fishburne"],
    "רג'ינה קינג": ["רג'ינה", "Regina King"],
    "בוני בדליה": ["בוני", "Bonnie Bedelia"],
    "אלן ריקמן": ["אלן", "Alan Rickman"],
    "ברוס ויליס": ["ברוס", "Bruce Willis"],
    "סמואל ל. ג'קסון": ["סמואל", "Samuel L. Jackson"],
    "ג'ון טרבולטה": ["ג'ון", "John Travolta"],
    "קווין ספייסי": ["קווין", "Kevin Spacey"],
    "ג'יימי פוקס": ["ג'יימי", "Jamie Foxx"],
    "ויל סמית'": ["ויל", "Will Smith"],
    "דנזל וושינגטון": ["דנזל", "Denzel Washington"],
    "מורגן פרימן": ["מורגן", "Morgan Freeman"],
    "טום הנקס": ["טום", "Tom Hanks"],
    "דסטין הופמן": ["דסטין", "Dustin Hoffman"],
    "לואיס גוזמן": ["לואיס", "Luis Guzmán"],
    "טוני ליפ": ["טוני", "Tony Lip"],
    "פרנק וינצנט": ["פרנק", "Frank Vincent"],
    "ריימונד אנתוני": ["ריימונד", "Raymond Anthony"],
    "ג'ו פשי": ["ג'ו", "Joe Pesci"],
    "אל פצ'ינו": ["אל", "Al Pacino"],
    "רוברט דה נירו": ["רוברט", "Robert De Niro"],
    "ג'ון פאברו": ["ג'ון", "Jon Favreau"],
    "מריסה טומיי": ["מריסה", "Marisa Tomei"],
    "טוני רוולורי": ["טוני", "Tony Revolori"],
    "ג'ייקוב בטלון": ["ג'ייקוב", "Jacob Batalon"],
    "זנדאיה": ["Zendaya", "Zendaya"],
    "טום הולנד": ["טום", "Tom Holland"],
    "בנדיקט קמברבאץ'": ["בנדיקט", "Benedict Cumberbatch"],
    "פול ראד": ["פול", "Paul Rudd"],
    "דון צ'ידל": ["דון", "Don Cheadle"],
    "גווינת' פאלטרו": ["גווינת'", "Gwyneth Paltrow"],
    "סמואל ל. ג'קסון": ["סמואל", "Samuel L. Jackson"],
    "ג'רמי רנר": ["ג'רמי", "Jeremy Renner"],
    "כריס המסוורת'": ["כריס", "Chris Hemsworth"],
    "מארק רופלו": ["מארק", "Mark Ruffalo"],
    "כריס אוונס": ["כריס", "Chris Evans"],
    "סקרלט ג'והנסון": ["סקרלט", "Scarlett Johansson"],
    "רוברט דאוני ג'וניור": ["רוברט", "Robert Downey Jr.", "RDJ"],
    "ג'ניפר לורנס": ["ג'ניפר", "Jennifer Lawrence"],
    "טום קרוז": ["טום", "Tom Cruise"],
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
    "גולדה מאיר": ["גולדה", "Golda Meir"],
    "יאיר נתניהו": ["יאיר", "Yair Netanyahu"],
    "בצלאל סמוטריץ'": ["בצלאל", "Bezalel Smotrich"],
    "יצחק רבין": ["יצחק", "Yitzhak Rabin"],
    "איילת שקד": ["איילת", "Ayelet Shaked"],
    "אריה דרעי": ["אריה", "Aryeh Deri"],
    "ציפי לבני": ["ציפי", "Tzipi Livni"]
};

async function completeAllRemainingNicknames() {
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
                const nicknames = comprehensiveNicknames[name];
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

console.log('🔍 Completing all remaining nicknames...');
completeAllRemainingNicknames();






