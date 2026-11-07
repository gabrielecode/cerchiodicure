import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, UserPlus, Trash2, Copy, Share2, Crown, LogOut, Check, Shield, Activity, ShieldCheck, Bell } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface SettingsModalProps {
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ onClose }) => {
  const { profile, members, updateProfile, addMember, removeMember, logoutCircle, showToast, registerPushToken } = useApp();
  const { signOut } = useAuth();
  const [recipientNameInput, setRecipientNameInput] = useState(profile?.recipientName || '');
  const [showAddMember, setShowAddMember] = useState(false);
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberRole, setNewMemberRole] = useState('Collaboratore');
  const [showPremiumModal, setShowPremiumModal] = useState(false);

  const inviteCode = profile?.inviteCode || 'ROSA42';

  const handleUpdateRecipient = (e: React.FormEvent) => {
    e.preventDefault();
    if (recipientNameInput.trim()) {
      updateProfile(recipientNameInput.trim());
    }
  };

  const handleAddMemberSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMemberName.trim()) {
      addMember(newMemberName.trim(), newMemberRole);
      setNewMemberName('');
      setShowAddMember(false);
    }
  };

  const copyInviteCode = () => {
    navigator.clipboard.writeText(inviteCode);
    showToast('Codice di sicurezza copiato negli appunti.');
  };

  const shareWhatsApp = () => {
    const text = encodeURIComponent(
      `Protocollo di accesso Cerchio di Cura per ${profile?.recipientName || 'il nostro assistito'}. Codice univoco: *${inviteCode}*`
    );
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 transition-colors duration-300">
      <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-t-lg sm:rounded-lg shadow-2xl max-h-[90vh] overflow-y-auto border border-slate-200 dark:border-slate-800 font-sans">
        {/* Header */}
        <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/50">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded bg-slate-900 dark:bg-slate-950 text-white flex items-center justify-center shadow-lg">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Activity className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                <span className="text-[9px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em]">Hub Configuration</span>
              </div>
              <h2 className="text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight leading-none uppercase">Impostazioni Hub</h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 flex items-center justify-center text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-8 space-y-10">
          {/* Target Identification */}
          <section>
            <h3 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-4">Anagrafica Assistito</h3>
            <form onSubmit={handleUpdateRecipient} className="flex gap-3">
              <input
                type="text"
                value={recipientNameInput}
                onChange={(e) => setRecipientNameInput(e.target.value)}
                className="flex-1 h-12 px-4 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none focus:border-emerald-700 dark:focus:border-emerald-500 dark:text-slate-100 font-bold transition-all"
                required
              />
              <button
                type="submit"
                className="px-6 h-12 bg-slate-900 text-white font-black text-[10px] rounded uppercase tracking-widest shadow-md hover:bg-slate-800 transition-all"
              >
                Salva
              </button>
            </form>
          </section>

          {/* Access Control */}
          <section className="bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-6 border border-emerald-100 dark:border-emerald-800 shadow-inner">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-black text-emerald-800 dark:text-emerald-400 uppercase tracking-[0.2em]">
                Protocollo di Accesso
              </span>
              <div className="flex items-center gap-2 font-mono font-black text-xl text-emerald-900 dark:text-emerald-300 tracking-[0.2em] bg-white dark:bg-slate-900 px-4 py-1.5 rounded border border-emerald-200 dark:border-emerald-800">
                {inviteCode}
              </div>
            </div>
            <p className="text-xs text-emerald-700 dark:text-emerald-500 font-medium mb-6 uppercase tracking-tight opacity-80">
              Il codice garantisce l'accesso crittografato all'Hub operativo.
            </p>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={copyInviteCode}
                className="h-11 bg-white dark:bg-slate-800 text-emerald-900 dark:text-emerald-400 font-black rounded border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-50 dark:hover:bg-emerald-900/40 transition-all flex items-center justify-center gap-2 text-[10px] uppercase tracking-widest"
              >
                <Copy className="w-4 h-4" />
                <span>Copia Codice</span>
              </button>
              <button
                onClick={shareWhatsApp}
                className="h-11 bg-emerald-600 dark:bg-emerald-700 text-white font-black rounded hover:bg-emerald-700 dark:hover:bg-emerald-800 transition-all flex items-center justify-center gap-2 text-[10px] uppercase tracking-widest shadow-sm"
              >
                <Share2 className="w-4 h-4" />
                <span>Condividi</span>
              </button>
            </div>
          </section>

          {/* Team Management */}
          <section>
            <div className="flex items-center justify-between mb-6 pb-2 border-b border-slate-50 dark:border-slate-800">
              <h3 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">
                Gestione Team Hub ({members.length})
              </h3>
              <button
                onClick={() => setShowAddMember(true)}
                className="text-[10px] font-black text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 uppercase tracking-widest flex items-center gap-2"
              >
                <UserPlus className="w-4 h-4" />
                <span>Registra Membro</span>
              </button>
            </div>

            <div className="grid gap-3">
              {members.map((m) => (
                <div
                  key={m.id}
                  className="flex items-center justify-between p-4 rounded bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 transition-all hover:border-slate-200 dark:hover:border-slate-600 group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-9 h-9 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-[10px] font-black text-slate-600 dark:text-slate-400 shadow-sm">
                      {m.avatar}
                    </div>
                    <div>
                      <p className="text-sm font-black text-slate-900 dark:text-slate-100 leading-none mb-1">{m.name}</p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">{m.role}</p>
                    </div>
                  </div>
                  {members.length > 1 && (
                    <button
                      onClick={() => removeMember(m.id)}
                      className="p-2 text-slate-300 dark:text-slate-600 hover:text-red-700 dark:hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {showAddMember && (
              <form onSubmit={handleAddMemberSubmit} className="mt-6 p-6 bg-slate-900 dark:bg-slate-950 rounded-lg space-y-4 shadow-xl border border-slate-800 dark:border-slate-900 animate-in slide-in-from-top duration-300">
                <p className="text-[10px] font-black text-emerald-500 dark:text-emerald-400 uppercase tracking-[0.2em] mb-2">Anagrafica Nuovo Operatore</p>
                <input
                  type="text"
                  placeholder="Nominativo"
                  value={newMemberName}
                  onChange={(e) => setNewMemberName(e.target.value)}
                  className="w-full h-11 px-4 rounded bg-slate-800 dark:bg-slate-900 border border-slate-700 dark:border-slate-800 text-white text-sm font-bold focus:outline-none focus:border-emerald-500"
                  required
                />
                <select
                  value={newMemberRole}
                  onChange={(e) => setNewMemberRole(e.target.value)}
                  className="w-full h-11 px-4 rounded bg-slate-800 dark:bg-slate-900 border border-slate-700 dark:border-slate-800 text-white text-sm font-bold focus:outline-none focus:border-emerald-500 appearance-none"
                >
                  <option value="Collaboratore">Collaboratore</option>
                  <option value="Badante">Assistente</option>
                  <option value="Infermiera">Personale Sanitario</option>
                  <option value="Medico">Specialista</option>
                </select>
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddMember(false)}
                    className="flex-1 h-10 bg-transparent text-slate-400 dark:text-slate-500 rounded text-[10px] font-black uppercase tracking-widest border border-slate-700 dark:border-slate-800 hover:bg-slate-800 dark:hover:bg-slate-900"
                  >
                    Annulla
                  </button>
                  <button
                    type="submit"
                    className="flex-1 h-10 bg-emerald-700 text-white rounded text-[10px] font-black uppercase tracking-widest shadow-md hover:bg-emerald-800"
                  >
                    Conferma
                  </button>
                </div>
              </form>
            )}
          </section>

          {/* Notifications */}
          <section className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-6 border border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-[10px] font-black text-slate-900 dark:text-slate-100 uppercase tracking-[0.2em] mb-1">Notifiche Push</h3>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-tight">Ricevi aggiornamenti tempestivi su pasti e farmaci</p>
              </div>
              <button
                onClick={async () => {
                  const { requestNotificationPermission } = await import('../lib/firebase');
                  const token = await requestNotificationPermission();
                  if (token) {
                    const { useApp } = await import('../context/AppContext');
                    // We already have useApp at top level
                    registerPushToken(token);
                  } else {
                    showToast("Permesso notifiche negato o non supportato.", "info");
                  }
                }}
                className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shadow-sm"
              >
                <Bell className="w-4 h-4 text-emerald-600" />
                <span>Attiva Notifiche</span>
              </button>
            </div>
          </section>

          {/* Service Level Agreement */}
          <section className="bg-slate-900 dark:bg-slate-950 rounded-lg p-8 border border-slate-800 dark:border-slate-900 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5">
              <Crown className="w-24 h-24 text-white" />
            </div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <Crown className="w-5 h-5 text-emerald-500" />
                  <span className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Service Level</span>
                </div>
                <div className="px-3 py-1 bg-emerald-500 text-slate-900 text-[9px] font-black rounded uppercase tracking-widest">
                  Hub Base
                </div>
              </div>
              <p className="text-xs text-slate-400 dark:text-slate-500 font-medium mb-8 leading-relaxed">
                Il tuo Hub è configurato per un massimo di 3 operatori certificati. Passa al livello Enterprise per sbloccare funzionalità avanzate.
              </p>
              <button
                onClick={() => setShowPremiumModal(true)}
                className="w-full h-12 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-black uppercase tracking-widest rounded shadow-lg hover:bg-emerald-50 dark:hover:bg-emerald-900/40 transition-all text-[11px] dark:border dark:border-slate-700"
              >
                Richiedi Upgrade Pro – 10 CHF / m
              </button>
            </div>
          </section>

          {/* Session Termination */}
          <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-6">
            <button
              onClick={async () => {
                if (window.confirm('Terminare la sessione corrente e uscire dall\'Hub?')) {
                  await signOut();
                  logoutCircle();
                  onClose();
                }
              }}
              className="w-full h-12 text-red-700 dark:text-red-500 font-black text-[10px] uppercase tracking-[0.2em] rounded border border-red-100 dark:border-red-900/40 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all flex items-center justify-center gap-3"
            >
              <LogOut className="w-4 h-4" />
              <span>Termina Sessione Hub</span>
            </button>
            <div className="flex items-center justify-center gap-2 text-[9px] font-black text-slate-300 dark:text-slate-600 uppercase tracking-widest">
              <Shield className="w-3 h-3" />
              <span>Secure Session Management active</span>
            </div>
          </div>
        </div>
      </div>

      {/* Premium Upgrade Request */}
      {showPremiumModal && (
        <div className="fixed inset-0 z-60 bg-slate-950/90 backdrop-blur-xl flex items-center justify-center p-4 transition-colors duration-300">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-lg p-10 text-center shadow-2xl border border-slate-200 dark:border-slate-800">
            <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 rounded-lg flex items-center justify-center mx-auto mb-6 shadow-inner">
              <Crown className="w-8 h-8" />
            </div>
            <h4 className="text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight mb-2 uppercase tracking-tight">Hub Enterprise Pro</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider mb-10 pb-6 border-b border-slate-50 dark:border-slate-800">
              Sblocco limiti operativi e supporto tecnico prioritario
            </p>

            <div className="space-y-4 text-left mb-10 text-[11px] font-black uppercase tracking-widest text-slate-700 dark:text-slate-300">
              <div className="flex items-center gap-4 p-3 bg-slate-50 dark:bg-slate-800/50 rounded border border-slate-100 dark:border-slate-800">
                <Check className="w-5 h-5 text-emerald-600 dark:text-emerald-500 shrink-0" />
                <span>Operatori & Caregiver Illimitati</span>
              </div>
              <div className="flex items-center gap-4 p-3 bg-slate-50 dark:bg-slate-800/50 rounded border border-slate-100 dark:border-slate-800">
                <Check className="w-5 h-5 text-emerald-600 dark:text-emerald-500 shrink-0" />
                <span>Storico Log Archiviato h24</span>
              </div>
              <div className="flex items-center gap-4 p-3 bg-slate-50 dark:bg-slate-800/50 rounded border border-slate-100 dark:border-slate-800">
                <Check className="w-5 h-5 text-emerald-600 dark:text-emerald-500 shrink-0" />
                <span>Backup Dati Multi-Server CH</span>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <button
                onClick={() => {
                  showToast('Richiesta di upgrade inoltrata al reparto commerciale.');
                  setShowPremiumModal(false);
                }}
                className="w-full h-14 bg-emerald-700 text-white font-black uppercase tracking-[0.2em] rounded shadow-xl hover:bg-emerald-800 transition-all text-xs"
              >
                Conferma Upgrade (10 CHF)
              </button>
              <button
                onClick={() => setShowPremiumModal(false)}
                className="w-full h-12 bg-white dark:bg-slate-800 text-slate-400 dark:text-slate-500 font-black uppercase tracking-widest rounded border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all text-[10px]"
              >
                Ritorna alla dashboard
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
