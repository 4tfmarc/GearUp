import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

const apps = getApps();
let app;

if (!apps.length) {
  try {
    const projectId = process.env.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY;

    if (!projectId || !clientEmail || !privateKey) {
      throw new Error('Missing Firebase Admin credentials');
    }

    const credentials = {
      projectId,
      clientEmail,
      privateKey: privateKey.replace(/\\n/g, '\n'),
    };

    app = initializeApp({
      credential: cert(credentials)
    });
  } catch (error) {
    console.error('Firebase admin initialization error:', error);
    // Instead of throwing, initialize with empty app for development
    app = initializeApp({
      projectId: 'dummy-project',
    });
  }
} else {
  app = apps[0];
}

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
