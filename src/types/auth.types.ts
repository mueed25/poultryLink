import { User, Session } from '@supabase/supabase-js';

export type AuthUser = User;

export type AuthContextType = {
  user: AuthUser | null;
  session: Session | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ user: AuthUser | null; session: Session | null }>;
  register: (email: string, password: string) => Promise<{ user: AuthUser | null; session: Session | null }>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  loginWithGoogle: () => Promise<{ user: AuthUser | null; session: Session | null }>;
  loginWithFacebook: () => Promise<{ user: AuthUser | null; session: Session | null }>;
  updateProfile: (updates: { email?: string; password?: string; data?: Record<string, any> }) => Promise<{ user: AuthUser | null }>;
};

export type AuthStateListener = (user: AuthUser | null) => void;