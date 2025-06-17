import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getMessaging } from 'firebase-admin/messaging';

// Initialize Firebase Admin
const firebaseAdminConfig = {
  credential: cert({
    projectId: process.env.FIREBASE_PROJECT_ID!,
    privateKey: process.env.FIREBASE_API_KEY!,
  }),
};

const apps = getApps();

if (!apps.length) {
  initializeApp(firebaseAdminConfig);
}

export const adminDb = getFirestore();
export const adminMessaging = getMessaging();
