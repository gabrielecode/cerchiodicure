import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MessageSquareText, Calendar, Pill, Utensils, AlertTriangle, ShieldAlert } from 'lucide-react';
import { EmergencyModal } from './EmergencyModal';

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab } = useApp();
  const [showEmergency, setShowEmergency] = useState(false);

  const tabs = [
    { id: 'timeline', label: 'Timeline', icon: MessageSquareText },
    { id: 'farmaci', label: 'Terapia', icon: Pill },
    { id: 'pasti', label: 'Pasti', icon: Utensils },
    { id: 'calendario', label: 'Agenda', icon: Calendar },
  ];

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 z-45 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-2xl block md:hidden h-16">
        <div className="grid grid-cols-5 h-full items-center px-1">
          {tabs.slice(0, 2).map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col items-center justify-center py-1 transition-all ${
                  isActive ? 'text-emerald-700' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                <div className={`p-1.5 rounded transition-all ${isActive ? 'bg-emerald-50' : ''}`}>
                  <Icon className={`w-5 h-5 ${isActive ? 'text-emerald-700' : 'text-slate-400'}`} />
                </div>
                <span className={`text-[9px] font-black uppercase tracking-widest mt-0.5 ${isActive ? 'opacity-100' : 'opacity-60'}`}>{tab.label}</span>
              </button>
            );
          })}

          {/* Emergency SOS Center Button */}
          <div className="flex items-center justify-center">
            <button
              onClick={() => setShowEmergency(true)}
              className="w-12 h-12 bg-red-700 text-white rounded shadow-lg border border-red-800 flex items-center justify-center active:scale-90 transition-transform"
              aria-label="SOS"
              title="SOS Emergency"
            >
              <ShieldAlert className="w-6 h-6" />
            </button>
          </div>

          {tabs.slice(2, 4).map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col items-center justify-center py-1 transition-all ${
                  isActive ? 'text-emerald-700' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                <div className={`p-1.5 rounded transition-all ${isActive ? 'bg-emerald-50' : ''}`}>
                  <Icon className={`w-5 h-5 ${isActive ? 'text-emerald-700' : 'text-slate-400'}`} />
                </div>
                <span className={`text-[9px] font-black uppercase tracking-widest mt-0.5 ${isActive ? 'opacity-100' : 'opacity-60'}`}>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {showEmergency && <EmergencyModal onClose={() => setShowEmergency(false)} />}
    </>
  );
};
