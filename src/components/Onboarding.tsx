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
      emoji: '🏡',
      title: 'Tutto il cerchio di cura in un posto',
      desc: 'Famigliari, fratelli e badanti uniti per coordinare l’assistenza quotidiana di chi ami in Ticino.',
      icon: Users,
    },
    {
      emoji: '📋',
      title: 'Chi passa quando, farmaci e appuntamenti',
      desc: 'Condividi turni di visita, monitora le dosi dei farmaci in tempo reale e gestisci ogni appuntamento medico.',
      icon: Calendar,
    },
    {
      emoji: '🔒',
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
    <div className="min-h-screen w-full bg-[#E8F0FE] flex flex-col justify-between p-6 md:p-12 relative overflow-hidden font-sans text-[#2D3748]">
      {/* Top branding */}
      <div className="pt-8 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-[#7BA88A]/20 text-[#7BA88A] mb-3 shadow-sm">
          <HeartHandshake className="w-8 h-8 text-[#7BA88A]" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-[#2D3748]">Cerchio di Cura</h1>
        <p className="text-xs text-slate-500 mt-1">Ticino • Assistenza Familiare Condivisa</p>
      </div>

      {/* Carousel slides */}
      <div className="my-auto py-8">
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 text-center relative min-h-[320px] flex flex-col justify-between">
          <div>
            <div className="text-5xl mb-6">{slides[currentSlide].emoji}</div>
            <h2 className="text-xl font-bold text-[#2D3748] mb-3 leading-snug">
              {slides[currentSlide].title}
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              {slides[currentSlide].desc}
            </p>
          </div>

          {/* Indicators */}
          <div className="flex justify-center items-center gap-2 mt-8">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`h-2 rounded-full transition-all ${
                  currentSlide === idx ? 'w-8 bg-[#7BA88A]' : 'w-2 bg-slate-200'
                }`}
                aria-label={`Slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="space-y-3 pb-8">
        <button
          onClick={() => setShowCreateModal(true)}
          className="w-full h-14 bg-[#7BA88A] text-white font-semibold rounded-2xl shadow-md hover:bg-[#6c987c] active:scale-[0.98] transition-all flex items-center justify-center gap-2 text-base"
        >
          <span>Crea cerchio di cura</span>
          <ArrowRight className="w-5 h-5" />
        </button>

        <button
          onClick={() => setShowJoinModal(true)}
          className="w-full h-12 bg-white text-[#2D3748] font-semibold rounded-2xl border border-slate-200 shadow-sm hover:bg-slate-50 active:scale-[0.98] transition-all flex items-center justify-center gap-2 text-sm"
        >
          <KeyRound className="w-4 h-4 text-[#7BA88A]" />
          <span>Ho un codice invito</span>
        </button>
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl animate-slide-up">
            <h3 className="text-xl font-bold text-[#2D3748] mb-1">Crea un nuovo cerchio</h3>
            <p className="text-xs text-slate-500 mb-6">Inserisci i dati per iniziare a coordinare l’assistenza.</p>

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1.5">
                  Nome della persona assistita (es. Nonna Rosa)
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

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1.5">
                  Il tuo nome
                </label>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="Es. Marco"
                  className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:border-[#7BA88A] focus:bg-white transition-all"
                  required
                />
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

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 h-12 bg-slate-100 text-slate-700 font-semibold rounded-xl hover:bg-slate-200 transition-all text-sm"
                >
                  Annulla
                </button>
                <button
                  type="submit"
                  className="flex-1 h-12 bg-[#7BA88A] text-white font-semibold rounded-xl shadow-md hover:bg-[#6c987c] transition-all text-sm"
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
          <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl animate-slide-up">
            <h3 className="text-xl font-bold text-[#2D3748] mb-1">Unisciti a un cerchio</h3>
            <p className="text-xs text-slate-500 mb-6">Inserisci il codice di 6 caratteri fornito da un familiare.</p>

            <form onSubmit={handleJoinSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1.5">
                  Codice invito (es. ROSA42)
                </label>
                <input
                  type="text"
                  value={inviteCode}
                  onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                  placeholder="Es. ROSA42"
                  maxLength={6}
                  className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 text-sm font-mono tracking-widest uppercase focus:outline-none focus:border-[#7BA88A] focus:bg-white transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1.5">
                  Il tuo nome
                </label>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="Es. Giulia"
                  className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:border-[#7BA88A] focus:bg-white transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1.5">
                  Il tuo ruolo
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

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowJoinModal(false)}
                  className="flex-1 h-12 bg-slate-100 text-slate-700 font-semibold rounded-xl hover:bg-slate-200 transition-all text-sm"
                >
                  Annulla
                </button>
                <button
                  type="submit"
                  className="flex-1 h-12 bg-[#7BA88A] text-white font-semibold rounded-xl shadow-md hover:bg-[#6c987c] transition-all text-sm"
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
