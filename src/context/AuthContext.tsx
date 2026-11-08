import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User, 
  onAuthStateChanged, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut as firebaseSignOut,
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  signInWithEmailLink
} from 'firebase/auth';
import { auth } from '../lib/firebase';

interface AuthContextType {
  user: User | null;
  session: any; // Compatibility with existing code
  loading: boolean;
  signInWithOtp: (email: string) => Promise<{ error: any }>;
  signInWithProvider: (provider: 'google') => Promise<{ error: any }>;
  verifyOtp: (email: string, token: string) => Promise<{ error: any }>; // Token is unused for email link but kept for signature
  signOut: () => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    // Handle email link redirect if needed
    if (isSignInWithEmailLink(auth, window.location.href)) {
      let email = window.localStorage.getItem('emailForSignIn');
      if (!email) {
        email = window.prompt('Per favore inserisci la tua email per confermare:');
      }
      if (email) {
        signInWithEmailLink(auth, email, window.location.href)
          .then(() => {
            window.localStorage.removeItem('emailForSignIn');
          })
          .catch((error) => {
            console.error("Errore durante l'accesso con link email:", error);
          });
      }
    }

    return () => unsubscribe();
  }, []);

  const signInWithOtp = async (email: string) => {
    try {
      const actionCodeSettings = {
        url: window.location.origin,
        handleCodeInApp: true,
      };
      await sendSignInLinkToEmail(auth, email, actionCodeSettings);
      window.localStorage.setItem('emailForSignIn', email);
      return { error: null };
    } catch (error) {
      return { error };
    }
  };

  const signInWithProvider = async (provider: 'google') => {
    try {
      const googleProvider = new GoogleAuthProvider();
      await signInWithPopup(auth, googleProvider);
      return { error: null };
    } catch (error) {
      return { error };
    }
  };

  const verifyOtp = async (email: string, _token: string) => {
    // In Firebase, verification happens via the link in the email.
    // This is kept for compatibility with the existing Login.tsx calls.
    return { error: { message: "Usa il link inviato alla tua email per accedere." } };
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      return { error: null };
    } catch (error) {
      return { error };
    }
  };

  return (
    <AuthContext.Provider value={{ user, session: user, loading, signInWithOtp, signInWithProvider, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
