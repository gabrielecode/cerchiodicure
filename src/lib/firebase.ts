import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getMessaging, getToken, onMessage, isSupported } from 'firebase/messaging';
import firebaseConfig from '../../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);

let messagingInstance: any = null;
let messagingInitialized = false;

export const getMessagingInstance = async () => {
  if (messagingInitialized) return messagingInstance;
  
  try {
    if (await isSupported()) {
      messagingInstance = getMessaging(app);
    }
  } catch (error) {
    console.error('Messaging not supported:', error);
  }
  
  messagingInitialized = true;
  return messagingInstance;
};

export const requestNotificationPermission = async () => {
  const messaging = await getMessagingInstance();
  if (!messaging) return null;
  
  try {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      const vapidKey = import.meta.env.VITE_FIREBASE_VAPID_KEY;
      if (!vapidKey) {
        console.warn('VITE_FIREBASE_VAPID_KEY not configured');
        return null;
      }
      const token = await getToken(messaging, { vapidKey });
      return token;
    }
  } catch (error) {
    console.error('Error requesting notification permission:', error);
  }
  return null;
};

export const onMessageListener = async () => {
  const messaging = await getMessagingInstance();
  if (!messaging) return null;
  
  return new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      resolve(payload);
    });
  });
};

export const testSendNotification = async (token: string, title: string, body: string) => {
  try {
    const response = await fetch('/api/send-notification', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${await auth.currentUser?.getIdToken()}`
      },
      body: JSON.stringify({ token, title, body })
    });
    return await response.json();
  } catch (error) {
    console.error('Error sending test notification:', error);
    return { error: 'Failed to send notification' };
  }
};
