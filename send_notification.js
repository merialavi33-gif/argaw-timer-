const admin = require('firebase-admin');

// Service Account Credentials ከ GitHub Environment Variable ማንበብ
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

// Firebase Admin SDK ማስመር (Initialize)
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://argaw-timer-default-rtdb.firebaseio.com"
});

const db = admin.database();
const messaging = admin.messaging();

async function sendPushToAll() {
  try {
    // 1. ከ Realtime Database የተመዘገቡ የ FCM Token መረጃዎችን ማምጣት
    const snapshot = await db.ref('fcm_tokens').once('value');
    const tokensData = snapshot.val();
    
    if (!tokensData) {
      console.log('ምንም የተመዘገበ FCM Token አልተገኘም።');
      // ፕሮግራሙን በሰላም መዝጋት
      process.exit(0);
    }

    // 2. Tokenዎችን ወደ array መቀየር
    const tokens = Object.values(tokensData).map(t => t.token);

    // 3. የሚላከውን ማስታወቂያ ማዘጋጀት
    const message = {
      notification: {
        title: '⏰ የታስክ ማስታወሻ!',
        body: 'የሰዓት ታስኮችዎን ያካሂዱ! በየሰዓቱ የሚሰሩትን ታስክ ማጠናቀቅዎን ያረጋግጡ።'
      },
      tokens: tokens
    };

    // 4. ማስታወቂያውን ለሁሉም ተጠቃሚዎች መላክ
    const response = await messaging.sendEachForMulticast(message);
    console.log('ማሳወቂያ ተልኳል፡', response.successCount, 'ስልኮች ደርሷቸዋል።');
    
    // ስራው ስለተጠናቀቀ ፕሮግራሙን መዝጋት
    process.exit(0);
  } catch (error) {
    console.error('ስህተት ተከሰተ፡', error);
    process.exit(1);
  }
}

// ፕሮግራሙን ማስራት
sendPushToAll();
