/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { lazy, Suspense } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { LandingPage } from './components/LandingPage';
import { Login } from './components/Login';
import { Sidebar } from './components/Sidebar';
import { BottomNav } from './components/BottomNav';
import { ToastContainer } from './components/Toast';
import { InstallBanner } from './components/InstallBanner';
import { HeartHandshake, Sun, Moon, Loader2 } from 'lucide-react';
import { useAuth } from './context/AuthContext';
import { PrivacyPolicy } from './components/PrivacyPolicy';

const TimelineTab = lazy(() => import('./components/TimelineTab').then(m => ({ default: m.TimelineTab })));
const CalendarTab = lazy(() => import('./components/CalendarTab').then(m => ({ default: m.CalendarTab })));
const MedicationsTab = lazy(() => import('./components/MedicationsTab').then(m => ({ default: m.MedicationsTab })));
const MealsTab = lazy(() => import('./components/MealsTab').then(m => ({ default: m.MealsTab })));
const DocumentsTab = lazy(() => import('./components/DocumentsTab').then(m => ({ default: m.DocumentsTab })));
const GuidaTab = lazy(() => import('./components/GuidaTab').then(m => ({ default: m.GuidaTab })));
const ChatTab = lazy(() => import('./components/ChatTab').then(m => ({ default: m.ChatTab })));

const MainContent: React.FC = () => {
  const { 
    profile, 
    currentView, 
    activeTab, 
    setActiveTab, 
    isSidebarOpen, 
    setIsSidebarOpen, 
    logoutCircle,
    theme,
    toggleTheme,
    loading: appLoading
  } = useApp();

  const { session, loading: authLoading } = useAuth();

  if (authLoading || appLoading) {
    return <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
      <div className="animate-pulse flex flex-col items-center gap-4">
        <HeartHandshake className="w-12 h-12 text-emerald-700 opacity-20" />
        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Certificazione Sessione...</span>
      </div>
    </div>;
  }

  if (currentView === 'privacy') {
    return <PrivacyPolicy />;
  }

  if (currentView === 'landing') {
    return <LandingPage />;
  }

  if (currentView === 'login' || !session) {
    return <Login />;
  }

  if (!profile || !profile.isOnboarded) {
    return <Login />;
  }

  return (
    <div className="flex-1 flex flex-col relative overflow-x-hidden">
      <InstallBanner />
      
      {/* Mobile Header with Hamburger Menu and Dropdown */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 -ml-2 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#7BA88A]/20 text-[#7BA88A] flex items-center justify-center">
              <HeartHandshake className="w-4 h-4" />
            </div>
            <span className="font-bold text-slate-800 dark:text-slate-100 text-sm">Cerchio</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={toggleTheme}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors"
            title="Toggle theme"
          >
            {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
          </button>

          <div className="relative group">
          <button 
            className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all"
          >
            <span className="w-7 h-7 rounded-lg bg-white dark:bg-slate-900 shadow-2xs flex items-center justify-center text-sm dark:text-slate-200">
              {profile?.userName?.charAt(0) || 'U'}
            </span>
            <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          {/* Menu a tendina (Dropdown) */}
          <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 py-2 hidden group-focus-within:block animate-in fade-in zoom-in duration-200">
            <div className="px-4 py-2 border-b border-slate-50 dark:border-slate-800 mb-1">
              <p className="text-xs font-bold text-slate-800 dark:text-slate-100">{profile?.userName}</p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">{profile?.userRole}</p>
            </div>
            
            <button 
              onClick={toggleTheme}
              className="w-full text-left px-4 py-2 text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2 transition-colors"
            >
              {theme === 'light' ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5" />}
              <span>{theme === 'light' ? 'Modalità Scura' : 'Modalità Chiara'}</span>
            </button>

            <button 
              onClick={() => setActiveTab('timeline')}
              className="w-full text-left px-4 py-2 text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              Il mio profilo
            </button>
            
            <button 
              onClick={() => logoutCircle()}
              className="w-full text-left px-4 py-2 text-xs text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            >
              Esci dal Cerchio
            </button>
          </div>
        </div>
      </div>
    </header>

      <Sidebar />

      {/* Main Content Area (with left margin on desktop to accommodate fixed sidebar) */}
      <div className="flex-1 flex flex-col md:ml-64 min-h-screen pt-16 md:pt-0 pb-24 md:pb-8">
        <main className="flex-1 w-full">
          <Suspense fallback={
            <div className="flex items-center justify-center min-h-[50vh] p-8">
              <Loader2 className="w-8 h-8 text-emerald-700 animate-spin opacity-50" />
            </div>
          }>
            {activeTab === 'timeline' && <TimelineTab />}
            {activeTab === 'calendario' && <CalendarTab />}
            {activeTab === 'farmaci' && <MedicationsTab />}
            {activeTab === 'pasti' && <MealsTab />}
            {activeTab === 'documenti' && <DocumentsTab />}
            {activeTab === 'guida' && <GuidaTab />}
            {activeTab === 'chat' && <ChatTab />}
          </Suspense>
        </main>
      </div>

      {/* Bottom Navigation Bar (Mobile only) */}
      <BottomNav />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <div className="w-full min-h-screen bg-[#E8F0FE] dark:bg-slate-950 flex flex-col relative font-sans transition-colors duration-300">
        <ToastContainer />
        <MainContent />
      </div>
    </AppProvider>
  );
}
