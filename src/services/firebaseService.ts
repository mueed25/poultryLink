import { firestore } from '../config/firebase';
import { collection, addDoc, doc, getDoc, updateDoc } from 'firebase/firestore';

interface UserData {
  email: string;
  name: string;
  role: 'admin' | 'farmer' | 'buyer';
}

export const createUser = async (userData: UserData) => {
  try {
    await addDoc(collection(firestore, 'users'), {
      ...userData,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  } catch (error) {
    console.error('Error creating user document:', error);
    throw error;
  }
};

export const getUser = async (userId: string) => {
  try {
    const userDoc = await getDoc(doc(firestore, 'users', userId));
    return userDoc.data();
  } catch (error) {
    console.error('Error getting user:', error);
    throw error;
  }
};

export const updateUser = async (userId: string, userData: Partial<UserData>) => {
  try {
    await updateDoc(doc(firestore, 'users', userId), {
      ...userData,
      updatedAt: new Date(),
    });
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
}; 