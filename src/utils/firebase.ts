// Import the functions you need from the SDKs you need
import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getMessaging } from "firebase-admin/messaging";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseAdminConfig = {
  credential: cert({
    projectId: process.env.ADMIN_FIREBASE_PROJECT_ID,
    clientEmail: process.env.ADMIN_FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.ADMIN_FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  })
};

// Initialize Firebase
if (getApps().length === 0) {
    initializeApp(firebaseAdminConfig);
}
export const adminFirestore = getFirestore();
export const adminMessaging = getMessaging();
