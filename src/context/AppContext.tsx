import React, { createContext, useContext, useState, useEffect } from 'react';
import { Post, CareEvent, Medication, CareDocument, Member, Profile, PostType, MealPlan, MealItem } from '../types';

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
  createCircle: (recipientName: string, userName: string, userRole: string) => void;
  joinCircle: (code: string, userName: string, userRole: string) => boolean;
  logoutCircle: () => void;
  updateProfile: (recipientName: string) => void;
  addPost: (text: string, type: PostType, completed?: boolean, imageUrl?: string) => void;
  addEvent: (event: Omit<CareEvent, 'id'>) => void;
  toggleEventStatus: (eventId: string) => void;
  addMedication: (med: Omit<Medication, 'id' | 'checks'>) => void;
  toggleMedicationDose: (medId: string, timeSlot: string, dateStr?: string) => void;
  addDocument: (doc: Omit<CareDocument, 'id'>) => void;
  addMember: (name: string, role: string) => void;
  removeMember: (id: string) => void;
  updateMeal: (id: string, lunch: MealItem, dinner: MealItem) => void;
  updateDietaryNotes: (notes: string) => void;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const INITIAL_PROFILE: Profile = {
  recipientName: 'Nonna Rosa',
  userName: 'Marco',
  userRole: 'Figlio',
  inviteCode: 'ROSA42',
  isOnboarded: false,
};

const INITIAL_MEMBERS: Member[] = [
  { id: '1', name: 'Marco', role: 'Figlio', avatar: 'MA', online: true },
  { id: '2', name: 'Giulia', role: 'Figlia', avatar: 'GI', online: true },
  { id: '3', name: 'Ana', role: 'Badante', avatar: 'AN', online: true },
];

const INITIAL_POSTS: Post[] = [
  {
    id: 'p1',
    authorName: 'Marco',
    authorAvatar: 'MA',
    timestamp: '2 ore fa',
    type: 'pill',
    text: 'Ho dato la pastiglia delle 8 regolarmente.',
    completed: true,
  },
  {
    id: 'p2',
    authorName: 'Giulia',
    authorAvatar: 'GI',
    timestamp: 'Ieri alle 16:30',
    type: 'calendar',
    text: 'Promemoria: Visita dal cardiologo confermata per mercoledì alle 10:00.',
    completed: true,
  },
  {
    id: 'p3',
    authorName: 'Marco',
    authorAvatar: 'MA',
    timestamp: 'Ieri alle 13:15',
    type: 'food',
    text: 'Ha mangiato poco a pranzo, solo un po di passato di verdura.',
  },
  {
    id: 'p4',
    authorName: 'Ana',
    authorAvatar: 'AN',
    timestamp: '3 giorni fa',
    type: 'photo',
    text: 'Passeggiata nel giardino di casa con il sole splendido.',
    imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'p5',
    authorName: 'Giulia',
    authorAvatar: 'GI',
    timestamp: '4 giorni fa',
    type: 'note',
    text: 'La consegna della spesa a domicilio è arrivata puntuale.',
  },
  {
    id: 'p6',
    authorName: 'Ana',
    authorAvatar: 'AN',
    timestamp: '5 giorni fa',
    type: 'note',
    text: 'Misurata pressione: 130/80, tutto stabile.',
  },
];

// Get today formatted as YYYY-MM-DD
const getTodayStr = () => {
  const d = new Date();
  return d.toISOString().split('T')[0];
};

