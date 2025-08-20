import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Firebase設定（環境変数から取得）
console.log("API_KEY:", process.env.REACT_APP_FIREBASE_API_KEY);
console.log("AUTH_DOMAIN:", process.env.REACT_APP_FIREBASE_AUTH_DOMAIN);
console.log("PROJECT_ID:", process.env.REACT_APP_FIREBASE_PROJECT_ID);
console.log("STORAGE_BUCKET:", process.env.REACT_APP_FIREBASE_STORAGE_BUCKET);
console.log("MESSAGING_SENDER_ID:", process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID);
console.log("APP_ID:", process.env.REACT_APP_FIREBASE_APP_ID);

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
};

// Firebaseアプリを初期化
const app = initializeApp(firebaseConfig);

// Authenticationを初期化
export const auth = getAuth(app);

export default app;
