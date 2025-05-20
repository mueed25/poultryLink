import { supabase } from '../config/supabase';

export interface AuthError {
  message: string;
}

export const signUp = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    
    if (error) throw error;
    return data;
  } catch (error: any) {
    console.error('Error signing up:', error.message);
    throw { message: error.message || 'Failed to sign up' };
  }
};

export const signIn = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) throw error;
    return data;
  } catch (error: any) {
    console.error('Error signing in:', error.message);
    throw { message: error.message || 'Failed to sign in' };
  }
};

export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  } catch (error: any) {
    console.error('Error signing out:', error.message);
    throw { message: error.message || 'Failed to sign out' };
  }
};

export const resetPassword = async (email: string) => {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) throw error;
  } catch (error: any) {
    console.error('Error resetting password:', error.message);
    throw { message: error.message || 'Failed to reset password' };
  }
};

// Example of OAuth sign-in (Google)
export const signInWithGoogle = async () => {
  try {
    // Note: For React Native, you'll need to use a custom URL scheme 
    // and handle deep linking for OAuth to work properly
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
    });
    
    if (error) throw error;
    return data;
  } catch (error: any) {
    console.error('Error signing in with Google:', error.message);
    throw { message: error.message || 'Failed to sign in with Google' };
  }
};