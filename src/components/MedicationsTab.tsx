import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Plus, Pill, CheckSquare, Square, User, Clock, Bell, Activity } from 'lucide-react';
import { Medication } from '../types';
import { formatDateToLocale } from '../lib/date';

export const MedicationsTab: React.FC = () => {
  const { medications, members, addMedication, toggleMedicationDose, showToast, profile } = useApp();

  const [showAddModal, setShowAddModal] = useState(false);
  const [name, setName] = useState('');
  const [dosage, setDosage] = useState('');
  const [timesStr, setTimesStr] = useState('08:00, 20:00');
  const [responsible, setResponsible] = useState(members[0]?.name || 'Marco');

  const todayStr = formatDateToLocale(new Date());

  const handleAddMedication = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !dosage.trim()) {
      showToast('Inserire denominazione e posologia del farmaco', 'info');
      return;
    }

    const times = timesStr
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    if (times.length === 0) {
      showToast('Inserire almeno un orario di somministrazione', 'info');
      return;
    }

    addMedication({
      name: name.trim(),
      dosage: dosage.trim(),
      times,
      responsible,
    });

    setName('');
    setDosage('');
    setShowAddModal(false);
  };

  return (
    <div className="w-full px-4 md:px-8 py-8 pb-24 md:pb-12 font-sans bg-slate-50 dark:bg-slate-950 min-h-screen transition-colors duration-300">
      <header className="mb-8 bg-white dark:bg-slate-900 p-6 rounded-lg shadow-sm border border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Activity className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
            <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Medical Protocol</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight leading-none">Protocollo Farmacologico</h1>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              if (medications.length > 0) {
                const med = medications[0];
                showToast(`NOTIFICA SISTEMA: Somministrazione necessaria - ${med.name} (${med.dosage}) per ${profile?.recipientName || 'Rosa Rossi'}. Responsabile: ${med.responsible}.`, 'info');
              } else {
                showToast('Nessuna terapia attiva registrata.', 'info');
              }
            }}
            className="px-4 h-10 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 text-[11px] font-black uppercase tracking-wider hover:bg-slate-100 dark:hover:bg-slate-700 transition-all flex items-center gap-2 shadow-sm"
            title="Test push notification system"
          >
            <Bell className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
            <span className="hidden sm:inline">Push Test</span>
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="h-10 px-5 rounded-lg bg-emerald-700 text-white flex items-center justify-center hover:bg-emerald-800 transition-all shadow-md text-[11px] font-black uppercase tracking-widest gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Aggiungi Farmaco</span>
          </button>
        </div>
      </header>

      {/* Medications List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {medications.map((med) => {
          const memberObj = members.find((m) => m.name === med.responsible);
          return (
            <div
              key={med.id}
              className="bg-white dark:bg-slate-900 rounded-lg p-6 shadow-sm border border-slate-200 dark:border-slate-800 transition-all hover:border-emerald-200 dark:hover:border-emerald-700"
            >
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-100 dark:border-emerald-800 shadow-inner">
                    <Pill className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-slate-900 dark:text-slate-100 uppercase tracking-tight leading-none mb-1.5">{med.name}</h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">Dosaggio: {med.dosage}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-[10px] font-black text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 rounded border border-slate-100 dark:border-slate-700 uppercase tracking-wider">
                  <span className="w-5 h-5 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-[8px]">{memberObj?.avatar || 'U'}</span>
                  <span>{med.responsible}</span>
                </div>
              </div>

              {/* Time Slots & Checkboxes */}
              <div className="border-t border-slate-50 dark:border-slate-800 pt-5">
                <div className="flex items-center gap-2 mb-4">
                  <Clock className="w-3 h-3 text-slate-400 dark:text-slate-500" />
                  <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">
                    Orari Schedulati:
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {med.times.map((timeSlot) => {
                    const key = `${todayStr}_${timeSlot}`;
                    const isChecked = !!med.checks[key];
                    return (
                      <button
                        key={timeSlot}
                        onClick={() => toggleMedicationDose(med.id, timeSlot, todayStr)}
                        className={`flex items-center justify-between px-4 py-3 rounded border text-[11px] font-black uppercase tracking-widest transition-all ${
                          isChecked
                            ? 'bg-emerald-50 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800 shadow-inner'
                            : 'bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
                        }`}
                      >
                        <span>{timeSlot}</span>
                        {isChecked ? (
                          <CheckSquare className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
                        ) : (
                          <Square className="w-4 h-4 text-slate-200 dark:text-slate-700" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Medication Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-t-lg sm:rounded-lg p-10 shadow-2xl animate-in slide-in-from-bottom duration-300 border border-slate-200 dark:border-slate-800">
            <h3 className="text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight mb-2">Protocollo Terapeutico</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider mb-8 border-b border-slate-100 dark:border-slate-800 pb-4">Configurazione nuova unità farmacologica</p>

            <form onSubmit={handleAddMedication} className="space-y-6">
              <div>
                <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-2">
                  Denominazione Farmaco
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Es. Tachipirina 500mg"
                  className="w-full h-12 px-5 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none focus:border-emerald-700 dark:focus:border-emerald-500 dark:text-slate-100 font-bold"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-2">
                    Posologia
                  </label>
                  <input
                    type="text"
                    value={dosage}
                    onChange={(e) => setDosage(e.target.value)}
                    placeholder="Es. 1 compressa"
                    className="w-full h-12 px-5 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none focus:border-emerald-700 dark:focus:border-emerald-500 dark:text-slate-100"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-2">
                    Orari (CSV)
                  </label>
                  <input
                    type="text"
                    value={timesStr}
                    onChange={(e) => setTimesStr(e.target.value)}
                    placeholder="08:00, 20:00"
                    className="w-full h-12 px-5 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-mono font-bold focus:outline-none focus:border-emerald-700 dark:focus:border-emerald-500 dark:text-slate-100"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-2">
                  Responsabile Operativo
                </label>
                <select
                  value={responsible}
                  onChange={(e) => setResponsible(e.target.value)}
                  className="w-full h-12 px-4 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none focus:border-emerald-700 dark:focus:border-emerald-500 dark:text-slate-100 appearance-none font-bold"
                >
                  {members.map((m) => (
                    <option key={m.id} value={m.name}>
                      {m.name} ({m.role})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-4 pt-8">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 h-12 bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-black uppercase tracking-widest rounded border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all text-xs"
                >
                  Annulla
                </button>
                <button
                  type="submit"
                  className="flex-1 h-12 bg-emerald-700 text-white font-black uppercase tracking-widest rounded shadow-md text-xs hover:bg-emerald-800 transition-all"
                >
                  Registra Farmaco
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
