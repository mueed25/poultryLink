// src/auth/supabaseAuth.ts
import { Session, User, AuthError } from '@supabase/supabase-js';
import { supabase } from '../config/superbase';
import { AuthStateListener } from '../types/auth.types';

class SupabaseAuthService {
  // Current user state
  private currentUser: User | null = null;
  private currentSession: Session | null = null;
  
  // Auth state change listener callbacks
  private authStateChangeListeners: AuthStateListener[] = [];
  
  constructor() {
    // Set up Supabase auth listener when service is created
    supabase.auth.onAuthStateChange((event, session) => {
      this.currentUser = session?.user || null;
      this.currentSession = session;
      
      // Notify all listeners
      this.authStateChangeListeners.forEach(listener => {
        listener(this.currentUser);
      });
    });
  }
  
  // Sign up with email and password
  async signUp(email: string, password: string): Promise<{ user: User | null; session: Session | null }> {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    
    if (error) throw error;
    return { user: data.user, session: data.session };
  }
  
  // Sign in with email and password
  async signIn(email: string, password: string): Promise<{ user: User | null; session: Session | null }> {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) throw error;
    return { user: data.user, session: data.session };
  }
  
  // Sign out
  async signOut(): Promise<void> {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }
  
  // Password reset
  async resetPassword(email: string): Promise<void> {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'yourapp://reset-password',
    });
    
    if (error) throw error;
  }
  
  // Google sign in
  async signInWithGoogle(): Promise<{ user: User | null; session: Session | null }> {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
    });
    
    if (error) throw error;
    // For OAuth, we return what we have, but the full user/session will be available
    // when the user is redirected back to the app and onAuthStateChange fires
    return { user: null, session: null };
  }
  
  // Facebook sign in
  async signInWithFacebook(): Promise<{ user: User | null; session: Session | null }> {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'facebook',
    });
    
    if (error) throw error;
    // For OAuth, we return what we have, but the full user/session will be available
    // when the user is redirected back to the app and onAuthStateChange fires
    return { user: null, session: null };
  }
  
  // Add listener for auth state changes (similar to Firebase onAuthStateChanged)
  onAuthStateChanged(callback: AuthStateListener): () => void {
    this.authStateChangeListeners.push(callback);
    
    // Return unsubscribe function
    return () => {
      const index = this.authStateChangeListeners.indexOf(callback);
      if (index > -1) {
        this.authStateChangeListeners.splice(index, 1);
      }
    };
  }
  
  // Get current user
  async getCurrentUser(): Promise<User | null> {
    const { data, error } = await supabase.auth.getUser();
    if (error) throw error;
    
    this.currentUser = data?.user || null;
    return this.currentUser;
  }
  
  // Get current session
  async getCurrentSession(): Promise<Session | null> {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    
    this.currentSession = data?.session || null;
    return this.currentSession;
  }
  
  // Check if user is logged in
  async isLoggedIn(): Promise<boolean> {
    const user = await this.getCurrentUser();
    return !!user;
  }
  
  // Update user profile
  async updateProfile(updates: { email?: string; password?: string; data?: Record<string, any> }): Promise<{ user: User | null }> {
    const { data, error } = await supabase.auth.updateUser(updates);
    
    if (error) throw error;
    return { user: data?.user || null };
  }
  
  // Get ID token (for API calls)
  async getIdToken(): Promise<string | null> {
    const { data } = await supabase.auth.getSession();
    return data?.session?.access_token || null;
  }
}

// Export as a singleton
export const supabaseAuth = new SupabaseAuthService();