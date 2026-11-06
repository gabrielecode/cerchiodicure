import React from 'react';
import { useApp } from '../context/AppContext';
import { X, PhoneCall, AlertTriangle, ShieldAlert, HeartPulse, Building2, UserCheck, Activity, ShieldCheck } from 'lucide-react';

interface EmergencyModalProps {
  onClose: () => void;
}

export const EmergencyModal: React.FC<EmergencyModalProps> = ({ onClose }) => {
  const { addPost, showToast, profile } = useApp();

  const emergencyContacts = [
    {
      title: 'Centrale Soccorso Sanitario',
      subtitle: 'Emergenza Ticino (24h)',
      number: '144',
      icon: HeartPulse,
      color: 'bg-red-50 text-red-700 border-red-100',
      btnColor: 'bg-red-700 hover:bg-red-800 text-white',
    },
    {
      title: 'Polizia Cantonale',
      subtitle: 'Ordine e Sicurezza Pubblica',
      number: '117',
      icon: ShieldAlert,
      color: 'bg-slate-50 text-slate-700 border-slate-200',
      btnColor: 'bg-slate-800 hover:bg-slate-900 text-white',
    },
    {
      title: 'Servizio Spitex Regionale',
      subtitle: 'Coordinamento Assistenza',
      number: '+41918255000',
      displayNumber: '+41 91 825 50 00',
      icon: Building2,
      color: 'bg-emerald-50 text-emerald-800 border-emerald-100',
      btnColor: 'bg-emerald-700 hover:bg-emerald-800 text-white',
    },
    {
      title: 'Medico di Famiglia (Referente)',
      subtitle: 'Studio Dr. Rossi',
      number: '+41918001234',
      displayNumber: '+41 91 800 12 34',
      icon: UserCheck,
      color: 'bg-blue-50 text-blue-800 border-blue-100',
      btnColor: 'bg-blue-700 hover:bg-blue-800 text-white',
    },
    {
      title: 'Marco (Amministratore Hub)',
      subtitle: 'Primo Contatto Familiare',
      number: '+41791234567',
      displayNumber: '+41 79 123 45 67',
      icon: PhoneCall,
      color: 'bg-white text-slate-700 border-slate-200',
      btnColor: 'bg-slate-100 text-slate-900 border-slate-300 hover:bg-slate-200',
    },
  ];

  const handleSosBroadcast = () => {
    const userName = profile?.userName || 'Operatore';
    addPost(`ATTENZIONE: ALLARME SOS EMERGENZA attivato da ${userName}. È richiesto intervento immediato presso il domicilio di ${profile?.recipientName || 'Rosa Rossi'}. Protocollo di emergenza attivato.`, 'note', false);
    showToast('PROTOCOLLO SOS: Notifica inviata a tutti i membri del team Hub.', 'info');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-60 bg-slate-950/80 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white w-full max-w-xl rounded-t-lg sm:rounded-lg shadow-2xl max-h-[90vh] overflow-y-auto border border-slate-200">
        {/* Corporate Header */}
        <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded bg-red-700 text-white flex items-center justify-center shadow-lg">
              <AlertTriangle className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Activity className="w-3.5 h-3.5 text-red-700" />
                <span className="text-[9px] font-black text-red-800 uppercase tracking-[0.2em]">Emergency Protocol</span>
              </div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">Centro Emergenze</h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded border border-slate-200 bg-white flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-8">
          {/* SOS Broadcast Panel */}
          <div className="bg-red-700 text-white rounded-lg p-6 mb-10 shadow-xl border border-red-800 flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform duration-700">
              <ShieldAlert className="w-24 h-24" />
            </div>
            <div className="relative z-10">
              <h3 className="font-black text-base uppercase tracking-widest mb-1">Hub Broadcast SOS</h3>
              <p className="text-xs text-red-100 font-bold opacity-80 uppercase tracking-tight">Invia segnale di emergenza certificato a tutto il team.</p>
            </div>
            <button
              onClick={handleSosBroadcast}
              className="relative z-10 w-full sm:w-auto px-8 h-12 bg-white text-red-700 font-black uppercase tracking-widest rounded shadow-lg hover:bg-red-50 transition-all active:scale-95 text-xs"
            >
              Attiva Protocollo SOS
            </button>
          </div>

          {/* Contacts Directory */}
          <div className="space-y-3">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4 px-1">Directory Telefonica Critica</h3>
            <div className="grid gap-3">
              {emergencyContacts.map((contact, idx) => {
                const Icon = contact.icon;
                return (
                  <div
                    key={idx}
                    className={`p-5 rounded border transition-all ${contact.color} flex items-center justify-between gap-6 hover:shadow-md group`}
                  >
                    <div className="flex items-center gap-5">
                      <div className="w-12 h-12 rounded bg-white shadow-sm flex items-center justify-center shrink-0 border border-slate-100 group-hover:border-slate-300 transition-all">
                        <Icon className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight leading-tight mb-1">{contact.title}</h4>
                        <p className="text-[10px] font-bold uppercase tracking-wider opacity-70 mb-1">{contact.subtitle}</p>
                        <p className="text-sm font-mono font-black text-slate-900">{contact.displayNumber || contact.number}</p>
                      </div>
                    </div>

                    <a
                      href={`tel:${contact.number}`}
                      className={`h-11 px-6 rounded text-[10px] font-black uppercase tracking-[0.2em] shadow-sm transition-all flex items-center gap-2 whitespace-nowrap ${contact.btnColor}`}
                    >
                      <PhoneCall className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Call</span>
                    </a>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Security Footer */}
          <div className="mt-10 p-5 bg-slate-50 rounded border border-slate-100 flex items-center gap-4">
            <ShieldCheck className="w-6 h-6 text-emerald-600 shrink-0" />
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-relaxed">
              In caso di pericolo immediato, attivare preventivamente i soccorsi cantonali (144) prima di procedere con il broadcast nell'Hub.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
