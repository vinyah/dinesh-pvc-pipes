import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

/**
 * Firebase is initialized once here. Use this file everywhere;
 * do not call initializeApp or getAuth again elsewhere.
 *
 * Add your Firebase web config in .env (see .env.example).
 * Until then, Firebase won't be initialized and app/auth will be null.
 *
 * In Firebase Console: enable "Authentication" → Sign-in method (e.g. Email/Password).
 */

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const hasConfig =
  firebaseConfig.apiKey &&
  firebaseConfig.projectId &&
  firebaseConfig.appId;

let app = null;
let auth = null;
if (hasConfig) {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
}

export { app, auth };
