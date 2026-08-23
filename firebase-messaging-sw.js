importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyBH68jMv7c6WGB_z73e2IsTn3KTi2tg5c4",
  authDomain: "argaw-timer.firebaseapp.com",
  projectId: "argaw-timer",
  storageBucket: "argaw-timer.firebasestorage.app",
  messagingSenderId: "951329293569",
  appId: "1:951329293569:web:00d5c0a6888972162a8700"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: './icon.svg',
    badge: './icon.svg',
    vibrate: [200, 100, 200],
    tag: 'task-hourly-reminder',
    renotify: true
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
