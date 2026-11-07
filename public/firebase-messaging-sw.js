importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyBxZH7WSiYhtIjaYsSisk0roX8iB-cr0rI",
  authDomain: "gen-lang-client-0625949376.firebaseapp.com",
  projectId: "gen-lang-client-0625949376",
  storageBucket: "gen-lang-client-0625949376.firebasestorage.app",
  messagingSenderId: "588144859506",
  appId: "1:588144859506:web:3d99dfab9de9f8206c25eb"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/favicon.ico'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
