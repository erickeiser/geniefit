import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your Firebase project configuration.
const firebaseConfig = {
  apiKey: "AIzaSyD_9JH77-Rw01eFmbgGTJPiDRD2NIJcF6A",
  authDomain: "fitgenie-app.firebaseapp.com",
  projectId: "fitgenie-app",
  storageBucket: "fitgenie-app.firebasestorage.app",
  messagingSenderId: "721854165371",
  appId: "1:721854165371:web:bc307bee86873bb69e8dde"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };