import React from 'react';
import { useApp } from '../context/AppContext';
import { X, PhoneCall, AlertTriangle, ShieldAlert, HeartPulse, Building2, UserCheck } from 'lucide-react';

interface EmergencyModalProps {
  onClose: () => void;
}

export const EmergencyModal: React.FC<EmergencyModalProps> = ({ onClose }) => {
  const { addPost, showToast, profile } = useApp();

  const emergencyContacts = [
    {
      title: 'Ambulanza / Emergenza Sanitaria',
      subtitle: 'Canton Ticino (24/7)',
      number: '144',
      icon: HeartPulse,
      color: 'bg-red-50 text-red-600 border-red-200',
      btnColor: 'bg-red-600 hover:bg-red-700 text-white',
    },
    {
      title: 'Polizia Cantonale',
      subtitle: 'Emergenza generale',
      number: '117',
      icon: ShieldAlert,
      color: 'bg-amber-50 text-amber-700 border-amber-200',
      btnColor: 'bg-amber-600 hover:bg-amber-700 text-white',
    },
    {
      title: 'Spitex Ticino (Assistenza Domiciliare)',
      subtitle: 'Coordinamento infermieristico',
      number: '+41918255000',
      displayNumber: '+41 91 825 50 00',
      icon: Building2,
      color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      btnColor: 'bg-[#7BA88A] hover:bg-[#6c987c] text-white',
    },
    {
      title: 'Medico Curante (Dr. Rossi)',
      subtitle: 'Studio medico di famiglia',
      number: '+41918001234',
      displayNumber: '+41 91 800 12 34',
      icon: UserCheck,
      color: 'bg-blue-50 text-blue-700 border-blue-200',
      btnColor: 'bg-blue-600 hover:bg-blue-700 text-white',
    },
    {
      title: 'Marco (Figlio / Admin)',
      subtitle: 'Referente principale del cerchio',
      number: '+41791234567',
      displayNumber: '+41 79 123 45 67',
      icon: PhoneCall,
      color: 'bg-slate-50 text-slate-700 border-slate-200',
      btnColor: 'bg-slate-800 hover:bg-slate-900 text-white',
    },
  ];

  const handleSosBroadcast = () => {
    const userName = profile?.userName || 'Famigliare';
    addPost(`🚨 ALLARME SOS EMERGENZA attivato da ${userName}! Richiesto intervento immediato nel cerchio di ${profile?.recipientName || 'Nonna Rosa'}.`, 'note', false);
    showToast('Allarme SOS inviato a tutti i membri del cerchio!', 'info');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-60 bg-slate-900/70 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in">
      <div className="bg-white w-full max-w-lg rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center animate-pulse">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-slate-900">Contatti di Emergenza SOS</h2>
              <p className="text-xs text-slate-500">Cura di {profile?.recipientName || 'Nonna Rosa'} • Ticino</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* SOS Broadcast Banner */}
        <div className="bg-red-500 text-white rounded-2xl p-4 mb-6 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-sm">Richiesta Aiuto Urgente</h3>
            <p className="text-xs text-red-100">Invia una notifica d'emergenza immediata sulla Timeline a tutti i membri del cerchio.</p>
          </div>
          <button
            onClick={handleSosBroadcast}
            className="w-full sm:w-auto px-5 py-2.5 bg-white text-red-600 font-extrabold rounded-xl text-xs hover:bg-red-50 transition-all shadow-sm whitespace-nowrap active:scale-95"
          >
            🚨 Invia SOS Timeline
          </button>
        </div>

        {/* Contacts List */}
        <div className="space-y-3 mb-6">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Numeri rapidi Ticino & Medici</h3>
          {emergencyContacts.map((contact, idx) => {
            const Icon = contact.icon;
            return (
              <div
                key={idx}
                className={`p-4 rounded-2xl border ${contact.color} flex items-center justify-between gap-3 shadow-2xs`}
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-xl bg-white shadow-xs flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{contact.title}</h4>
                    <p className="text-[11px] text-slate-600">{contact.subtitle}</p>
                    <p className="text-xs font-mono font-bold mt-0.5 text-slate-800">{contact.displayNumber || contact.number}</p>
                  </div>
                </div>

                <a
                  href={`tel:${contact.number}`}
                  className={`px-4 py-2.5 rounded-xl font-bold text-xs shadow-sm transition-all flex items-center gap-2 whitespace-nowrap ${contact.btnColor}`}
                >
                  <PhoneCall className="w-4 h-4" />
                  <span>Chiama</span>
                </a>
              </div>
            );
          })}
        </div>

        {/* Footer Note */}
        <div className="p-3 bg-slate-50 rounded-2xl text-[11px] text-slate-500 text-center">
          🇨🇭 In caso di pericolo di vita imminente, comporre direttamente il numero unico di soccorso <strong>144</strong>.
        </div>
      </div>
    </div>
  );
};
