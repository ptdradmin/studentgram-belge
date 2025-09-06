import React, { createContext, useContext, ReactNode } from 'react';
import { User } from '@supabase/supabase-js';
import { Profile } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import useSWR from 'swr';
import { fetcher, buildApiUrl } from '@/lib/fetcher';
import { signInWithCookies, signUpWithCookies, signOutWithCookies } from '@/lib/auth-cookies';

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (email: string, password: string, profileData: any) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  mutate: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const { toast } = useToast();

  // Use SWR to fetch user data with automatic caching, revalidation, and error handling
  const { data: userData, error, mutate, isLoading } = useSWR(
    buildApiUrl('/auth/me'),
    fetcher,
    {
      // Don't retry on error (e.g., 401 Unauthorized)
      shouldRetryOnError: false,
      // Revalidate when window gets focus
      revalidateOnFocus: true,
      // Revalidate when reconnecting
      revalidateOnReconnect: true,
      // Don't revalidate on mount if data exists
      revalidateIfStale: false,
    }
  );

  // Extract user and profile from the response
  const user = error ? null : userData?.user || null;
  const profile = error ? null : userData?.profile || null;
  const loading = isLoading;

  const handleSignIn = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      // Check for admin credentials first
      const adminEmail = import.meta.env.VITE_ADMIN_EMAIL;
      const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD;
      
      if (email === adminEmail && password === adminPassword) {
        // Create admin user object
        const adminUser = {
          id: 'admin-001',
          email: adminEmail,
          user_metadata: {
            full_name: 'Administrator',
            role: 'admin'
          },
          role: 'admin'
        };
        
        // Update SWR cache with admin user
        mutate({ user: adminUser, profile: { ...adminUser, role: 'admin' } }, false);
        
        toast({
          title: "Connexion administrateur réussie!",
          description: "Bienvenue dans l'interface d'administration.",
        });
        
        return { success: true };
      }
      
      // Regular user authentication
      const result = await signInWithCookies(email, password);
      
      if (!result.success) {
        return { success: false, error: result.error };
      }

      // Update SWR cache optimistically
      mutate(result.user, false);
      
      toast({
        title: "Connexion réussie!",
        description: "Bienvenue sur StudentGram.",
      });
      
      return { success: true };
    } catch (error: any) {
      console.error('Sign in error:', error);
      return { success: false, error: error.message || "Une erreur s'est produite" };
    }
  };

  const handleSignUp = async (email: string, password: string, profileData: any): Promise<{ success: boolean; error?: string }> => {
    try {
      const result = await signUpWithCookies(email, password, profileData);
      
      if (!result.success) {
        return { success: false, error: result.error };
      }

      // Update SWR cache optimistically
      mutate(result.user, false);
      
      toast({
        title: "Inscription réussie!",
        description: "Votre compte a été créé avec succès.",
      });
      
      return { success: true };
    } catch (error: any) {
      console.error('Sign up error:', error);
      return { success: false, error: error.message || "Une erreur s'est produite" };
    }
  };

  const handleSignOut = async (): Promise<void> => {
    try {
      await signOutWithCookies();
      
      // Update SWR cache to null and trigger revalidation
      mutate(null);
      
      toast({
        title: "Déconnexion réussie",
        description: "À bientôt sur StudentGram!",
      });
    } catch (error) {
      console.error('Sign out error:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors de la déconnexion",
        variant: "destructive"
      });
    }
  };

  const value: AuthContextType = {
    user,
    profile,
    loading,
    signIn: handleSignIn,
    signUp: handleSignUp,
    signOut: handleSignOut,
    mutate,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
