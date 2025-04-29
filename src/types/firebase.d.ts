import { FirebaseApp } from 'firebase/app';
import { Auth } from 'firebase/auth';
import { Firestore } from 'firebase/firestore';

declare module 'firebase/app' {
  interface FirebaseApp {
    auth(): Auth;
    firestore(): Firestore;
  }
}

declare module 'firebase/auth' {
  interface Auth {
    setPersistence(persistence: any): Promise<void>;
  }
} 