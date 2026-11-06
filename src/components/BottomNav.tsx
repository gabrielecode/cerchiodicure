import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MessageSquareText, Calendar, Pill, Utensils, AlertTriangle } from 'lucide-react';
import { EmergencyModal } from './EmergencyModal';

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab } = useApp();
  const [showEmergency, setShowEmergency] = useState(false);

  const tabs = [
    { id: 'timeline', label: 'Timeline', icon: MessageSquareText },
    { id: 'farmaci', label: 'Farmaci', icon: Pill },
    { id: 'pasti', label: 'Pasti', icon: Utensils },
    { id: 'calendario', label: 'Calendario', icon: Calendar },
  ];

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 z-45 bg-white/95 backdrop-blur-md border-t border-slate-100 shadow-xl max-w-md mx-auto block md:hidden">
        <div className="grid grid-cols-5 h-16 items-center px-1">
          {tabs.slice(0, 2).map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col items-center justify-center py-1 transition-colors ${
                  isActive ? 'text-[#7BA88A] font-semibold' : 'text-slate-400 hover:text-slate-600 font-medium'
                }`}
              >
                <div className={`p-1.5 rounded-xl transition-all ${isActive ? 'bg-[#7BA88A]/10' : ''}`}>
                  <Icon className={`w-5 h-5 ${isActive ? 'text-[#7BA88A]' : 'text-slate-400'}`} />
                </div>
                <span className="text-[10px] tracking-tight mt-0.5">{tab.label}</span>
              </button>
            );
          })}

          {/* Emergency SOS Center Button */}
          <div className="flex items-center justify-center">
            <button
              onClick={() => setShowEmergency(true)}
              className="w-12 h-12 bg-red-600 hover:bg-red-700 text-white rounded-2xl shadow-lg shadow-red-500/30 flex flex-col items-center justify-center animate-pulse active:scale-95 transition-transform"
              aria-label="Emergenza SOS"
              title="Emergenza SOS"
            >
              <AlertTriangle className="w-6 h-6" />
            </button>
          </div>

          {tabs.slice(2, 4).map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col items-center justify-center py-1 transition-colors ${
                  isActive ? 'text-[#7BA88A] font-semibold' : 'text-slate-400 hover:text-slate-600 font-medium'
                }`}
              >
                <div className={`p-1.5 rounded-xl transition-all ${isActive ? 'bg-[#7BA88A]/10' : ''}`}>
                  <Icon className={`w-5 h-5 ${isActive ? 'text-[#7BA88A]' : 'text-slate-400'}`} />
                </div>
                <span className="text-[10px] tracking-tight mt-0.5">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {showEmergency && <EmergencyModal onClose={() => setShowEmergency(false)} />}
    </>
  );
};
