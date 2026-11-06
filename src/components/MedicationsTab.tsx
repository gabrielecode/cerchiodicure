import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Plus, Pill, CheckSquare, Square, User, Clock } from 'lucide-react';
import { Medication } from '../types';

export const MedicationsTab: React.FC = () => {
  const { medications, members, addMedication, toggleMedicationDose, showToast, profile } = useApp();

  const [showAddModal, setShowAddModal] = useState(false);
  const [name, setName] = useState('');
  const [dosage, setDosage] = useState('');
  const [timesStr, setTimesStr] = useState('08:00, 20:00');
  const [responsible, setResponsible] = useState(members[0]?.name || 'Marco');

  const todayStr = new Date().toISOString().split('T')[0];

  const handleAddMedication = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !dosage.trim()) {
      showToast('Inserisci nome e dosaggio del farmaco', 'info');
      return;
    }

    const times = timesStr
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    if (times.length === 0) {
      showToast('Inserisci almeno un orario', 'info');
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
    <div className="w-full px-4 md:px-8 py-6 pb-24 md:pb-12 font-sans">
      <header className="mb-6 bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
        <div>
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Terapia Giornaliera</span>
          <h1 className="text-lg font-bold text-[#2D3748]">Gestione Farmaci</h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              if (medications.length > 0) {
                const med = medications[0];
                showToast(`⏰ NOTIFICA PUSH TERAPIA: È l'ora di assumere ${med.name} (${med.dosage}) per ${profile?.recipientName || 'Nonna Rosa'}! Responsabile: ${med.responsible}.`, 'info');
              } else {
                showToast('Nessun farmaco registrato.', 'info');
              }
            }}
            className="px-3 h-10 rounded-xl bg-amber-100 text-amber-800 text-xs font-bold hover:bg-amber-200 transition-all flex items-center gap-1.5 shadow-2xs"
            title="Simula notifica push farmaco"
          >
            <span>🔔 Simula Push</span>
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="w-10 h-10 rounded-xl bg-[#7BA88A] text-white flex items-center justify-center hover:bg-[#6c987c] transition-all shadow-sm"
            title="Aggiungi farmaco"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Medications List */}
      <div className="space-y-4">
        {medications.map((med) => {
          const memberObj = members.find((m) => m.name === med.responsible);
          return (
            <div
              key={med.id}
              className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
                    <Pill className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#2D3748]">{med.name}</h3>
                    <p className="text-xs text-slate-500">{med.dosage}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-slate-600 bg-slate-50 px-2.5 py-1 rounded-xl border border-slate-100">
                  <span>{memberObj?.avatar || '👤'}</span>
                  <span className="font-semibold">{med.responsible}</span>
                </div>
              </div>

              {/* Time Slots & Checkboxes */}
              <div className="border-t border-slate-100 pt-3 flex flex-wrap gap-2 items-center">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mr-1">
                  Orari:
                </span>
                {med.times.map((timeSlot) => {
                  const key = `${todayStr}_${timeSlot}`;
                  const isChecked = !!med.checks[key];
                  return (
                    <button
                      key={timeSlot}
                      onClick={() => toggleMedicationDose(med.id, timeSlot, todayStr)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
                        isChecked
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200 shadow-xs'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {isChecked ? (
                        <CheckSquare className="w-4 h-4 text-emerald-600 shrink-0" />
                      ) : (
                        <Square className="w-4 h-4 text-slate-400 shrink-0" />
                      )}
                      <span>{timeSlot}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Medication Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl animate-slide-up">
            <h3 className="text-xl font-bold text-[#2D3748] mb-1">Aggiungi Farmaco</h3>
            <p className="text-xs text-slate-500 mb-6">Configura nome, dosaggio e orari giornalieri.</p>

            <form onSubmit={handleAddMedication} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1.5">
                  Nome del farmaco
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Es. Tachipirina 500mg"
                  className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:border-[#7BA88A]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1.5">
                  Dosaggio
                </label>
                <input
                  type="text"
                  value={dosage}
                  onChange={(e) => setDosage(e.target.value)}
                  placeholder="Es. 1 compressa o 10 gocce"
                  className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:border-[#7BA88A]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1.5">
                  Orari (separati da virgola)
                </label>
                <input
                  type="text"
                  value={timesStr}
                  onChange={(e) => setTimesStr(e.target.value)}
                  placeholder="Es. 08:00, 14:00, 20:00"
                  className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:border-[#7BA88A]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1.5">
                  Responsabile principale
                </label>
                <select
                  value={responsible}
                  onChange={(e) => setResponsible(e.target.value)}
                  className="w-full h-12 px-3 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:border-[#7BA88A]"
                >
                  {members.map((m) => (
                    <option key={m.id} value={m.name}>
                      {m.name} ({m.role})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 h-12 bg-slate-100 text-slate-700 font-semibold rounded-xl text-sm"
                >
                  Annulla
                </button>
                <button
                  type="submit"
                  className="flex-1 h-12 bg-[#7BA88A] text-white font-semibold rounded-xl shadow-md text-sm hover:bg-[#6c987c]"
                >
                  Salva farmaco
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
