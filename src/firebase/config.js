import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Your web app's Firebase configuration
// Replace with your actual Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyC8riKQ3OL5wjNDLn5ilaIby_0XiAVIRDM",
  authDomain: "hstlms-36565.firebaseapp.com",
  projectId: "hstlms-36565",
  storageBucket: "hstlms-36565.firebasestorage.app",
  messagingSenderId: "1033785461215",
  appId: "1:1033785461215:web:e0da0fec3a68ff6f2d9c6a",
  measurementId: "G-2PR7DBZ2ZE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };