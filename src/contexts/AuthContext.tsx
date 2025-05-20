// src/auth/AuthContext.tsx
import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabaseAuth } from './SuperbaseAuth';
import { AuthContextType, AuthUser } from '../types/auth.types';

// Create auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

// Provider component
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Check for user on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Get current session and user
        const currentSession = await supabaseAuth.getCurrentSession();
        const currentUser = await supabaseAuth.getCurrentUser();
        
        setSession(currentSession);
        setUser(currentUser);
      } catch (error) {
        console.error('Error checking auth state:', error);
      } finally {
        setLoading(false);
      }
    };
    
    initializeAuth();
    
    // Set up auth state listener (equivalent to Firebase's onAuthStateChanged)
    const unsubscribe = supabaseAuth.onAuthStateChanged((user) => {
      setUser(user);
      supabaseAuth.getCurrentSession().then(setSession);
      setLoading(false);
    });
    
    // Clean up
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);
  
  // Auth methods
  const login = async (email: string, password: string) => {
    try {
      const { user, session } = await supabaseAuth.signIn(email, password);
      return { user, session };
    } catch (error) {
      throw error;
    }
  };
  
  const register = async (email: string, password: string) => {
    try {
      const { user, session } = await supabaseAuth.signUp(email, password);
      return { user, session };
    } catch (error) {
      throw error;
    }
  };
  
  const logout = async () => {
    try {
      await supabaseAuth.signOut();
    } catch (error) {
      throw error;
    }
  };
  
  const resetPassword = async (email: string) => {
    try {
      await supabaseAuth.resetPassword(email);
    } catch (error) {
      throw error;
    }
  };
  
  const loginWithGoogle = async () => {
    try {
      const { user, session } = await supabaseAuth.signInWithGoogle();
      return { user, session };
    } catch (error) {
      throw error;
    }
  };
  
  const loginWithFacebook = async () => {
    try {
      const { user, session } = await supabaseAuth.signInWithFacebook();
      return { user, session };
    } catch (error) {
      throw error;
    }
  };
  
  const updateProfile = async (updates: { email?: string; password?: string; data?: Record<string, any> }) => {
    try {
      const { user } = await supabaseAuth.updateProfile(updates);
      return { user };
    } catch (error) {
      throw error;
    }
  };
  
  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        login,
        register,
        logout,
        resetPassword,
        loginWithGoogle,
        loginWithFacebook,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};