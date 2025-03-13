import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

const apps = getApps();

if (!apps.length) {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY;

  if (!projectId || !clientEmail || !privateKey) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error(
        'Firebase Admin credentials are required in production. Missing: ' +
        [
          !projectId && 'FIREBASE_PROJECT_ID',
          !clientEmail && 'FIREBASE_CLIENT_EMAIL',
          !privateKey && 'FIREBASE_PRIVATE_KEY',
        ].filter(Boolean).join(', ')
      );
    }
    console.warn(
      'Firebase Admin credentials not found. Using development mode with limited functionality.'
    );
  }

  try {
    const credentials = projectId && clientEmail && privateKey ? {
      projectId,
      clientEmail,
      privateKey: privateKey.replace(/\\n/g, '\n'),
    } : undefined;

    initializeApp(credentials ? {
      credential: cert(credentials)
    } : {});

  } catch (error) {
    console.error('Firebase admin initialization error:', error);
    if (process.env.NODE_ENV === 'production') {
      throw error;
    }
  }
}

const app = getApps()[0];
export const adminAuth = getAuth(app);
export const adminDb = getFirestore(app);

export async function verifyIdToken(token) {
  try {
    const decodedToken = await adminAuth.verifyIdToken(token);
    return decodedToken;
  } catch (error) {
    console.error('Error verifying token:', error);
    return null;
  }
}

export default app;