const INITIAL_EVENTS: CareEvent[] = [
  {
    id: 'e1',
    title: 'Turno pomeriggio e compagnia',
    date: getTodayStr(),
    time: '15:00',
    memberName: 'Marco',
    memberAvatar: 'MA',
    type: 'turno',
    status: 'completato',
  },
  {
    id: 'e2',
    title: 'Visita Cardiologo Dr. Rossi',
    date: getTodayStr(),
    time: '10:00',
    memberName: 'Giulia',
    memberAvatar: 'GI',
    type: 'appuntamento',
    status: 'attesa',
  },
  {
    id: 'e3',
    title: 'Fisioterapia a domicilio',
    date: getTodayStr(),
    time: '09:00',
    memberName: 'Ana',
    memberAvatar: 'AN',
    type: 'appuntamento',
    status: 'completato',
  },
  {
    id: 'e4',
    title: 'Spesa settimanale e farmacia',
    date: getTodayStr(),
    time: '14:30',
    memberName: 'Marco',
    memberAvatar: 'MA',
    type: 'turno',
    status: 'attesa',
  },
  {
    id: 'e5',
    title: 'Pranzo domenicale in famiglia',
    date: getTodayStr(),
    time: '12:00',
    memberName: 'Giulia',
    memberAvatar: 'GI',
    type: 'appuntamento',
    status: 'attesa',
  },
];

const INITIAL_MEDICATIONS: Medication[] = [
  {
    id: 'm1',
    name: 'Cardioaspirin',
    dosage: '100mg',
    times: ['08:00'],
    responsible: 'Marco',
    checks: {
      [`${getTodayStr()}_08:00`]: true,
    },
  },
  {
    id: 'm2',
    name: 'Metformina',
    dosage: '500mg',
    times: ['08:00', '20:00'],
    responsible: 'Giulia',
    checks: {},
  },
  {
    id: 'm3',
    name: 'Vitamina D',
    dosage: '1 compressa',
    times: ['12:00'],
    responsible: 'Ana',
    checks: {},
  },
];

const INITIAL_DOCUMENTS: CareDocument[] = [
  {
    id: 'd1',
    title: 'Prescrizione cardiologo novembre',
    date: '02.11.2026',
    author: 'Giulia',
    fileSize: '1.2 MB',
    fileType: 'PDF',
  },
  {
    id: 'd2',
    title: 'Referto analisi del sangue',
    date: '28.10.2026',
    author: 'Marco',
    fileSize: '2.4 MB',
    fileType: 'PDF',
  },
  {
    id: 'd3',
    title: 'Lettera e piano Spitex Ticino',
    date: '15.10.2026',
    author: 'Ana',
    fileSize: '850 KB',
    fileType: 'PDF',
  },
];

const INITIAL_DIETARY_NOTES = `• Diabete tipo 2: Limitare zuccheri raffinati e dolci.
• Dieta iposodica: Usare poco sale nelle preparazioni.
• Consistenza: Preferire piatti morbidi o passati di verdura a cena.
• Preferenze: Adora il minestrone ticinese, la polenta morbida e il pesce bollito. Evitare cibi troppo fritti o pesanti la sera.`;

