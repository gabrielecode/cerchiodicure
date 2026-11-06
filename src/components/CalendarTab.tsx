import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Plus, Calendar as CalendarIcon, Clock, CheckCircle2, Circle, User } from 'lucide-react';
import { CareEvent } from '../types';

export const CalendarTab: React.FC = () => {
  const { events, members, addEvent, toggleEventStatus, showToast } = useApp();

  // Get current week days (Mon-Sun)
  const getWeekDays = () => {
    const now = new Date();
    const currentDayOfWeek = now.getDay(); // 0 is Sunday
    const distanceToMon = currentDayOfWeek === 0 ? -6 : 1 - currentDayOfWeek;
    
    const monday = new Date(now);
    monday.setDate(now.getDate() + distanceToMon);

    const days = [];
    const dayNames = ['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom'];

    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      const dateStr = d.toISOString().split('T')[0];
      days.push({
        name: dayNames[i],
        dateNum: d.getDate(),
        dateStr,
        isToday: dateStr === now.toISOString().split('T')[0],
      });
    }
    return days;
  };

  const weekDays = getWeekDays();
  const [selectedDate, setSelectedDate] = useState<string>(weekDays.find((d) => d.isToday)?.dateStr || weekDays[0].dateStr);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CareEvent | null>(null);

  // Form states for adding event
  const [title, setTitle] = useState('');
  const [time, setTime] = useState('10:00');
  const [type, setType] = useState<'turno' | 'appuntamento'>('appuntamento');
  const [memberName, setMemberName] = useState(members[0]?.name || 'Marco');

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      showToast('Inserisci il titolo dell\'evento', 'info');
      return;
    }
    const memberObj = members.find((m) => m.name === memberName);
    addEvent({
      title: title.trim(),
      date: selectedDate,
      time,
      memberName,
      memberAvatar: memberObj?.avatar || '👤',
      type,
      status: 'attesa',
    });
    setTitle('');
    setShowAddModal(false);
  };

  const filteredEvents = events.filter((ev) => ev.date === selectedDate);

  return (
    <div className="w-full px-4 md:px-8 py-6 pb-24 md:pb-12 font-sans">
      <header className="mb-4 bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
        <div>
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Agenda</span>
          <h1 className="text-lg font-bold text-[#2D3748]">Calendario Cura</h1>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="w-10 h-10 rounded-xl bg-[#7BA88A] text-white flex items-center justify-center hover:bg-[#6c987c] transition-all shadow-sm"
          title="Aggiungi evento"
        >
          <Plus className="w-5 h-5" />
        </button>
      </header>

      {/* Horizontal Week Scroller */}
      <div className="grid grid-cols-7 gap-1.5 mb-6 bg-white p-3 rounded-2xl shadow-sm border border-slate-100">
        {weekDays.map((d) => {
          const isSelected = selectedDate === d.dateStr;
          return (
            <button
              key={d.dateStr}
              onClick={() => setSelectedDate(d.dateStr)}
              className={`flex flex-col items-center justify-center py-2.5 rounded-xl transition-all ${
                isSelected
                  ? 'bg-[#7BA88A] text-white shadow-sm'
                  : d.isToday
                  ? 'bg-[#E8F0FE] text-[#7BA88A] font-bold'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <span className="text-[11px] font-medium uppercase">{d.name}</span>
              <span className="text-sm font-bold mt-0.5">{d.dateNum}</span>
            </button>
          );
        })}
      </div>

      {/* Events List for Selected Date */}
      <div className="space-y-3">
        <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-1">
          Eventi del {selectedDate.split('-').reverse().join('/')}
        </h2>

        {filteredEvents.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center border border-slate-100 shadow-sm">
            <CalendarIcon className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-700">Nessun evento in questa data</p>
            <p className="text-xs text-slate-400 mt-1">Clicca sul pulsante + per aggiungerne uno.</p>
          </div>
        ) : (
          filteredEvents.map((ev) => (
            <div
              key={ev.id}
              onClick={() => setSelectedEvent(ev)}
              className={`bg-white rounded-2xl p-4 shadow-sm border transition-all cursor-pointer ${
                ev.status === 'completato' ? 'border-emerald-200 bg-emerald-50/20' : 'border-slate-100'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase ${
                        ev.type === 'turno'
                          ? 'bg-sky-50 text-sky-700 border border-sky-100'
                          : 'bg-purple-50 text-purple-700 border border-purple-100'
                      }`}
                    >
                      {ev.type}
                    </span>
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {ev.time}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-[#2D3748] mb-2">{ev.title}</h3>

                  <div className="flex items-center gap-2 text-xs text-slate-600">
                    <span className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-xs">
                      {ev.memberAvatar || '👤'}
                    </span>
                    <span className="font-medium">{ev.memberName}</span>
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleEventStatus(ev.id);
                  }}
                  className="p-1.5 text-slate-400 hover:text-emerald-600 transition-colors"
                >
                  {ev.status === 'completato' ? (
                    <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                  ) : (
                    <Circle className="w-6 h-6 text-slate-300" />
                  )}
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Event Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl animate-slide-up">
            <h3 className="text-xl font-bold text-[#2D3748] mb-1">Nuovo Evento o Turno</h3>
            <p className="text-xs text-slate-500 mb-6">Pianifica un appuntamento o un turno di assistenza.</p>

            <form onSubmit={handleAddEvent} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1.5">
                  Titolo
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Es. Visita oculista o Turno mattino"
                  className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:border-[#7BA88A] focus:bg-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1.5">
                    Data
                  </label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full h-12 px-3 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:border-[#7BA88A]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1.5">
                    Ora
                  </label>
                  <input
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full h-12 px-3 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:border-[#7BA88A]"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1.5">
                    Tipo
                  </label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as 'turno' | 'appuntamento')}
                    className="w-full h-12 px-3 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:border-[#7BA88A]"
                  >
                    <option value="appuntamento">Appuntamento</option>
                    <option value="turno">Turno assistenza</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1.5">
                    Responsabile
                  </label>
                  <select
                    value={memberName}
                    onChange={(e) => setMemberName(e.target.value)}
                    className="w-full h-12 px-3 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:border-[#7BA88A]"
                  >
                    {members.map((m) => (
                      <option key={m.id} value={m.name}>
                        {m.name} ({m.role})
                      </option>
                    ))}
                  </select>
                </div>
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
                  Salva evento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Event Detail Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl animate-slide-up">
            <span
              className={`text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase inline-block mb-3 ${
                selectedEvent.type === 'turno'
                  ? 'bg-sky-50 text-sky-700 border border-sky-100'
                  : 'bg-purple-50 text-purple-700 border border-purple-100'
              }`}
            >
              {selectedEvent.type}
            </span>
            <h3 className="text-lg font-bold text-[#2D3748] mb-2">{selectedEvent.title}</h3>
            
            <div className="space-y-2 mb-6 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-400">Data e ora</span>
                <span>{selectedEvent.date.split('-').reverse().join('/')} alle {selectedEvent.time}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-400">Assegnato a</span>
                <span className="flex items-center gap-1 font-semibold text-[#2D3748]">
                  {selectedEvent.memberAvatar} {selectedEvent.memberName}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-400">Stato</span>
                <span className={selectedEvent.status === 'completato' ? 'text-emerald-600 font-bold' : 'text-amber-600 font-bold'}>
                  {selectedEvent.status === 'completato' ? 'Completato' : 'In attesa'}
                </span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  toggleEventStatus(selectedEvent.id);
                  setSelectedEvent(null);
                }}
                className={`flex-1 h-11 rounded-xl text-xs font-semibold text-white ${
                  selectedEvent.status === 'completato' ? 'bg-amber-600 hover:bg-amber-700' : 'bg-emerald-600 hover:bg-emerald-700'
                }`}
              >
                {selectedEvent.status === 'completato' ? 'Segna come In Attesa' : 'Segna come Completato'}
              </button>
              <button
                onClick={() => setSelectedEvent(null)}
                className="px-4 h-11 bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold hover:bg-slate-200"
              >
                Chiudi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
