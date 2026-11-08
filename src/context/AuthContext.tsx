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
  sendEmailLink: (email: string) => Promise<{ error: any }>;
  signInWithProvider: (provider: 'google') => Promise<{ error: any }>;
  signInWithEmailLinkDirect: (email: string) => Promise<{ error: any }>;
  signOut: () => Promise<{ error: any }>;
  isEmailLinkPending: boolean;
  emailLinkError: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEmailLinkPending, setIsEmailLinkPending] = useState(false);
  const [emailLinkError, setEmailLinkError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    // Handle email link redirect if present
    if (isSignInWithEmailLink(auth, window.location.href)) {
      const email = window.localStorage.getItem('emailForSignIn');
      if (email) {
        signInWithEmailLink(auth, email, window.location.href)
          .then(() => {
            window.localStorage.removeItem('emailForSignIn');
            window.history.replaceState({}, '', window.location.pathname);
            setIsEmailLinkPending(false);
            setEmailLinkError(null);
          })
          .catch((error) => {
            console.error("Errore durante l'accesso con link email:", error);
            setEmailLinkError("Link di accesso non valido o scaduto. Richiedine uno nuovo.");
          });
      } else {
        // Link opened on another device / browser where emailForSignIn is missing
        setIsEmailLinkPending(true);
      }
    }

    return () => unsubscribe();
  }, []);

  const signInWithEmailLinkDirect = async (email: string) => {
    try {
      await signInWithEmailLink(auth, email, window.location.href);
      window.localStorage.removeItem('emailForSignIn');
      window.history.replaceState({}, '', window.location.pathname);
      setIsEmailLinkPending(false);
      setEmailLinkError(null);
      return { error: null };
    } catch (error: any) {
      console.error("Errore durante l'accesso con link email:", error);
      const msg = "Link di accesso non valido o scaduto. Richiedine uno nuovo.";
      setEmailLinkError(msg);
      return { error: { message: msg } };
    }
  };

  const sendEmailLink = async (email: string) => {
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

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      return { error: null };
    } catch (error) {
      return { error };
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      session: user,
      loading,
      sendEmailLink,
      signInWithProvider,
      signInWithEmailLinkDirect,
      signOut,
      isEmailLinkPending,
      emailLinkError
    }}>
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
