import React, { createContext, useContext, useState, useEffect, useLayoutEffect, useCallback } from 'react';
import { 
  collection, 
  doc, 
  setDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  onSnapshot, 
  serverTimestamp,
  orderBy,
  limit,
  writeBatch
} from 'firebase/firestore';
import { Post, CareEvent, Medication, CareDocument, Member, Profile, PostType, MealPlan, MealItem } from '../types';
import { db, auth } from '../lib/firebase';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  // We'll just log it and maybe show a toast in the component, but we should throw it for the context to handle
  throw new Error(JSON.stringify(errInfo));
}

interface ToastMessage {
  id: string;
  message: string;
  type?: 'success' | 'info';
}

interface AppContextType {
  profile: Profile | null;
  currentView: 'landing' | 'login' | 'app';
  setCurrentView: (view: 'landing' | 'login' | 'app') => void;
  members: Member[];
  posts: Post[];
  events: CareEvent[];
  medications: Medication[];
  documents: CareDocument[];
  meals: MealPlan[];
  dietaryNotes: string;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  toasts: ToastMessage[];
  showToast: (message: string, type?: 'success' | 'info') => void;
  createCircle: (recipientName: string, userName: string, userRole: string) => Promise<void>;
  joinCircle: (code: string, userName: string, userRole: string) => Promise<boolean>;
  logoutCircle: () => Promise<void>;
  updateProfile: (recipientName: string) => Promise<void>;
  addPost: (text: string, type: PostType, completed?: boolean, imageUrl?: string) => Promise<void>;
  addEvent: (event: Omit<CareEvent, 'id'>) => Promise<void>;
  toggleEventStatus: (eventId: string) => Promise<void>;
  addMedication: (med: Omit<Medication, 'id' | 'checks'>) => Promise<void>;
  toggleMedicationDose: (medId: string, timeSlot: string, dateStr?: string) => Promise<void>;
  addDocument: (doc: Omit<CareDocument, 'id'>) => Promise<void>;
  addMember: (name: string, role: string) => Promise<void>;
  removeMember: (id: string) => Promise<void>;
  updateMeal: (id: string, lunch: MealItem, dinner: MealItem) => Promise<void>;
  updateDietaryNotes: (notes: string) => Promise<void>;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  loading: boolean;
  circleId: string | null;
  registerPushToken: (token: string) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [circleId, setCircleId] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<'landing' | 'login' | 'app'>('landing');
  const [loading, setLoading] = useState(true);
  
  const [members, setMembers] = useState<Member[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [events, setEvents] = useState<CareEvent[]>([]);
  const [medications, setMedications] = useState<Medication[]>([]);
  const [documents, setDocuments] = useState<CareDocument[]>([]);
  const [meals, setMeals] = useState<MealPlan[]>([]);
  const [dietaryNotes, setDietaryNotes] = useState<string>("");
  
  const [activeTab, setActiveTab] = useState<string>('timeline');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = useCallback((message: string, type: 'success' | 'info' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  const logFirestoreError = (err: any, operation: OperationType, path: string) => {
    console.error(`Firestore Error [${operation}] at ${path}:`, err);
    showToast("Errore di sincronizzazione", "info");
  };

  // Set up real-time listeners for the circle
  useEffect(() => {
    if (!circleId || !auth.currentUser) {
      setMembers([]);
      setPosts([]);
      setEvents([]);
      setMedications([]);
      setDocuments([]);
      setMeals([]);
      setDietaryNotes("");
      return;
    }

    const unsubscribers: (() => void)[] = [];

    // Members
    const membersQuery = query(collection(db, 'circles', circleId, 'members'));
    unsubscribers.push(onSnapshot(membersQuery, (snapshot) => {
      const mData = snapshot.docs.map(doc => ({
        id: doc.id,
        name: doc.data().displayName,
        role: doc.data().role,
        avatar: doc.data().displayName?.substring(0, 2).toUpperCase() || 'U',
        online: true
      }));
      setMembers(mData);
    }, (err) => logFirestoreError(err, OperationType.LIST, `circles/${circleId}/members`)));

    // Posts
    const postsQuery = query(collection(db, 'circles', circleId, 'posts'), orderBy('timestamp', 'desc'), limit(50));
    unsubscribers.push(onSnapshot(postsQuery, (snapshot) => {
      const pData = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          timestamp: data.timestamp?.toDate ? data.timestamp.toDate().toLocaleString() : new Date().toLocaleString()
        } as Post;
      });
      setPosts(pData);
    }, (err) => logFirestoreError(err, OperationType.LIST, `circles/${circleId}/posts`)));

    // Events
    const eventsQuery = query(collection(db, 'circles', circleId, 'events'), orderBy('date', 'asc'));
    unsubscribers.push(onSnapshot(eventsQuery, (snapshot) => {
      const eData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as CareEvent));
      setEvents(eData);
    }, (err) => logFirestoreError(err, OperationType.LIST, `circles/${circleId}/events`)));

