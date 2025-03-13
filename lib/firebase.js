import { initializeApp } from 'firebase/app';
import { getAuth, browserLocalPersistence, setPersistence } from 'firebase/auth';
import { getAnalytics } from 'firebase/analytics';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// Validate required config values
const requiredFields = ['apiKey', 'authDomain', 'projectId', 'appId'];
for (const field of requiredFields) {
  if (!firebaseConfig[field]) {
    throw new Error(`Missing required Firebase configuration field: ${field}`);
  }
}

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Set persistence to local and disable default popups
setPersistence(auth, browserLocalPersistence)
  .catch((error) => {
    console.error('Auth persistence error:', error);
  });

// Initialize Analytics only if we're on client side and have necessary config
let analytics = null;
if (typeof window !== 'undefined' && firebaseConfig.measurementId) {
  try {
    analytics = getAnalytics(app);
  } catch (error) {
    console.error('Failed to initialize Firebase Analytics:', error);
  }
}

export { auth };
export const db = getFirestore(app);
export const storage = getStorage(app);
export { analytics };
