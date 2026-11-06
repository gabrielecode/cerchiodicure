/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { LandingPage } from './components/LandingPage';
import { Login } from './components/Login';
import { Sidebar } from './components/Sidebar';
import { BottomNav } from './components/BottomNav';
import { ToastContainer } from './components/Toast';
import { InstallBanner } from './components/InstallBanner';
import { TimelineTab } from './components/TimelineTab';
import { CalendarTab } from './components/CalendarTab';
import { MedicationsTab } from './components/MedicationsTab';
import { DocumentsTab } from './components/DocumentsTab';
import { GuidaTab } from './components/GuidaTab';
import { MealsTab } from './components/MealsTab';
import { HeartHandshake } from 'lucide-react';

const MainContent: React.FC = () => {
  const { profile, currentView, activeTab, setActiveTab, isSidebarOpen, setIsSidebarOpen, logoutCircle } = useApp();

  if (currentView === 'landing') {
    return <LandingPage />;
  }

  if (currentView === 'login') {
    return <Login />;
  }

  if (!profile || !profile.isOnboarded) {
    return <Login />;
  }

  return (
    <div className="w-full min-h-screen bg-[#E8F0FE] flex flex-col relative overflow-x-hidden">
      <InstallBanner />
      
      {/* Mobile Header with Hamburger Menu and Dropdown */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-100 px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 -ml-2 text-slate-600 hover:bg-slate-50 rounded-xl transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#7BA88A]/20 text-[#7BA88A] flex items-center justify-center">
              <HeartHandshake className="w-4 h-4" />
            </div>
            <span className="font-bold text-slate-800 text-sm">Cerchio</span>
          </div>
        </div>
        
        <div className="relative group">
          <button 
            className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-slate-100 transition-all"
          >
            <span className="w-7 h-7 rounded-lg bg-white shadow-2xs flex items-center justify-center text-sm">
              {profile?.userName?.charAt(0) || 'U'}
            </span>
            <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          {/* Menu a tendina (Dropdown) */}
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 hidden group-focus-within:block animate-in fade-in zoom-in duration-200">
            <div className="px-4 py-2 border-b border-slate-50 mb-1">
              <p className="text-xs font-bold text-slate-800">{profile?.userName}</p>
              <p className="text-[10px] text-slate-500">{profile?.userRole}</p>
            </div>
            <button 
              onClick={() => setActiveTab('timeline')}
              className="w-full text-left px-4 py-2 text-xs text-slate-600 hover:bg-slate-50 hover:text-[#7BA88A] transition-colors"
            >
              Il mio profilo
            </button>
            <button 
              onClick={() => logoutCircle()}
              className="w-full text-left px-4 py-2 text-xs text-red-600 hover:bg-red-50 transition-colors"
            >
              Esci dal Cerchio
            </button>
          </div>
        </div>
      </header>

      <Sidebar />

      {/* Main Content Area (with left margin on desktop to accommodate fixed sidebar) */}
      <div className="flex-1 flex flex-col md:ml-64 min-h-screen pt-16 md:pt-0 pb-24 md:pb-8">
        <main className="flex-1 w-full">
          {activeTab === 'timeline' && <TimelineTab />}
          {activeTab === 'calendario' && <CalendarTab />}
          {activeTab === 'farmaci' && <MedicationsTab />}
          {activeTab === 'pasti' && <MealsTab />}
          {activeTab === 'documenti' && <DocumentsTab />}
          {activeTab === 'guida' && <GuidaTab />}
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
      <div className="w-full min-h-screen bg-[#E8F0FE] flex flex-col relative font-sans">
        <ToastContainer />
        <MainContent />
      </div>
    </AppProvider>
  );
}
