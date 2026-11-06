import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { HeartHandshake, ArrowRight, KeyRound, ArrowLeft, User, ShieldCheck } from 'lucide-react';

export const Login: React.FC = () => {
  const { createCircle, joinCircle, setCurrentView, showToast } = useApp();
  const [mode, setMode] = useState<'create' | 'join'>('create');
  const [userName, setUserName] = useState('Marco');
  const [recipientName, setRecipientName] = useState('Nonna Rosa');
  const [userRole, setUserRole] = useState('Figlio / Figlia');
  const [inviteCode, setInviteCode] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName.trim()) {
      showToast('Inserisci il tuo nome', 'info');
      return;
    }

    if (mode === 'join') {
      if (!inviteCode.trim()) {
        showToast('Inserisci il codice invito del cerchio', 'info');
        return;
      }
      const success = joinCircle(inviteCode.trim(), userName.trim(), userRole);
      if (success) {
        setCurrentView('app');
      }
    } else {
      if (!recipientName.trim()) {
        showToast('Inserisci il nome della persona assistita', 'info');
        return;
      }
      createCircle(recipientName.trim(), userName.trim(), userRole);
      setCurrentView('app');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between p-4 sm:p-6 lg:p-8 font-sans text-slate-800">
      {/* Top back button */}
      <div className="max-w-md mx-auto w-full pt-4">
        <button
          onClick={() => setCurrentView('landing')}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-[#7BA88A] transition-colors bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-2xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Torna alla Home</span>
        </button>
      </div>

      {/* Main Login Card */}
      <div className="my-auto py-8 max-w-md w-full mx-auto">
        <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-200/80">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#7BA88A]/20 text-[#7BA88A] mb-3 shadow-2xs">
              <HeartHandshake className="w-7 h-7 text-[#7BA88A]" />
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Accedi al Cerchio</h1>
            <p className="text-xs text-slate-500 mt-1">Coordina l'assistenza in Ticino in modo semplice e sicuro</p>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-2xl mb-6">
            <button
              type="button"
              onClick={() => setMode('create')}
              className={`py-2.5 rounded-xl text-xs font-semibold transition-all ${
                mode === 'create'
                  ? 'bg-white text-[#7BA88A] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Crea Cerchio
            </button>
            <button
              type="button"
              onClick={() => setMode('join')}
              className={`py-2.5 rounded-xl text-xs font-semibold transition-all ${
                mode === 'join'
                  ? 'bg-white text-[#7BA88A] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Ho un Codice Invito
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'create' ? (
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1.5">
                  Nome della persona assistita
                </label>
                <input
                  type="text"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  placeholder="Es. Nonna Rosa"
                  className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:border-[#7BA88A] focus:bg-white transition-all"
                  required
                />
              </div>
            ) : (
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1.5">
                  Codice Invito del Cerchio
                </label>
                <div className="relative">
                  <KeyRound className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    value={inviteCode}
                    onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                    placeholder="Es. ROSA42"
                    maxLength={6}
                    className="w-full h-12 pl-12 pr-4 rounded-xl border border-slate-200 bg-slate-50 text-sm font-mono tracking-widest uppercase focus:outline-none focus:border-[#7BA88A] focus:bg-white transition-all"
                    required
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">Chiedi il codice di 6 caratteri al family member amministratore.</p>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1.5">
                Il tuo nome
              </label>
              <div className="relative">
                <User className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="Es. Marco"
                  className="w-full h-12 pl-12 pr-4 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:border-[#7BA88A] focus:bg-white transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1.5">
                Il tuo ruolo nel cerchio
              </label>
              <select
                value={userRole}
                onChange={(e) => setUserRole(e.target.value)}
                className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:border-[#7BA88A] focus:bg-white transition-all"
              >
                <option value="Figlio / Figlia">Figlio / Figlia</option>
                <option value="Fratello / Sorella">Fratello / Sorella</option>
                <option value="Badante / Assistente">Badante / Assistente</option>
                <option value="Nipote">Nipote</option>
                <option value="Altro parente">Altro parente</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full h-13 bg-[#7BA88A] hover:bg-[#6c987c] text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-base mt-2"
            >
              <span>Entra nel Cerchio</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-100 flex items-center justify-center gap-2 text-xs text-slate-500">
            <ShieldCheck className="w-4 h-4 text-[#7BA88A]" />
            <span>Accesso sicuro e crittografato • Ticino 🇨🇭</span>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto text-center pb-4 text-xs text-slate-400">
        Cerchio di Cura • Assistenza Familiare Ticino
      </div>
    </div>
  );
};
