import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  MessageSquareText, 
  Calendar, 
  Pill, 
  FileText, 
  BookOpen, 
  Settings, 
  LogOut, 
  Users, 
  Activity, 
  AlertTriangle, 
  Utensils,
  ChevronRight,
  ShieldAlert,
  Sun,
  Moon
} from 'lucide-react';
import { SettingsModal } from './SettingsModal';
import { EmergencyModal } from './EmergencyModal';

export const Sidebar: React.FC = () => {
  const { profile, activeTab, setActiveTab, members, logoutCircle, isSidebarOpen, setIsSidebarOpen, theme, toggleTheme } = useApp();
  const [showSettings, setShowSettings] = useState(false);
  const [showEmergency, setShowEmergency] = useState(false);

  const tabs = [
    { id: 'timeline', label: 'Timeline Operativa', icon: Activity },
    { id: 'chat', label: 'Chat di Gruppo', icon: MessageSquareText },
    { id: 'calendario', label: 'Agenda & Visite', icon: Calendar },
    { id: 'farmaci', label: 'Terapia Farmacologica', icon: Pill },
    { id: 'pasti', label: 'Nutrizione & Pasti', icon: Utensils },
    { id: 'documenti', label: 'Archivio Documenti', icon: FileText },
    { id: 'guida', label: 'Guida Territoriale', icon: BookOpen },
  ];

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar / Drawer */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 shadow-2xl md:shadow-none
        transform transition-transform duration-300 ease-in-out flex flex-col
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0 md:w-64 md:z-30
      `}>
        {/* Corporate Header */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-700 text-white flex items-center justify-center shrink-0">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-sm font-black text-slate-900 dark:text-slate-100 tracking-tight leading-none">Cerchio di Cura</h1>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider mt-1">Care Management</p>
            </div>
          </div>
          {/* Mobile Close Button */}
          <button 
            onClick={() => setIsSidebarOpen(false)}
            className="md:hidden p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg"
          >
            <LogOut className="w-5 h-5 rotate-180" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          <div className="px-3 pb-3 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">Navigazione</div>
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setIsSidebarOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-lg text-[13px] font-bold transition-all ${
                  isActive
                    ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-800 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-400 dark:text-slate-500'}`} />
                  <span>{tab.label}</span>
                </div>
                {isActive && <ChevronRight className="w-3 h-3 text-emerald-400" />}
              </button>
            );
          })}

          <div className="pt-8">
            <div className="px-3 pb-3 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 flex items-center justify-between">
              <span>Team Assistenza</span>
              <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700 text-[9px] font-black">{members.length}</span>
            </div>
            <div className="space-y-1 mt-2">
              {members.map((m) => (
                <div key={m.id} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-bold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 hover:border-slate-200 dark:hover:border-slate-600 transition-colors">
                  <div className="w-7 h-7 rounded bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-[10px] font-black text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-600">
                    {m.avatar}
                  </div>
                  <div className="flex-1 truncate">
                    <p className="text-slate-900 dark:text-slate-100 truncate leading-none mb-0.5">{m.name}</p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium truncate">{m.role}</p>
                  </div>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" title="Online" />
                </div>
              ))}
            </div>
          </div>
        </nav>

        {/* Footer Actions in Sidebar */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 space-y-2 bg-slate-50/80 dark:bg-slate-800/80">
          <button
            onClick={() => {
              setShowEmergency(true);
              setIsSidebarOpen(false);
            }}
            className="w-full flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-lg text-xs font-black text-white bg-red-700 hover:bg-red-800 shadow-sm transition-all uppercase tracking-wider"
          >
            <ShieldAlert className="w-4 h-4" />
            <span>Emergenza SOS</span>
          </button>
          <button
            onClick={toggleTheme}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-bold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all"
          >
            {theme === 'light' ? <Moon className="w-4 h-4 text-slate-400 dark:text-slate-500" /> : <Sun className="w-4 h-4 text-slate-400 dark:text-slate-500" />}
            <span>{theme === 'light' ? 'Modalità Scura' : 'Modalità Chiara'}</span>
          </button>
          <button
            onClick={() => {
              setShowSettings(true);
              setIsSidebarOpen(false);
            }}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-bold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all"
          >
            <Settings className="w-4 h-4 text-slate-400 dark:text-slate-500" />
            <span>Impostazioni Hub</span>
          </button>
          <button
            onClick={() => {
              logoutCircle();
              setIsSidebarOpen(false);
            }}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-bold text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all border border-transparent"
          >
            <LogOut className="w-4 h-4 text-red-600" />
            <span>Esci dalla sessione</span>
          </button>
        </div>
      </aside>

      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
      {showEmergency && <EmergencyModal onClose={() => setShowEmergency(false)} />}
    </>
  );
};

