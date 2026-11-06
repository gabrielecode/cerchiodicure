import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, UserPlus, Trash2, Copy, Share2, Crown, LogOut, Check, Shield } from 'lucide-react';

interface SettingsModalProps {
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ onClose }) => {
  const { profile, members, updateProfile, addMember, removeMember, logoutCircle, showToast } = useApp();
  const [recipientNameInput, setRecipientNameInput] = useState(profile?.recipientName || '');
  const [showAddMember, setShowAddMember] = useState(false);
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberRole, setNewMemberRole] = useState('Famigliare');
  const [showPremiumModal, setShowPremiumModal] = useState(false);

  const inviteCode = profile?.inviteCode || 'ROSA42';
  const inviteUrl = `https://cerchiodicura.ch/invito/${inviteCode}`;

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
    showToast('Codice invito copiato negli appunti!');
  };

  const shareWhatsApp = () => {
    const text = encodeURIComponent(
      `Unisciti al mio Cerchio di Cura per ${profile?.recipientName || 'il nostro caro'} su Cerchio di Cura Ticino! Usa il codice invito: *${inviteCode}*`
    );
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-[#2D3748]">Impostazioni</h2>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Recipient Name Section */}
        <div className="mb-6">
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">
            Persona assistita
          </h3>
          <form onSubmit={handleUpdateRecipient} className="flex gap-2">
            <input
              type="text"
              value={recipientNameInput}
              onChange={(e) => setRecipientNameInput(e.target.value)}
              className="flex-1 h-11 px-4 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:border-[#7BA88A] focus:bg-white transition-all"
              required
            />
            <button
              type="submit"
              className="px-4 h-11 bg-[#7BA88A] text-white font-semibold rounded-xl text-xs hover:bg-[#6c987c] transition-all"
            >
              Salva
            </button>
          </form>
        </div>

        {/* Invite Section */}
        <div className="bg-[#E8F0FE]/60 rounded-2xl p-4 mb-6 border border-[#7BA88A]/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-[#7BA88A] uppercase tracking-wide">
              Codice Invito Cerchio
            </span>
            <span className="text-lg font-mono font-bold tracking-widest text-[#2D3748] bg-white px-3 py-1 rounded-lg border border-slate-200">
              {inviteCode}
            </span>
          </div>
          <p className="text-xs text-slate-600 mb-4">
            Condividi questo codice con familiari o assistenti per farli unire al cerchio.
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={copyInviteCode}
              className="h-10 bg-white text-slate-700 font-semibold rounded-xl border border-slate-200 hover:bg-slate-50 transition-all flex items-center justify-center gap-2 text-xs shadow-sm"
            >
              <Copy className="w-4 h-4 text-[#7BA88A]" />
              <span>Copia codice</span>
            </button>
            <button
              onClick={shareWhatsApp}
              className="h-10 bg-[#25D366] text-white font-semibold rounded-xl hover:bg-[#20ba5a] transition-all flex items-center justify-center gap-2 text-xs shadow-sm"
            >
              <Share2 className="w-4 h-4" />
              <span>WhatsApp</span>
            </button>
          </div>
        </div>

        {/* Members Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
              Membri del Cerchio ({members.length})
            </h3>
            <button
              onClick={() => setShowAddMember(true)}
              className="text-xs font-semibold text-[#7BA88A] hover:underline flex items-center gap-1"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Aggiungi</span>
            </button>
          </div>

          <div className="space-y-2">
            {members.map((m) => (
              <div
                key={m.id}
                className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-slate-50"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{m.avatar}</span>
                  <div>
                    <p className="text-sm font-semibold text-[#2D3748]">{m.name}</p>
                    <p className="text-xs text-slate-500">{m.role}</p>
                  </div>
                </div>
                {members.length > 1 && (
                  <button
                    onClick={() => removeMember(m.id)}
                    className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                    title="Rimuovi membro"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>

          {showAddMember && (
            <form onSubmit={handleAddMemberSubmit} className="mt-3 p-3 bg-slate-100 rounded-2xl space-y-3">
              <p className="text-xs font-semibold text-slate-700">Aggiungi nuovo membro</p>
              <input
                type="text"
                placeholder="Nome"
                value={newMemberName}
                onChange={(e) => setNewMemberName(e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-white text-xs"
                required
              />
              <select
                value={newMemberRole}
                onChange={(e) => setNewMemberRole(e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-white text-xs"
              >
                <option value="Famigliare">Famigliare</option>
                <option value="Badante">Badante</option>
                <option value="Medico / Infermiere">Medico / Infermiere</option>
                <option value="Altro">Altro</option>
              </select>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddMember(false)}
                  className="flex-1 h-9 bg-white text-slate-600 rounded-xl text-xs font-medium border border-slate-200"
                >
                  Annulla
                </button>
                <button
                  type="submit"
                  className="flex-1 h-9 bg-[#7BA88A] text-white rounded-xl text-xs font-medium"
                >
                  Conferma
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Plan Section */}
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-4 mb-6 border border-amber-200/60">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Crown className="w-5 h-5 text-amber-600" />
              <span className="text-sm font-bold text-slate-800">Piano Free (3 membri)</span>
            </div>
            <span className="text-xs bg-amber-100 text-amber-800 font-semibold px-2 py-0.5 rounded-full">
              Attivo
            </span>
          </div>
          <p className="text-xs text-slate-600 mb-3">
            Passa al piano Famiglia Illimitata per aggiungere tutti i parenti e sincronizzare promemoria avanzati.
          </p>
          <button
            onClick={() => setShowPremiumModal(true)}
            className="w-full h-10 bg-amber-600 text-white font-semibold rounded-xl text-xs hover:bg-amber-700 transition-all shadow-sm"
          >
            Passa a Famiglia – 10 CHF / mese
          </button>
        </div>

        {/* Logout / Exit */}
        <div className="pt-2 border-t border-slate-100">
          <button
            onClick={() => {
              if (window.confirm('Vuoi davvero uscire da questo cerchio di cura?')) {
                logoutCircle();
                onClose();
              }
            }}
            className="w-full h-11 bg-red-50 text-red-600 font-semibold rounded-xl hover:bg-red-100 transition-all flex items-center justify-center gap-2 text-xs"
          >
            <LogOut className="w-4 h-4" />
            <span>Esci dal cerchio</span>
          </button>
        </div>
      </div>

      {/* Premium Modal Mock */}
      {showPremiumModal && (
        <div className="fixed inset-0 z-60 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-3xl p-6 text-center shadow-2xl animate-slide-up">
            <div className="w-14 h-14 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Crown className="w-8 h-8" />
            </div>
            <h4 className="text-lg font-bold text-[#2D3748] mb-1">Cerchio Famiglia Pro</h4>
            <p className="text-xs text-slate-500 mb-6">
              Sblocca membri illimitati, storico documenti esteso e notifiche WhatsApp automatiche per soli 10 CHF al mese.
            </p>

            <div className="space-y-2 text-left mb-6 text-xs text-slate-700">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Membri e assistenti illimitati</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Storico illimitato di farmaci e turni</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Supporto prioritario in Ticino</span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setShowPremiumModal(false)}
                className="flex-1 h-11 bg-slate-100 text-slate-700 font-semibold rounded-xl text-xs"
              >
                Annulla
              </button>
              <button
                onClick={() => {
                  showToast('Attivazione piano Famiglia simulata con successo!');
                  setShowPremiumModal(false);
                }}
                className="flex-1 h-11 bg-amber-600 text-white font-semibold rounded-xl text-xs shadow-md"
              >
                Abbonati (10 CHF)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