    // Medications
    const medsQuery = query(collection(db, 'circles', circleId, 'medications'));
    unsubscribers.push(onSnapshot(medsQuery, (snapshot) => {
      const mData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Medication));
      setMedications(mData);
    }, (err) => logFirestoreError(err, OperationType.LIST, `circles/${circleId}/medications`)));

    // Documents
    const docsQuery = query(collection(db, 'circles', circleId, 'documents'), orderBy('createdAt', 'desc'));
    unsubscribers.push(onSnapshot(docsQuery, (snapshot) => {
      const dData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as CareDocument));
      setDocuments(dData);
    }, (err) => logFirestoreError(err, OperationType.LIST, `circles/${circleId}/documents`)));

    // Meals
    const mealsQuery = query(collection(db, 'circles', circleId, 'meals'));
    unsubscribers.push(onSnapshot(mealsQuery, (snapshot) => {
      const mData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as MealPlan));
      setMeals(mData);
    }, (err) => logFirestoreError(err, OperationType.LIST, `circles/${circleId}/meals`)));

    // Dietary Notes
    const dietRef = doc(db, 'circles', circleId, 'dietary_notes', 'notes');
    unsubscribers.push(onSnapshot(dietRef, (docSnap) => {
      if (docSnap.exists()) {
        setDietaryNotes(docSnap.data().notes);
      }
    }, (err) => logFirestoreError(err, OperationType.GET, `circles/${circleId}/dietary_notes/notes`)));

    return () => {
      unsubscribers.forEach(unsub => unsub());
    };
  }, [circleId]);

  // Handle Authentication and Membership check
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (!user) {
        setProfile(null);
        setCircleId(null);
        setCurrentView('landing');
        setLoading(false);
        return;
      }

      // Find which circle this user belongs to
      try {
        let savedCircleId = localStorage.getItem('ccc_current_circle_id');
        
        if (!savedCircleId) {
          const userCircleSnap = await getDoc(doc(db, 'user_circles', user.uid));
          if (userCircleSnap.exists()) {
            savedCircleId = userCircleSnap.data().circleId;
          }
        }

        if (savedCircleId) {
          const memberRef = doc(db, 'circles', savedCircleId, 'members', user.uid);
          const memberSnap = await getDoc(memberRef);
          if (memberSnap.exists()) {
            const circleRef = doc(db, 'circles', savedCircleId);
            const circleSnap = await getDoc(circleRef);
            if (circleSnap.exists()) {
              const circleData = circleSnap.data();
              const memberData = memberSnap.data();
              
              localStorage.setItem('ccc_current_circle_id', savedCircleId);
              setCircleId(savedCircleId);
              setProfile({
                recipientName: circleData.recipientName,
                userName: memberData.displayName,
                userRole: memberData.role,
                inviteCode: circleData.inviteCode,
                isOnboarded: true
              });
              setCurrentView('app');
              setLoading(false);
              return;
            }
          }
        }

        setLoading(false);
        setCurrentView('login');
      } catch (err) {
        console.error("Error checking membership:", err);
        setLoading(false);
        setCurrentView('login');
      }
    });

    return () => unsubscribe();
  }, []);

  const registerPushToken = async (token: string) => {
    const user = auth.currentUser;
    if (!user) return;

    const path = `push_tokens/${user.uid}`;
    try {
      await setDoc(doc(db, 'push_tokens', user.uid), {
        userId: user.uid,
        token: token,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      }, { merge: true });
      showToast("Notifiche attivate con successo!");
    } catch (err: any) {
      handleFirestoreError(err, OperationType.WRITE, path);
    }
  };

  useLayoutEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));

  const logoutCircle = async () => {
    await auth.signOut();
    localStorage.removeItem('ccc_current_circle_id');
  };

  const createCircle = async (recipientName: string, userName: string, userRole: string) => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      const inviteCode = Math.random().toString(36).substring(2, 8).toUpperCase();
      
      const batch = writeBatch(db);
      
      // 1. Create Circle
      const circleRef = doc(collection(db, 'circles'));
      batch.set(circleRef, {
        recipientName,
        inviteCode,
        createdBy: user.uid,
        createdAt: serverTimestamp()
      });

      // 2. Add Member
      const memberRef = doc(db, 'circles', circleRef.id, 'members', user.uid);
      batch.set(memberRef, {
        displayName: userName,
        role: userRole,
        userId: user.uid,
        circleId: circleRef.id,
        inviteCode,
        joinedAt: serverTimestamp()
      });

      // 3. Create Invite Code Mapping
      const inviteRef = doc(db, 'invite_codes', inviteCode);
      batch.set(inviteRef, {
        circleId: circleRef.id,
        recipientName
      });

      // 4. Create Meals
      const days = ['lun', 'mar', 'mer', 'gio', 'ven', 'sab', 'dom'];
      const dayNames = ['Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato', 'Domenica'];
      
      days.forEach((dayId, index) => {
        const mealRef = doc(db, 'circles', circleRef.id, 'meals', dayId);
        batch.set(mealRef, {
          day: dayNames[index],
          lunch: { dish: '', provider: '', status: 'pianificato' },
          dinner: { dish: '', provider: '', status: 'pianificato' },
          circleId: circleRef.id,
          createdBy: user.uid,
          order: index
        });
      });

      // 5. Update User Circle Mapping
      batch.set(doc(db, 'user_circles', user.uid), { circleId: circleRef.id });

      await batch.commit();
      
      localStorage.setItem('ccc_current_circle_id', circleRef.id);
      setCircleId(circleRef.id);
      setProfile({ recipientName, userName, userRole, inviteCode, isOnboarded: true });
      setCurrentView('app');
      showToast(`Cerchio creato con successo!`);
    } catch (error: any) {
      handleFirestoreError(error, OperationType.WRITE, 'circles');
    }
  };

  const joinCircle = async (code: string, userName: string, userRole: string): Promise<boolean> => {
    const user = auth.currentUser;
    if (!user) return false;

    try {
      const inviteCode = code.toUpperCase();
      const inviteRef = doc(db, 'invite_codes', inviteCode);
      const inviteSnap = await getDoc(inviteRef);
      
      if (!inviteSnap.exists()) {
        showToast('Codice invito non valido', 'info');
        return false;
      }

      const { circleId: targetCircleId } = inviteSnap.data();

      // Add as member
      await setDoc(doc(db, 'circles', targetCircleId, 'members', user.uid), {
        displayName: userName,
        role: userRole,
        userId: user.uid,
        circleId: targetCircleId,
        inviteCode,
        joinedAt: serverTimestamp()
      });

      // Update User Circle Mapping
      await setDoc(doc(db, 'user_circles', user.uid), { circleId: targetCircleId });

      localStorage.setItem('ccc_current_circle_id', targetCircleId);
      setCircleId(targetCircleId);
      
      // We don't have circle data here easily without getDoc(circles/cid), 
      // but AppContext will load it from onSnapshot or we could fetch it.
      // For simplicity, assume profile will be set via another mechanism or fetch it here.
      const circleSnap = await getDoc(doc(db, 'circles', targetCircleId));
      if (circleSnap.exists()) {
        setProfile({ 
          recipientName: circleSnap.data().recipientName, 
          userName, 
          userRole, 
          inviteCode, 
          isOnboarded: true 
        });
      }
      
      setCurrentView('app');
      showToast(`Ti sei unito al cerchio!`);
      return true;
    } catch (error: any) {
      handleFirestoreError(error, OperationType.WRITE, 'join');
      return false;
    }
  };

  const updateProfile = async (recipientName: string) => {
    if (!circleId) return;
    try {
      await updateDoc(doc(db, 'circles', circleId), { recipientName });
      setProfile(p => p ? { ...p, recipientName } : null);
      showToast('Profilo aggiornato');
    } catch (error: any) {
      handleFirestoreError(error, OperationType.UPDATE, `circles/${circleId}`);
    }
  };

  const addPost = async (text: string, type: PostType, completed: boolean = false, imageUrl?: string) => {
    if (!circleId || !auth.currentUser) return;
    const path = `circles/${circleId}/posts`;
    try {
      await addDoc(collection(db, 'circles', circleId, 'posts'), {
        circleId,
        authorName: profile?.userName || 'Utente',
        authorAvatar: '', // Optional avatar logic
        type,
        text,
        completed,
        imageUrl: imageUrl || '',
        timestamp: serverTimestamp(),
        createdBy: auth.currentUser.uid
      });
    } catch (error: any) {
      handleFirestoreError(error, OperationType.CREATE, path);
    }
  };

  const addEvent = async (eventData: Omit<CareEvent, 'id'>) => {
    if (!circleId || !auth.currentUser) return;
    const path = `circles/${circleId}/events`;
    try {
      await addDoc(collection(db, 'circles', circleId, 'events'), {
        ...eventData,
        circleId,
        createdBy: auth.currentUser.uid
      });
    } catch (error: any) {
      handleFirestoreError(error, OperationType.CREATE, path);
    }
  };

  const toggleEventStatus = async (eventId: string) => {
    if (!circleId) return;
    const event = events.find(e => e.id === eventId);
    if (!event) return;
    const nextStatus = event.status === 'completato' ? 'attesa' : 'completato';
    try {
      await updateDoc(doc(db, 'circles', circleId, 'events', eventId), { status: nextStatus });
    } catch (error: any) {
      handleFirestoreError(error, OperationType.UPDATE, `circles/${circleId}/events/${eventId}`);
    }
  };

  const addMedication = async (medData: Omit<Medication, 'id' | 'checks'>) => {
    if (!circleId || !auth.currentUser) return;
    const path = `circles/${circleId}/medications`;
    try {
      await addDoc(collection(db, 'circles', circleId, 'medications'), {
        ...medData,
        checks: {},
        circleId,
        createdBy: auth.currentUser.uid
      });
    } catch (error: any) {
      handleFirestoreError(error, OperationType.CREATE, path);
    }
  };

  const toggleMedicationDose = async (medId: string, timeSlot: string, dateStr: string = new Date().toISOString().split('T')[0]) => {
    if (!circleId) return;
    const med = medications.find(m => m.id === medId);
    if (!med) return;
    const key = `${dateStr}_${timeSlot}`;
    const nextChecks = { ...med.checks, [key]: !med.checks[key] };
    try {
      await updateDoc(doc(db, 'circles', circleId, 'medications', medId), { checks: nextChecks });
      if (nextChecks[key]) {
        addPost(`Ha preso la dose delle ore ${timeSlot}.`, 'pill', true);
      }
    } catch (error: any) {
      handleFirestoreError(error, OperationType.UPDATE, `circles/${circleId}/medications/${medId}`);
    }
  };

  const addDocument = async (docData: Omit<CareDocument, 'id' | 'createdAt'>) => {
    if (!circleId || !auth.currentUser) return;
    const path = `circles/${circleId}/documents`;
    try {
      await addDoc(collection(db, 'circles', circleId, 'documents'), {
        ...docData,
        createdAt: serverTimestamp(),
        circleId,
        createdBy: auth.currentUser.uid
      });
    } catch (error: any) {
      handleFirestoreError(error, OperationType.CREATE, path);
    }
  };

  const addMember = async (name: string, role: string) => {
    showToast("Usa il codice invito per aggiungere nuovi membri.", "info");
  };

  const removeMember = async (id: string) => {
    if (!circleId) return;
    try {
      await deleteDoc(doc(db, 'circles', circleId, 'members', id));
    } catch (error: any) {
      handleFirestoreError(error, OperationType.DELETE, `circles/${circleId}/members/${id}`);
    }
  };

  const updateMeal = async (id: string, lunch: MealItem, dinner: MealItem) => {
    if (!circleId) return;
    try {
      await setDoc(doc(db, 'circles', circleId, 'meals', id), { lunch, dinner }, { merge: true });
    } catch (error: any) {
      handleFirestoreError(error, OperationType.UPDATE, `circles/${circleId}/meals/${id}`);
    }
  };

  const updateDietaryNotes = async (notes: string) => {
    if (!circleId || !auth.currentUser) return;
    try {
      await setDoc(doc(db, 'circles', circleId, 'dietary_notes', 'notes'), { 
        notes,
        circleId,
        createdBy: auth.currentUser.uid
      });
    } catch (error: any) {
      handleFirestoreError(error, OperationType.WRITE, `circles/${circleId}/dietary_notes/notes`);
    }
  };

  return (
    <AppContext.Provider
      value={{
        profile, currentView, setCurrentView, members, posts, events, medications, documents, meals, dietaryNotes,
        activeTab, setActiveTab, toasts, showToast, createCircle, joinCircle, logoutCircle, updateProfile,
        addPost, addEvent, toggleEventStatus, addMedication, toggleMedicationDose, addDocument, addMember,
        removeMember, updateMeal, updateDietaryNotes, isSidebarOpen, setIsSidebarOpen, theme, toggleTheme,
        loading, circleId, registerPushToken
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
