// firebase.js
import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// 1) Firebase config from console
const firebaseConfig = {
  apiKey: "AIzaSyBLYK5uJRrWD4z7J7Hk-daWRntETQgbkKE",
  authDomain: "poultrypro-98ef7.firebaseapp.com",
  projectId: "poultrypro-98ef7",
  storageBucket: "poultrypro-98ef7.firebasestorage.app",
  messagingSenderId: "613206992878",
  appId: "1:613206992878:web:5600636e00e8161b4fd0ff",
  measurementId: "G-5BRB32WFDN"
};

// 2) Initialize app
const app = initializeApp(firebaseConfig);

// 3) Initialize Auth with AsyncStorage persistence
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

// 4) Initialize other services
const firestore = getFirestore(app);
const storage = getStorage(app);

export { app, auth, firestore, storage };