const INITIAL_MEALS: MealPlan[] = [
  {
    id: 'm-lun',
    day: 'Lunedì',
    lunch: { dish: 'Minestrone di verdure fresche e petto di tacchino ai ferri', provider: 'Ana (Badante)', status: 'consumato' },
    dinner: { dish: 'Passato di zucca con crostini e formaggini magri', provider: 'Marco', status: 'pianificato' },
  },
  {
    id: 'm-mar',
    day: 'Martedì',
    lunch: { dish: 'Risotto al tiglio con filetti di persico del lago', provider: 'Spitex / P. Senectute', status: 'pianificato' },
    dinner: { dish: 'Lessoe verdure bollite con olio d’oliva', provider: 'Giulia', status: 'pianificato' },
  },
  {
    id: 'm-mer',
    day: 'Mercoledì',
    lunch: { dish: 'Pasta asciutta con pomodoro fresco e basilico', provider: 'Ana (Badante)', status: 'pianificato' },
    dinner: { dish: 'Vellutata di zucchine e ricotta di capra', provider: 'Marco', status: 'pianificato' },
  },
  {
    id: 'm-gio',
    day: 'Giovedì',
    lunch: { dish: 'Polenta morbida con spezzatino di vitello tenero', provider: 'Spitex / P. Senectute', status: 'pianificato' },
    dinner: { dish: 'Merluzzo al vapore con patate lesse', provider: 'Giulia', status: 'pianificato' },
  },
  {
    id: 'm-ven',
    day: 'Venerdì',
    lunch: { dish: 'Minestra di legumi e verdure di stagione', provider: 'Ana (Badante)', status: 'pianificato' },
    dinner: { dish: 'Frittata morbida alle erbe fini con insalata tenera', provider: 'Marco', status: 'pianificato' },
  },
  {
    id: 'm-sab',
    day: 'Sabato',
    lunch: { dish: 'Risotto ai funghi porcini e filetto di branzino', provider: 'Giulia', status: 'pianificato' },
    dinner: { dish: 'Minestrina in brodo di carne magra', provider: 'Ana (Badante)', status: 'pianificato' },
  },
  {
    id: 'm-dom',
    day: 'Domenica',
    lunch: { dish: 'Pranzo domenicale in famiglia: Arrosto morbido con contorno', provider: 'Famiglia', status: 'pianificato' },
    dinner: { dish: 'Zuppa di verdure leggere e frutta cotta', provider: 'Ana (Badante)', status: 'pianificato' },
  },
];

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<Profile | null>(() => {
    const saved = localStorage.getItem('ccc_profile');
    return saved ? JSON.parse(saved) : null;
  });

  const [currentView, setCurrentView] = useState<'landing' | 'login' | 'app'>(() => {
    const savedView = localStorage.getItem('ccc_view') as 'landing' | 'login' | 'app';
    if (savedView) return savedView;
    const savedProfile = localStorage.getItem('ccc_profile');
    return savedProfile ? 'app' : 'landing';
  });

  const [members, setMembers] = useState<Member[]>(() => {
    const saved = localStorage.getItem('ccc_members');
    return saved ? JSON.parse(saved) : INITIAL_MEMBERS;
  });

  const [posts, setPosts] = useState<Post[]>(() => {
    const saved = localStorage.getItem('ccc_posts');
    return saved ? JSON.parse(saved) : INITIAL_POSTS;
  });

  const [events, setEvents] = useState<CareEvent[]>(() => {
    const saved = localStorage.getItem('ccc_events');
    return saved ? JSON.parse(saved) : INITIAL_EVENTS;
  });

  const [medications, setMedications] = useState<Medication[]>(() => {
    const saved = localStorage.getItem('ccc_medications');
    return saved ? JSON.parse(saved) : INITIAL_MEDICATIONS;
  });

  const [documents, setDocuments] = useState<CareDocument[]>(() => {
    const saved = localStorage.getItem('ccc_documents');
    return saved ? JSON.parse(saved) : INITIAL_DOCUMENTS;
  });

  const [meals, setMeals] = useState<MealPlan[]>(() => {
    const saved = localStorage.getItem('ccc_meals');
    return saved ? JSON.parse(saved) : INITIAL_MEALS;
  });

  const [dietaryNotes, setDietaryNotes] = useState<string>(() => {
    const saved = localStorage.getItem('ccc_dietary');
    return saved ? saved : INITIAL_DIETARY_NOTES;
  });

  const [activeTab, setActiveTab] = useState<string>('timeline');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('ccc_theme') as 'light' | 'dark';
    if (saved) return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    if (profile) {
      localStorage.setItem('ccc_profile', JSON.stringify(profile));
    } else {
      localStorage.removeItem('ccc_profile');
    }
  }, [profile]);

  useEffect(() => {
    localStorage.setItem('ccc_view', currentView);
  }, [currentView]);

  useEffect(() => {
    localStorage.setItem('ccc_members', JSON.stringify(members));
  }, [members]);

  useEffect(() => {
    localStorage.setItem('ccc_posts', JSON.stringify(posts));
  }, [posts]);

  useEffect(() => {
    localStorage.setItem('ccc_events', JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem('ccc_medications', JSON.stringify(medications));
  }, [medications]);

  useEffect(() => {
    localStorage.setItem('ccc_documents', JSON.stringify(documents));
  }, [documents]);

  useEffect(() => {
    localStorage.setItem('ccc_meals', JSON.stringify(meals));
  }, [meals]);

  useEffect(() => {
    localStorage.setItem('ccc_dietary', dietaryNotes);
  }, [dietaryNotes]);

  useEffect(() => {
    localStorage.setItem('ccc_theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Medication Push Notification Watcher (mocked with toasts)
  useEffect(() => {
    const checkMedicationTimes = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const currentTimeStr = `${hours}:${minutes}`;
      const todayStr = now.toISOString().split('T')[0];

      medications.forEach((med) => {
        med.times.forEach((slot) => {
          if (slot === currentTimeStr) {
            const key = `${todayStr}_${slot}`;
            const isTaken = !!med.checks[key];
            const notificationKey = `ccc_notified_${med.id}_${key}`;

            if (!isTaken && !localStorage.getItem(notificationKey)) {
              localStorage.setItem(notificationKey, 'true');
              showToast(
                `⏰ NOTIFICA PUSH TERAPIA: È l'ora di somministrare ${med.name} (${med.dosage}) a ${profile?.recipientName || 'Nonna Rosa'}! (Responsabile: ${med.responsible})`,
                'info'
              );
            }
          }
        });
      });
    };

    const interval = setInterval(checkMedicationTimes, 20000);
    return () => clearInterval(interval);
  }, [medications, profile]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const showToast = (message: string, type: 'success' | 'info' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  const createCircle = (recipientName: string, userName: string, userRole: string) => {
    const newProfile: Profile = {
      recipientName,
      userName,
      userRole,
      inviteCode: 'ROSA' + Math.floor(10 + Math.random() * 90),
      isOnboarded: true,
    };
    setProfile(newProfile);
    setCurrentView('app');
    // Ensure current user is in members
    if (!members.some((m) => m.name.toLowerCase() === userName.toLowerCase())) {
      setMembers((prev) => [
        { id: Date.now().toString(), name: userName, role: userRole, avatar: userName.substring(0, 2).toUpperCase(), online: true },
        ...prev,
      ]);
    }
    showToast(`Cerchio per ${recipientName} creato con successo!`);
  };

  const joinCircle = (code: string, userName: string, userRole: string): boolean => {
    if (!code || code.trim().length < 4) {
      showToast('Codice invito non valido', 'info');
      return false;
    }
    const newProfile: Profile = {
      recipientName: 'Nonna Rosa',
      userName,
      userRole,
      inviteCode: code.toUpperCase(),
      isOnboarded: true,
    };
    setProfile(newProfile);
    setCurrentView('app');
    if (!members.some((m) => m.name.toLowerCase() === userName.toLowerCase())) {
      setMembers((prev) => [
        { id: Date.now().toString(), name: userName, role: userRole, avatar: '👤', online: true },
        ...prev,
      ]);
    }
    showToast(`Ti sei unito al cerchio con successo!`);
    return true;
  };

  const logoutCircle = () => {
    setProfile(null);
    localStorage.removeItem('ccc_profile');
    localStorage.removeItem('ccc_view');
    setCurrentView('landing');
    showToast('Uscito dal cerchio', 'info');
  };

  const updateProfile = (recipientName: string) => {
    if (profile) {
      setProfile({ ...profile, recipientName });
      showToast('Nome del caro aggiornato');
    }
  };

  const addPost = (text: string, type: PostType, completed?: boolean, imageUrl?: string) => {
    const author = profile?.userName || 'Marco';
    const memberObj = members.find((m) => m.name.toLowerCase() === author.toLowerCase());
    const newPost: Post = {
      id: Date.now().toString(),
      authorName: author,
      authorAvatar: memberObj?.avatar || '👤',
      timestamp: 'Proprio ora',
      type,
      text,
      completed,
      imageUrl,
    };
    setPosts([newPost, ...posts]);
    showToast('Aggiornamento pubblicato nella Timeline');
  };

  const addEvent = (eventData: Omit<CareEvent, 'id'>) => {
    const newEvent: CareEvent = {
      ...eventData,
      id: Date.now().toString(),
    };
    setEvents([newEvent, ...events]);
    showToast('Nuovo evento aggiunto al calendario');
  };

  const toggleEventStatus = (eventId: string) => {
    setEvents(
      events.map((ev) => {
        if (ev.id === eventId) {
          const nextStatus = ev.status === 'completato' ? 'attesa' : 'completato';
          showToast(`Evento segnato come ${nextStatus}`);
          return { ...ev, status: nextStatus };
        }
        return ev;
      })
    );
  };

  const addMedication = (medData: Omit<Medication, 'id' | 'checks'>) => {
    const newMed: Medication = {
      ...medData,
      id: Date.now().toString(),
      checks: {},
    };
    setMedications([...medications, newMed]);
    showToast('Farmaco aggiunto con successo');
  };

  const toggleMedicationDose = (medId: string, timeSlot: string, dateStr: string = getTodayStr()) => {
    const key = `${dateStr}_${timeSlot}`;
    const med = medications.find((m) => m.id === medId);
    if (!med) return;

    const currentVal = !!med.checks[key];
    const nextVal = !currentVal;

    setMedications(
      medications.map((m) => {
        if (m.id === medId) {
          return {
            ...m,
            checks: {
              ...m.checks,
              [key]: nextVal,
            },
          };
        }
        return m;
      })
    );

    const userName = profile?.userName || 'Marco';
    if (nextVal) {
      showToast(`Dose ${timeSlot} di ${med.name} registrata da ${userName}`);
      // Also automatically post to Timeline!
      addPost(`Ha preso la dose di ${med.name} (${med.dosage}) delle ore ${timeSlot}.`, 'pill', true);
    } else {
      showToast(`Registrazione ${timeSlot} di ${med.name} rimossa`, 'info');
    }
  };

  const addDocument = (docData: Omit<CareDocument, 'id'>) => {
    const newDoc: CareDocument = {
      ...docData,
      id: Date.now().toString(),
    };
    setDocuments([newDoc, ...documents]);
    showToast('Documento caricato con successo');
  };

  const addMember = (name: string, role: string) => {
    const initials = name.substring(0, 2).toUpperCase();
    const newM: Member = {
      id: Date.now().toString(),
      name,
      role,
      avatar: initials,
      online: true,
    };
    setMembers([...members, newM]);
    showToast(`Membro ${name} aggiunto al cerchio`);
  };

  const removeMember = (id: string) => {
    const m = members.find((item) => item.id === id);
    setMembers(members.filter((item) => item.id !== id));
    showToast(`Membro ${m?.name || ''} rimosso dal cerchio`, 'info');
  };

  const updateMeal = (id: string, lunch: MealItem, dinner: MealItem) => {
    setMeals(
      meals.map((m) => {
        if (m.id === id) {
          return { ...m, lunch, dinner };
        }
        return m;
      })
    );
    showToast('Piano pasti aggiornato');
  };

  const updateDietaryNotes = (notes: string) => {
    setDietaryNotes(notes);
    showToast('Restrizioni e preferenze alimentari aggiornate');
  };

  return (
    <AppContext.Provider
      value={{
        profile,
        currentView,
        setCurrentView,
        members,
        posts,
        events,
        medications,
        documents,
        meals,
        dietaryNotes,
        activeTab,
        setActiveTab,
        toasts,
        showToast,
        createCircle,
        joinCircle,
        logoutCircle,
        updateProfile,
        addPost,
        addEvent,
        toggleEventStatus,
        addMedication,
        toggleMedicationDose,
        addDocument,
        addMember,
        removeMember,
        updateMeal,
        updateDietaryNotes,
        isSidebarOpen,
        setIsSidebarOpen,
        theme,
        toggleTheme,
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
