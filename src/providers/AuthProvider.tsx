'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
  User as FirebaseUser,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';
import { User } from '@/types';
import toast from 'react-hot-toast';

interface AuthContextType {
  user: User | null;
  firebaseUser: FirebaseUser | null;
  loading: boolean;
  error: string | null;
  googleSignInAvailable: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string, displayName: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateUserProfile: (data: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [googleSignInAvailable, setGoogleSignInAvailable] = useState(true);

  // Sync user data with backend
  const syncUserWithBackend = async (fbUser: FirebaseUser): Promise<User> => {
    try {
      const response = await fetch('/api/auth/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          uid: fbUser.uid,
          email: fbUser.email,
          displayName: fbUser.displayName,
          photoURL: fbUser.photoURL,
        }),
      });

      if (!response.ok) throw new Error('Failed to sync user');
      
      const data = await response.json();
      return data.user;
    } catch (error) {
      console.error('Error syncing user:', error);
      // Return basic user data if sync fails
      return {
        _id: fbUser.uid,
        uid: fbUser.uid,
        email: fbUser.email || '',
        displayName: fbUser.displayName || 'User',
        photoURL: fbUser.photoURL || undefined,
        role: 'user',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    }
  };

  // Listen to auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setLoading(true);
      
      if (fbUser) {
        setFirebaseUser(fbUser);
        const userData = await syncUserWithBackend(fbUser);
        setUser(userData);
      } else {
        setFirebaseUser(null);
        setUser(null);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Sign in with Google
  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await signInWithPopup(auth, googleProvider);
      const userData = await syncUserWithBackend(result.user);
      setUser(userData);
      toast.success('Welcome back!');
    } catch (error: unknown) {
      let errorMessage = 'Failed to sign in with Google';
      if (error instanceof Error) {
        // Handle specific Firebase errors
        if (error.message.includes('configuration-not-found') || error.message.includes('auth/configuration-not-found')) {
          errorMessage = 'Google Sign-In is not enabled. Please enable it in Firebase Console or use email/password.';
          setGoogleSignInAvailable(false);
        } else if (error.message.includes('popup-closed-by-user')) {
          errorMessage = 'Sign-in cancelled';
        } else if (error.message.includes('network-request-failed')) {
          errorMessage = 'Network error. Please check your connection.';
        } else if (error.message.includes('unauthorized-domain')) {
          errorMessage = 'This domain is not authorized for Google Sign-In. Add it in Firebase Console.';
          setGoogleSignInAvailable(false);
        } else {
          errorMessage = error.message;
        }
      }
      toast.error(errorMessage);
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Sign in with email/password
  const signInWithEmail = async (email: string, password: string) => {
    try {
      setLoading(true);
      const result = await signInWithEmailAndPassword(auth, email, password);
      const userData = await syncUserWithBackend(result.user);
      setUser(userData);
      toast.success('Welcome back!');
    } catch (error: unknown) {
      let message = 'Failed to sign in';
      if (error instanceof Error) {
        if (error.message.includes('user-not-found')) {
          message = 'No account found with this email';
        } else if (error.message.includes('wrong-password')) {
          message = 'Incorrect password';
        } else if (error.message.includes('invalid-email')) {
          message = 'Invalid email address';
        }
      }
      toast.error(message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Sign up with email/password
  const signUpWithEmail = async (email: string, password: string, displayName: string) => {
    try {
      setLoading(true);
      const result = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update profile with display name
      await updateProfile(result.user, { displayName });
      
      const userData = await syncUserWithBackend(result.user);
      setUser(userData);
      toast.success('Account created successfully!');
    } catch (error: unknown) {
      let message = 'Failed to create account';
      if (error instanceof Error) {
        if (error.message.includes('email-already-in-use')) {
          message = 'An account with this email already exists';
        } else if (error.message.includes('weak-password')) {
          message = 'Password should be at least 6 characters';
        } else if (error.message.includes('invalid-email')) {
          message = 'Invalid email address';
        }
      }
      toast.error(message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Sign out
  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      setUser(null);
      setFirebaseUser(null);
      toast.success('Signed out successfully');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to sign out';
      toast.error(errorMessage);
      throw error;
    }
  };

  // Reset password
  const resetPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
      toast.success('Password reset email sent');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to send reset email';
      toast.error(errorMessage);
      throw error;
    }
  };

  // Update user profile
  const updateUserProfile = async (data: Partial<User>) => {
    try {
      if (!firebaseUser) throw new Error('Not authenticated');

      // Update Firebase profile if display name or photo changed
      if (data.displayName || data.photoURL) {
        await updateProfile(firebaseUser, {
          displayName: data.displayName,
          photoURL: data.photoURL,
        });
      }

      // Update in backend
      const response = await fetch('/api/auth/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uid: firebaseUser.uid, ...data }),
      });

      if (!response.ok) throw new Error('Failed to update profile');

      const updatedUser = await response.json();
      setUser(updatedUser.user);
      toast.success('Profile updated');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update profile';
      toast.error(errorMessage);
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    firebaseUser,
    loading,
    error,
    googleSignInAvailable,
    signInWithGoogle,
    signInWithEmail,
    signUpWithEmail,
    signOut,
    resetPassword,
    updateUserProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
