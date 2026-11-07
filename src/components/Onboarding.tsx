import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Users, Calendar, ShieldCheck, ArrowRight, HeartHandshake, KeyRound } from 'lucide-react';

export const Onboarding: React.FC = () => {
  const { createCircle, joinCircle, showToast } = useApp();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);

  // Form states
  const [recipientName, setRecipientName] = useState('Nonna Rosa');
  const [userName, setUserName] = useState('Marco');
  const [userRole, setUserRole] = useState('Figlio');
  const [inviteCode, setInviteCode] = useState('');

  const slides = [
    {
      title: 'Tutto il cerchio di cura in un posto',
      desc: 'Famigliari, fratelli e badanti uniti per coordinare l’assistenza quotidiana di chi ami in Ticino.',
      icon: Users,
    },
    {
      title: 'Chi passa quando, farmaci e appuntamenti',
      desc: 'Condividi turni di visita, monitora le dosi dei farmaci in tempo reale e gestisci ogni appuntamento medico.',
      icon: Calendar,
    },
    {
      title: 'Privato, sicuro e condiviso solo con chi vuoi',
      desc: 'Nessun dato medico pubblicato all’esterno. Solo i membri invitati con codice segreto possono accedere.',
      icon: ShieldCheck,
    },
  ];

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipientName.trim() || !userName.trim()) {
      showToast('Inserisci tutti i campi obbligatori', 'info');
      return;
    }
    createCircle(recipientName.trim(), userName.trim(), userRole);
  };

  const handleJoinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteCode.trim() || !userName.trim()) {
      showToast('Inserisci il codice invito e il tuo nome', 'info');
      return;
    }
    const success = joinCircle(inviteCode.trim(), userName.trim(), userRole);
    if (!success) {
      showToast('Codice invito errato o non trovato', 'info');
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 dark:bg-slate-950 flex flex-col justify-between p-6 md:p-12 relative overflow-hidden font-sans text-slate-800 dark:text-slate-200 transition-colors duration-300">
      {/* Top branding */}
      <div className="pt-8 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-lg bg-emerald-700/10 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-500 mb-3 border border-emerald-100 dark:border-emerald-900/30">
          <HeartHandshake className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">Cerchio di Cura</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider mt-1">Ticino • Assistenza Familiare Condivisa</p>
      </div>

      {/* Carousel slides */}
      <div className="my-auto py-8">
        <div className="bg-white dark:bg-slate-900 rounded-lg p-8 shadow-sm border border-slate-200 dark:border-slate-800 text-center relative min-h-[320px] flex flex-col justify-between">
          <div>
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-emerald-700 dark:text-emerald-500 border border-slate-100 dark:border-slate-700">
                {React.createElement(slides[currentSlide].icon, { className: "w-8 h-8" })}
              </div>
            </div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white mb-3 leading-snug tracking-tight">
              {slides[currentSlide].title}
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
              {slides[currentSlide].desc}
            </p>
          </div>

          {/* Indicators */}
          <div className="flex justify-center items-center gap-2 mt-8">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`h-1.5 rounded-full transition-all ${
                  currentSlide === idx ? 'w-8 bg-emerald-700 dark:bg-emerald-500' : 'w-2 bg-slate-200 dark:bg-slate-800'
                }`}
                aria-label={`Slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="space-y-3 pb-8">
      <div className="space-y-3 pb-8">
        <button
          onClick={() => setShowCreateModal(true)}
          className="w-full h-14 bg-emerald-700 hover:bg-emerald-800 text-white font-black uppercase tracking-widest rounded-lg shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-2 text-sm"
        >
          <span>Crea cerchio di cura</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <button
          onClick={() => setShowJoinModal(true)}
          className="w-full h-12 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-black uppercase tracking-widest rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-800 active:scale-[0.98] transition-all flex items-center justify-center gap-2 text-xs"
        >
          <KeyRound className="w-4 h-4 text-emerald-700 dark:text-emerald-500" />
          <span>Ho un codice invito</span>
        </button>
      </div>
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-t-lg sm:rounded-lg p-8 shadow-2xl animate-slide-up border border-slate-200 dark:border-slate-800">
            <h3 className="text-xl font-black text-slate-900 dark:text-white mb-1 tracking-tight">Crea un nuovo cerchio</h3>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider mb-8">Inserisci i dati per iniziare a coordinare l’assistenza.</p>

            <form onSubmit={handleCreateSubmit} className="space-y-6">
              <div>
                <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-2">
                  Destinatario Assistenza
                </label>
                <input
                  type="text"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  placeholder="Es. Nonna Rosa"
                  className="w-full h-12 px-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none focus:border-emerald-700 dark:focus:border-emerald-500 dark:text-white focus:bg-white dark:focus:bg-slate-900 transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-2">
                  Il tuo nome
                </label>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="Es. Marco"
                  className="w-full h-12 px-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none focus:border-emerald-700 dark:focus:border-emerald-500 dark:text-white focus:bg-white dark:focus:bg-slate-900 transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-2">
                  Il tuo ruolo nel cerchio
                </label>
                <select
                  value={userRole}
                  onChange={(e) => setUserRole(e.target.value)}
                  className="w-full h-12 px-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none focus:border-emerald-700 dark:focus:border-emerald-500 dark:text-white focus:bg-white dark:focus:bg-slate-900 transition-all appearance-none"
                >
                  <option value="Figlio / Figlia">Figlio / Figlia</option>
                  <option value="Fratello / Sorella">Fratello / Sorella</option>
                  <option value="Badante / Assistente">Badante / Assistente</option>
                  <option value="Nipote">Nipote</option>
                  <option value="Altro parente">Altro parente</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 h-12 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-all text-xs uppercase tracking-widest"
                >
                  Annulla
                </button>
                <button
                  type="submit"
                  className="flex-1 h-12 bg-emerald-700 text-white font-black rounded-lg shadow-md hover:bg-emerald-800 transition-all text-xs uppercase tracking-widest"
                >
                  Inizia ora
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Join Modal */}
      {showJoinModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-t-lg sm:rounded-lg p-8 shadow-2xl animate-slide-up border border-slate-200 dark:border-slate-800">
            <h3 className="text-xl font-black text-slate-900 dark:text-white mb-1 tracking-tight">Unisciti a un cerchio</h3>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider mb-8">Inserisci il codice di 6 caratteri fornito da un familiare.</p>

            <form onSubmit={handleJoinSubmit} className="space-y-6">
              <div>
                <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-2">
                  Codice invito (es. ROSA42)
                </label>
                <input
                  type="text"
                  value={inviteCode}
                  onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                  placeholder="Es. ROSA42"
                  maxLength={6}
                  className="w-full h-12 px-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-mono tracking-[0.3em] font-bold uppercase focus:outline-none focus:border-emerald-700 dark:focus:border-emerald-500 dark:text-white focus:bg-white dark:focus:bg-slate-900 transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-2">
                  Il tuo nome
                </label>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="Es. Giulia"
                  className="w-full h-12 px-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none focus:border-emerald-700 dark:focus:border-emerald-500 dark:text-white focus:bg-white dark:focus:bg-slate-900 transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-2">
                  Il tuo ruolo
                </label>
                <select
                  value={userRole}
                  onChange={(e) => setUserRole(e.target.value)}
                  className="w-full h-12 px-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none focus:border-emerald-700 dark:focus:border-emerald-500 dark:text-white focus:bg-white dark:focus:bg-slate-900 transition-all appearance-none"
                >
                  <option value="Figlio / Figlia">Figlio / Figlia</option>
                  <option value="Fratello / Sorella">Fratello / Sorella</option>
                  <option value="Badante / Assistente">Badante / Assistente</option>
                  <option value="Nipote">Nipote</option>
                  <option value="Altro parente">Altro parente</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowJoinModal(false)}
                  className="flex-1 h-12 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-all text-xs uppercase tracking-widest"
                >
                  Annulla
                </button>
                <button
                  type="submit"
                  className="flex-1 h-12 bg-emerald-700 text-white font-black rounded-lg shadow-md hover:bg-emerald-800 transition-all text-xs uppercase tracking-widest"
                >
                  Entra nel cerchio
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
