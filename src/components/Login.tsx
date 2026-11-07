import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Activity, ArrowRight, KeyRound, ArrowLeft, User, ShieldCheck, Moon, Sun } from 'lucide-react';

export const Login: React.FC = () => {
  const { createCircle, joinCircle, setCurrentView, showToast, theme, toggleTheme } = useApp();
  const [mode, setMode] = useState<'create' | 'join'>('create');
  const [userName, setUserName] = useState('Marco');
  const [recipientName, setRecipientName] = useState('Rosa Rossi');
  const [userRole, setUserRole] = useState('Caregiver Familiare');
  const [inviteCode, setInviteCode] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName.trim()) {
      showToast('Inserire identificativo utente', 'info');
      return;
    }

    if (mode === 'join') {
      if (!inviteCode.trim()) {
        showToast('Inserire codice di accesso al cerchio', 'info');
        return;
      }
      const success = joinCircle(inviteCode.trim(), userName.trim(), userRole);
      if (success) {
        setCurrentView('app');
      }
    } else {
      if (!recipientName.trim()) {
        showToast('Inserire nome del destinatario dell\'assistenza', 'info');
        return;
      }
      createCircle(recipientName.trim(), userName.trim(), userRole);
      setCurrentView('app');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-between p-4 sm:p-6 lg:p-8 font-sans text-slate-700 dark:text-slate-300 transition-colors duration-300">
      {/* Top back button */}
      <div className="max-w-md mx-auto w-full pt-4 flex items-center justify-between">
        <button
          onClick={() => setCurrentView('landing')}
          className="inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors bg-white dark:bg-slate-900 px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm"
        >
          <ArrowLeft className="w-3 h-3" />
          <span>Portale Pubblico</span>
        </button>
        <button 
          onClick={toggleTheme}
          className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-white dark:hover:bg-slate-900 rounded-lg border border-transparent hover:border-slate-200 dark:hover:border-slate-800 transition-all shadow-sm"
          title="Toggle theme"
        >
          {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
        </button>
      </div>

      {/* Main Login Card */}
      <div className="my-auto py-8 max-w-md w-full mx-auto">
        <div className="bg-white dark:bg-slate-900 rounded-lg p-10 shadow-xl border border-slate-200 dark:border-slate-800">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-lg bg-emerald-700 text-white mb-6 shadow-md">
              <Activity className="w-7 h-7" />
            </div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">Accesso Hub Operativo</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-2">Piattaforma di coordinamento assistenza Canton Ticino</p>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="grid grid-cols-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg mb-8">
            <button
              type="button"
              onClick={() => setMode('create')}
              className={`py-2.5 rounded-md text-[11px] font-black uppercase tracking-wider transition-all ${
                mode === 'create'
                  ? 'bg-white dark:bg-slate-900 text-emerald-800 dark:text-emerald-400 shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              Nuovo Hub
            </button>
            <button
              type="button"
              onClick={() => setMode('join')}
              className={`py-2.5 rounded-md text-[11px] font-black uppercase tracking-wider transition-all ${
                mode === 'join'
                  ? 'bg-white dark:bg-slate-900 text-emerald-800 dark:text-emerald-400 shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              Accesso Codice
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {mode === 'create' ? (
              <div>
                <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-2">
                  Destinatario Assistenza
                </label>
                <input
                  type="text"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  placeholder="Es. Rosa Rossi"
                  className="w-full h-12 px-4 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none focus:border-emerald-700 dark:focus:border-emerald-500 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-900 transition-all"
                  required
                />
              </div>
            ) : (
              <div>
                <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-2">
                  Codice Hub Univoco
                </label>
                <div className="relative">
                  <KeyRound className="absolute left-4 top-3.5 w-5 h-5 text-slate-300 dark:text-slate-600" />
                  <input
                    type="text"
                    value={inviteCode}
                    onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                    placeholder="Es. ROSA42"
                    maxLength={6}
                    className="w-full h-12 pl-12 pr-4 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-mono font-bold tracking-[0.3em] uppercase focus:outline-none focus:border-emerald-700 dark:focus:border-emerald-500 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-900 transition-all"
                    required
                  />
                </div>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold mt-2 uppercase tracking-tight">Richiedere il codice all'amministratore del cerchio.</p>
              </div>
            )}

            <div>
              <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-2">
                Identificativo Operatore
              </label>
              <div className="relative">
                <User className="absolute left-4 top-3.5 w-5 h-5 text-slate-300 dark:text-slate-600" />
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="Es. Marco"
                  className="w-full h-12 pl-12 pr-4 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none focus:border-emerald-700 dark:focus:border-emerald-500 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-900 transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-2">
                Profilo Professionale / Ruolo
              </label>
              <select
                value={userRole}
                onChange={(e) => setUserRole(e.target.value)}
                className="w-full h-12 px-4 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none focus:border-emerald-700 dark:focus:border-emerald-500 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-900 transition-all appearance-none"
              >
                <option value="Caregiver Familiare">Caregiver Familiare</option>
                <option value="Personale Spitex">Operatore Spitex</option>
                <option value="Assistente Domiciliare">Badante / Assistente</option>
                <option value="Personale Medico">Medico di Base / Specialista</option>
                <option value="Altro">Collaboratore Esterno</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full h-14 bg-emerald-700 hover:bg-emerald-800 text-white font-black uppercase tracking-[0.2em] rounded-lg shadow-md transition-all flex items-center justify-center gap-3 text-sm mt-4"
            >
              <span>Convalida e Accesso</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-slate-100 dark:border-slate-800 flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-500" />
            <span>Server-side encryption active • CH-Hosting</span>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto text-center pb-4 text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
        Cerchio di Cura • Enterprise Care Management System
      </div>
    </div>
  );
};
