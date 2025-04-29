import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  sendPasswordResetEmail, 
  onAuthStateChanged,
  User,
  AuthError as FirebaseAuthError
} from 'firebase/auth';
import { auth } from '../config/firebase';
import { createUser } from './firebaseService';

export interface AuthError {
  code: string;
  message: string;
}

export const signUp = async (
  email: string, 
  password: string, 
  name: string, 
  role: 'admin' | 'farmer' | 'buyer'
): Promise<User> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Create user document in Firestore
    await createUser({
      email,
      name,
      role,
    });

    return user;
  } catch (error) {
    const firebaseError = error as FirebaseAuthError;
    throw {
      code: firebaseError.code,
      message: getAuthErrorMessage(firebaseError.code)
    };
  }
};

export const signIn = async (email: string, password: string): Promise<User> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    const firebaseError = error as FirebaseAuthError;
    throw {
      code: firebaseError.code,
      message: getAuthErrorMessage(firebaseError.code)
    };
  }
};

export const logout = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error) {
    const firebaseError = error as FirebaseAuthError;
    throw {
      code: firebaseError.code,
      message: getAuthErrorMessage(firebaseError.code)
    };
  }
};

export const resetPassword = async (email: string): Promise<void> => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    const firebaseError = error as FirebaseAuthError;
    throw {
      code: firebaseError.code,
      message: getAuthErrorMessage(firebaseError.code)
    };
  }
};

export const getCurrentUser = (): User | null => {
  return auth.currentUser;
};

// Helper function to get user-friendly error messages
const getAuthErrorMessage = (code: string): string => {
  switch (code) {
    case 'auth/email-already-in-use':
      return 'This email is already registered';
    case 'auth/invalid-email':
      return 'Please enter a valid email address';
    case 'auth/operation-not-allowed':
      return 'This operation is not allowed';
    case 'auth/weak-password':
      return 'Password should be at least 6 characters';
    case 'auth/user-disabled':
      return 'This account has been disabled';
    case 'auth/user-not-found':
      return 'No account found with this email';
    case 'auth/wrong-password':
      return 'Incorrect password';
    case 'auth/too-many-requests':
      return 'Too many attempts. Please try again later';
    case 'auth/network-request-failed':
      return 'Network error. Please check your connection';
    default:
      return 'An error occurred. Please try again';
  }
}; 