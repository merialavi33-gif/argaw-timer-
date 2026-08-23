const admin = require('firebase-admin');

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://argaw-timer-default-rtdb.firebaseio.com"
});

const db = admin.database();
const messaging = admin.messaging();

async function sendPushToAll() {
  const snapshot = await db.ref('fcm_tokens').once('value');
  const tokensData = snapshot.val();
  
  if (!tokensData) {
    console.log('ምንም የተመዘገበ FCM Token አልተገኘም።');
    return;
  }

  const tokens = Object.values(tokensData).map(t => t.token);

  const message = {
    notification: {
      title: '⏰ የታስክ ማስታወሻ!',
      body: 'የሰዓት ታስኮችዎን ያካሂዱ! በየሰዓቱ የሚሰሩትን ታስክ ማጠናቀቅዎን ያረጋግጡ።'
    },
    tokens: tokens
  };

  const response = await messaging.sendEachForMulticast(message);
  console.log('ማሳወቂያ ተልኳል፡', response.successCount, 'ስልኮች ደርሷቸዋል።');
}

sendPushToAll().catch(console.error);
