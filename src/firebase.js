import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyCAj3PkGZGtEvnHFwvoYs1g5vPv3WjA9nE",
  authDomain: "sharepics-c2125.firebaseapp.com",
  projectId: "sharepics-c2125",
  storageBucket: "sharepics-c2125.appspot.com",
  messagingSenderId: "108207133324",
  appId: "1:108207133324:web:9b3649611618683949e1a9"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth();

const db = getFirestore();

const storage = getStorage();

const GoogleProvider = new GoogleAuthProvider();

export { auth, GoogleProvider, db, storage }