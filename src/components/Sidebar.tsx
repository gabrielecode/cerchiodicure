import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MessageSquareText, Calendar, Pill, FileText, BookOpen, Settings, LogOut, Users, HeartHandshake, AlertTriangle, Utensils } from 'lucide-react';
import { SettingsModal } from './SettingsModal';
import { EmergencyModal } from './EmergencyModal';

export const Sidebar: React.FC = () => {
  const { profile, activeTab, setActiveTab, members, logoutCircle } = useApp();
  const [showSettings, setShowSettings] = useState(false);
  const [showEmergency, setShowEmergency] = useState(false);

  const tabs = [
    { id: 'timeline', label: 'Timeline', icon: MessageSquareText },
    { id: 'calendario', label: 'Calendario', icon: Calendar },
    { id: 'farmaci', label: 'Farmaci', icon: Pill },
    { id: 'pasti', label: 'Pasti & Nutrizione', icon: Utensils },
    { id: 'documenti', label: 'Documenti', icon: FileText },
    { id: 'guida', label: 'Guida', icon: BookOpen },
  ];

  return (
    <>
      <aside className="hidden md:flex w-64 fixed inset-y-0 left-0 flex-col bg-white border-r border-slate-200 z-30 shadow-xs">
        {/* Brand Header */}
        <div className="p-6 border-b border-slate-100 flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#7BA88A]/20 text-[#7BA88A] flex items-center justify-center shrink-0">
            <HeartHandshake className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-[#2D3748] tracking-tight">Cerchio di Cura</h1>
            <p className="text-[11px] text-slate-500 truncate max-w-[130px]">Cura di {profile?.recipientName || 'Nonna Rosa'}</p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">Navigazione</div>
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-[#7BA88A]/15 text-[#7BA88A] font-semibold shadow-xs'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-[#7BA88A]' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}

          <div className="pt-6">
            <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
              <span>Membri del Cerchio</span>
              <span className="bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded-md text-[10px] font-semibold">{members.length}</span>
            </div>
            <div className="space-y-1 mt-1">
              {members.map((m) => (
                <div key={m.id} className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-slate-700 bg-slate-50/50">
                  <span className="w-7 h-7 rounded-lg bg-white shadow-2xs flex items-center justify-center text-sm">{m.avatar}</span>
                  <div className="flex-1 truncate">
                    <p className="font-semibold text-slate-800 truncate">{m.name}</p>
                    <p className="text-[10px] text-slate-400 truncate">{m.role}</p>
                  </div>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" title="Online" />
                </div>
              ))}
            </div>
          </div>
        </nav>

        {/* Footer Actions in Sidebar */}
        <div className="p-4 border-t border-slate-100 space-y-2 bg-slate-50/50">
          <button
            onClick={() => setShowEmergency(true)}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold text-white bg-red-600 hover:bg-red-700 shadow-sm transition-all"
          >
            <AlertTriangle className="w-4 h-4" />
            <span>Emergenza SOS</span>
          </button>
          <button
            onClick={() => setShowSettings(true)}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium text-slate-700 hover:bg-white hover:shadow-2xs transition-all"
          >
            <Settings className="w-4 h-4 text-slate-500" />
            <span>Impostazioni Cerchio</span>
          </button>
          <button
            onClick={logoutCircle}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium text-red-600 hover:bg-red-50 transition-all"
          >
            <LogOut className="w-4 h-4 text-red-500" />
            <span>Esci dal Cerchio</span>
          </button>
        </div>
      </aside>

      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
      {showEmergency && <EmergencyModal onClose={() => setShowEmergency(false)} />}
    </>
  );
};
