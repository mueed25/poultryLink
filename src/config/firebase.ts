// firebase.js
import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// 1) Firebase config from console


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
