import React, { createContext, useContext, useState, useEffect, useLayoutEffect, useCallback } from 'react';
import { Post, CareEvent, Medication, CareDocument, Member, Profile, PostType, MealPlan, MealItem } from '../types';
import { supabase } from '../lib/supabase';
import { auth as fbAuth, db as fbDb } from '../lib/firebase';
import { signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

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

  const fetchData = useCallback(async (cid: string) => {
    setLoading(true);
    try {
      const [
        { data: mData },
        { data: pData },
        { data: eData },
        { data: medData },
        { data: dData },
        { data: mealsData },
        { data: dietData }
      ] = await Promise.all([
        supabase.from('circle_members').select('*').eq('circle_id', cid),
        supabase.from('posts').select('*').eq('circle_id', cid).order('timestamp', { ascending: false }),
        supabase.from('events').select('*').eq('circle_id', cid).order('date', { ascending: true }),
        supabase.from('medications').select('*').eq('circle_id', cid),
        supabase.from('documents').select('*').eq('circle_id', cid).order('date', { ascending: false }),
        supabase.from('meals').select('*').eq('circle_id', cid),
        supabase.from('dietary_notes').select('notes').eq('circle_id', cid).maybeSingle()
      ]);

      if (mData) setMembers(mData.map(m => ({ id: m.user_id, name: m.display_name, role: m.role, avatar: m.display_name.substring(0,2).toUpperCase(), online: true })));
      if (pData) setPosts(pData.map(p => ({ ...p, timestamp: new Date(p.timestamp).toLocaleString() })));
      if (eData) setEvents(eData);
      if (medData) setMedications(medData);
      if (dData) setDocuments(dData);
      if (mealsData) setMeals(mealsData);
      if (dietData) setDietaryNotes(dietData.notes);
    } catch (err: any) {
      showToast('Errore nel caricamento dei dati: ' + err.message, 'info');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  const migrateLocalStorage = useCallback(async (cid: string) => {
    const keys = ['ccc_posts', 'ccc_events', 'ccc_medications', 'ccc_documents', 'ccc_meals', 'ccc_dietary'];
    const hasData = keys.some(k => localStorage.getItem(k));
    
    if (hasData && window.confirm("Abbiamo trovato dati salvati localmente. Vuoi importarli in questo Cerchio?")) {
      try {
        const posts = JSON.parse(localStorage.getItem('ccc_posts') || '[]');
        const events = JSON.parse(localStorage.getItem('ccc_events') || '[]');
        const medications = JSON.parse(localStorage.getItem('ccc_medications') || '[]');
        const documents = JSON.parse(localStorage.getItem('ccc_documents') || '[]');
        const meals = JSON.parse(localStorage.getItem('ccc_meals') || '[]');
        const dietary = localStorage.getItem('ccc_dietary') || "";

        const { data: { user } } = await supabase.auth.getUser();

        if (posts.length > 0) {
          await supabase.from('posts').insert(posts.map((p: any) => ({
            circle_id: cid,
            created_by: user?.id,
            author_name: p.authorName,
            author_avatar: p.authorAvatar,
            type: p.type,
            text: p.text,
            completed: p.completed,
            image_url: p.imageUrl
          })));
        }

        if (events.length > 0) {
          await supabase.from('events').insert(events.map((e: any) => ({
            circle_id: cid,
            created_by: user?.id,
            title: e.title,
            date: e.date,
            time: e.time,
            member_name: e.memberName,
            member_avatar: e.memberAvatar,
            type: e.type,
            status: e.status,
            notes: e.notes
          })));
        }

        if (medications.length > 0) {
          await supabase.from('medications').insert(medications.map((m: any) => ({
            circle_id: cid,
            created_by: user?.id,
            name: m.name,
            dosage: m.dosage,
            times: m.times,
            responsible: m.responsible,
            checks: m.checks
          })));
        }

        if (documents.length > 0) {
          await supabase.from('documents').insert(documents.map((d: any) => ({
            circle_id: cid,
            created_by: user?.id,
            title: d.title,
            date: d.date,
            author: d.author,
            file_size: d.fileSize,
            file_type: d.fileType
          })));
        }

        if (meals.length > 0) {
          await supabase.from('meals').insert(meals.map((m: any) => ({
            circle_id: cid,
            created_by: user?.id,
            day: m.day,
            lunch: m.lunch,
            dinner: m.dinner
          })));
        }

        if (dietary) {
          await supabase.from('dietary_notes').upsert({ circle_id: cid, notes: dietary, created_by: user?.id });
        }

        keys.forEach(k => localStorage.removeItem(k));
        showToast("Migrazione completata con successo!");
        fetchData(cid);
      } catch (err: any) {
        showToast("Errore durante la migrazione: " + err.message, "info");
      }
    }
  }, [fetchData, showToast]);

  useEffect(() => {
    const checkMembership = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setLoading(false);
        return;
      }

      const { data: membership, error } = await supabase
        .from('circle_members')
        .select('circle_id, display_name, role, circles(recipient_name, invite_code)')
        .eq('user_id', session.user.id)
        .maybeSingle();

      if (membership && !error) {
        const circleData = membership.circles as any;
        setCircleId(membership.circle_id);
        setProfile({
          recipientName: circleData.recipient_name,
          userName: membership.display_name,
          userRole: membership.role,
          inviteCode: circleData.invite_code,
          isOnboarded: true
        });
        setCurrentView('app');
        fetchData(membership.circle_id);
        migrateLocalStorage(membership.circle_id);
      } else {
        setLoading(false);
        if (currentView !== 'login') setCurrentView('login');
      }
    };

    checkMembership();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN') {
        checkMembership();
      } else if (event === 'SIGNED_OUT') {
        setProfile(null);
        setCircleId(null);
        setCurrentView('landing');
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, [fetchData, migrateLocalStorage]);

  // Firebase Auth sync and token registration helper
  useEffect(() => {
    const unsub = onAuthStateChanged(fbAuth, (fbUser) => {
      if (!fbUser && currentView === 'app') {
        signInAnonymously(fbAuth).catch(err => console.error("Firebase auth error:", err));
      }
    });
    return () => unsub();
  }, [currentView]);

  const registerPushToken = async (token: string) => {
    const fbUser = fbAuth.currentUser;
    if (!fbUser) {
      await signInAnonymously(fbAuth);
    }
    
    const user = (await supabase.auth.getUser()).data.user;
    if (!user) return;

    try {
      await setDoc(doc(fbDb, 'push_tokens', user.id), {
        userId: user.id,
        token: token,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      }, { merge: true });
      showToast("Notifiche attivate con successo!");
    } catch (err: any) {
      console.error("Error saving push token:", err);
      showToast("Errore nell'attivazione delle notifiche.", "info");
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
    await supabase.auth.signOut();
  };

  const createCircle = async (recipientName: string, userName: string, userRole: string) => {
    try {
      const inviteCode = Math.random().toString(36).substring(2, 8).toUpperCase();
      const { data: circle, error: circleError } = await supabase.from('circles').insert([{ recipient_name: recipientName, invite_code: inviteCode }]).select().single();
      if (circleError) throw circleError;
      const { error: memberError } = await supabase.from('circle_members').insert([{ circle_id: circle.id, user_id: (await supabase.auth.getUser()).data.user?.id, display_name: userName, role: userRole }]);
      if (memberError) throw memberError;
      
      setCircleId(circle.id);
      setProfile({ recipientName, userName, userRole, inviteCode, isOnboarded: true });
      setCurrentView('app');
      showToast(`Cerchio creato con successo!`);
      fetchData(circle.id);
    } catch (error: any) {
      showToast(error.message, 'info');
    }
  };

  const joinCircle = async (code: string, userName: string, userRole: string): Promise<boolean> => {
    try {
      const { error: rpcError } = await supabase.rpc('join_circle', { code: code.toUpperCase(), display_name: userName, user_role: userRole });
      if (rpcError) throw rpcError;
      const { data: circle, error: circleError } = await supabase.from('circles').select('id, recipient_name, invite_code').eq('invite_code', code.toUpperCase()).single();
      if (circleError) throw circleError;

      setCircleId(circle.id);
      setProfile({ recipientName: circle.recipient_name, userName, userRole, inviteCode: circle.invite_code, isOnboarded: true });
      setCurrentView('app');
      showToast(`Ti sei unito al cerchio!`);
      fetchData(circle.id);
      return true;
    } catch (error: any) {
      showToast(error.message || 'Errore durante l\'accesso', 'info');
      return false;
    }
  };

  const updateProfile = async (recipientName: string) => {
    if (!circleId) return;
    const { error } = await supabase.from('circles').update({ recipient_name: recipientName }).eq('id', circleId);
    if (error) showToast(error.message, 'info');
    else {
      setProfile(p => p ? { ...p, recipientName } : null);
      showToast('Profilo aggiornato');
    }
  };

  const addPost = async (text: string, type: PostType, completed?: boolean, imageUrl?: string) => {
    if (!circleId) return;
    const { error } = await supabase.from('posts').insert([{ 
      circle_id: circleId, 
      author_name: profile?.userName, 
      type, text, completed, image_url: imageUrl 
    }]);
    if (error) showToast(error.message, 'info');
    else fetchData(circleId);
  };

  const addEvent = async (eventData: Omit<CareEvent, 'id'>) => {
    if (!circleId) return;
    const { error } = await supabase.from('events').insert([{ ...eventData, circle_id: circleId }]);
    if (error) showToast(error.message, 'info');
    else fetchData(circleId);
  };

  const toggleEventStatus = async (eventId: string) => {
    if (!circleId) return;
    const event = events.find(e => e.id === eventId);
    if (!event) return;
    const nextStatus = event.status === 'completato' ? 'attesa' : 'completato';
    const { error } = await supabase.from('events').update({ status: nextStatus }).eq('id', eventId);
    if (error) showToast(error.message, 'info');
    else fetchData(circleId);
  };

  const addMedication = async (medData: Omit<Medication, 'id' | 'checks'>) => {
    if (!circleId) return;
    const { error } = await supabase.from('medications').insert([{ ...medData, circle_id: circleId }]);
    if (error) showToast(error.message, 'info');
    else fetchData(circleId);
  };

  const toggleMedicationDose = async (medId: string, timeSlot: string, dateStr: string = new Date().toISOString().split('T')[0]) => {
    if (!circleId) return;
    const med = medications.find(m => m.id === medId);
    if (!med) return;
    const key = `${dateStr}_${timeSlot}`;
    const nextChecks = { ...med.checks, [key]: !med.checks[key] };
    const { error } = await supabase.from('medications').update({ checks: nextChecks }).eq('id', medId);
    if (error) showToast(error.message, 'info');
    else {
      if (nextChecks[key]) addPost(`Ha preso la dose delle ore ${timeSlot}.`, 'pill', true);
      fetchData(circleId);
    }
  };

  const addDocument = async (docData: Omit<CareDocument, 'id'>) => {
    if (!circleId) return;
    const { error } = await supabase.from('documents').insert([{ ...docData, circle_id: circleId }]);
    if (error) showToast(error.message, 'info');
    else fetchData(circleId);
  };

  const addMember = async (name: string, role: string) => {
    showToast("Usa il codice invito per aggiungere nuovi membri.", "info");
  };

  const removeMember = async (id: string) => {
    if (!circleId) return;
    const { error } = await supabase.from('circle_members').delete().eq('circle_id', circleId).eq('user_id', id);
    if (error) showToast(error.message, 'info');
    else fetchData(circleId);
  };

  const updateMeal = async (id: string, lunch: MealItem, dinner: MealItem) => {
    if (!circleId) return;
    const { error } = await supabase.from('meals').update({ lunch, dinner }).eq('id', id);
    if (error) showToast(error.message, 'info');
    else fetchData(circleId);
  };

  const updateDietaryNotes = async (notes: string) => {
    if (!circleId) return;
    const { error } = await supabase.from('dietary_notes').upsert({ circle_id: circleId, notes });
    if (error) showToast(error.message, 'info');
    else fetchData(circleId);
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
