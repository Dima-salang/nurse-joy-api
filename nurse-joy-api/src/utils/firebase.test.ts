import { initializeApp, getApps } from "firebase/app";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore/lite";

const firebaseConfig = {
  apiKey: "demo-api-key",
  authDomain: "demo-auth-domain",
  projectId: "demo-project-id",
  storageBucket: "demo-storage-bucket",
  messagingSenderId: "demo-messaging-sender-id",
  appId: "demo-app-id",
  measurementId: "demo-measurement-id"
};

// Initialize Firebase only if it hasn't been initialized
export const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const firestore = getFirestore(app);

// Connect to Firestore emulator
if (process.env.NODE_ENV === 'test') {
  connectFirestoreEmulator(firestore, 'localhost', 8080);
} 