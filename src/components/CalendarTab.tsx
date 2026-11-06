import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Plus, Calendar as CalendarIcon, Clock, CheckCircle2, Circle, User, Activity, ChevronRight } from 'lucide-react';
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
    const dayNames = ['LUN', 'MAR', 'MER', 'GIO', 'VEN', 'SAB', 'DOM'];

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
      showToast('Specificare la natura dell\'intervento', 'info');
      return;
    }
    const memberObj = members.find((m) => m.name === memberName);
    addEvent({
      title: title.trim(),
      date: selectedDate,
      time,
      memberName,
      memberAvatar: memberObj?.avatar || 'U',
      type,
      status: 'attesa',
    });
    setTitle('');
    setShowAddModal(false);
  };

  const filteredEvents = events.filter((ev) => ev.date === selectedDate);

  return (
    <div className="w-full px-4 md:px-8 py-8 pb-24 md:pb-12 font-sans bg-slate-50 min-h-screen">
      <header className="mb-8 bg-white p-6 rounded-lg shadow-sm border border-slate-200 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Activity className="w-4 h-4 text-emerald-700" />
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Schedulazione Hub</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none">Agenda Integrata</h1>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="h-10 px-5 rounded-lg bg-emerald-700 text-white flex items-center justify-center hover:bg-emerald-800 transition-all shadow-md text-[11px] font-black uppercase tracking-widest gap-2"
          title="Nuova pianificazione"
        >
          <Plus className="w-4 h-4" />
          <span>Nuovo Evento</span>
        </button>
      </header>

      {/* Corporate Week Scroller */}
      <div className="grid grid-cols-7 gap-2 mb-8 bg-white p-4 rounded-lg shadow-sm border border-slate-200">
        {weekDays.map((d) => {
          const isSelected = selectedDate === d.dateStr;
          return (
            <button
              key={d.dateStr}
              onClick={() => setSelectedDate(d.dateStr)}
              className={`flex flex-col items-center justify-center py-4 rounded border transition-all ${
                isSelected
                  ? 'bg-emerald-700 border-emerald-800 text-white shadow-md'
                  : d.isToday
                  ? 'bg-emerald-50 border-emerald-100 text-emerald-800 font-black'
                  : 'bg-slate-50 border-slate-100 text-slate-500 hover:bg-slate-100'
              }`}
            >
              <span className="text-[9px] font-black tracking-widest mb-1">{d.name}</span>
              <span className="text-base font-black">{d.dateNum}</span>
            </button>
          );
        })}
      </div>

      {/* Events List for Selected Date */}
      <div className="space-y-4">
        <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1 border-l-2 border-emerald-700 pl-3">
          Pianificazione per il {selectedDate.split('-').reverse().join('/')}
        </h2>

        {filteredEvents.length === 0 ? (
          <div className="bg-white rounded-lg p-12 text-center border border-slate-200 border-dashed shadow-sm">
            <CalendarIcon className="w-12 h-12 text-slate-200 mx-auto mb-4" />
            <p className="text-sm font-black text-slate-800 uppercase tracking-tight">Nessuna attività programmata</p>
            <p className="text-xs text-slate-400 mt-2 font-medium">Il calendario per questa data è attualmente vuoto.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredEvents.map((ev) => (
              <div
                key={ev.id}
                onClick={() => setSelectedEvent(ev)}
                className={`bg-white rounded-lg p-5 shadow-sm border transition-all cursor-pointer hover:border-emerald-300 ${
                  ev.status === 'completato' ? 'border-emerald-200 bg-emerald-50/10' : 'border-slate-200'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      <div className={`text-[9px] font-black px-2 py-0.5 rounded border uppercase tracking-widest ${
                        ev.type === 'turno'
                          ? 'bg-blue-50 text-blue-700 border-blue-100'
                          : 'bg-purple-50 text-purple-700 border-purple-100'
                      }`}>
                        {ev.type}
                      </div>
                      <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase tracking-wider">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{ev.time}</span>
                      </div>
                    </div>

                    <h3 className="text-base font-black text-slate-900 tracking-tight mb-4 leading-tight">{ev.title}</h3>

                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-slate-100 border border-slate-200 flex items-center justify-center text-[10px] font-black text-slate-600">
                        {ev.memberAvatar}
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Responsabile</p>
                        <p className="text-xs font-bold text-slate-700">{ev.memberName}</p>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleEventStatus(ev.id);
                    }}
                    className="p-1 group"
                  >
                    {ev.status === 'completato' ? (
                      <CheckCircle2 className="w-6 h-6 text-emerald-600 shadow-sm rounded-full" />
                    ) : (
                      <Circle className="w-6 h-6 text-slate-200 group-hover:text-emerald-300 transition-colors" />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Event Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white w-full max-w-lg rounded-t-lg sm:rounded-lg p-10 shadow-2xl animate-in slide-in-from-bottom duration-300 border border-slate-200">
            <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-2">Nuova Pianificazione</h3>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-8 border-b border-slate-100 pb-4">Configurazione slot operativo</p>

            <form onSubmit={handleAddEvent} className="space-y-6">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">
                  Oggetto Intervento
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Es. Check-up Medico o Turno Domiciliare"
                  className="w-full h-12 px-5 rounded border border-slate-300 bg-slate-50 text-sm focus:outline-none focus:border-emerald-700 font-bold"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">
                    Data
                  </label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full h-12 px-5 rounded border border-slate-300 bg-slate-50 text-sm focus:outline-none focus:border-emerald-700 font-bold"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">
                    Orario
                  </label>
                  <input
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full h-12 px-5 rounded border border-slate-300 bg-slate-50 text-sm focus:outline-none focus:border-emerald-700 font-bold"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">
                    Tipologia
                  </label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as 'turno' | 'appuntamento')}
                    className="w-full h-12 px-4 rounded border border-slate-300 bg-slate-50 text-sm focus:outline-none focus:border-emerald-700 font-bold"
                  >
                    <option value="appuntamento">Appuntamento</option>
                    <option value="turno">Turno Assistenza</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">
                    Responsabile
                  </label>
                  <select
                    value={memberName}
                    onChange={(e) => setMemberName(e.target.value)}
                    className="w-full h-12 px-4 rounded border border-slate-300 bg-slate-50 text-sm focus:outline-none focus:border-emerald-700 font-bold"
                  >
                    {members.map((m) => (
                      <option key={m.id} value={m.name}>
                        {m.name} ({m.role})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex gap-4 pt-8">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 h-12 bg-white text-slate-500 font-black uppercase tracking-widest rounded border border-slate-200 hover:bg-slate-50 transition-all text-xs"
                >
                  Annulla
                </button>
                <button
                  type="submit"
                  className="flex-1 h-12 bg-emerald-700 text-white font-black uppercase tracking-widest rounded shadow-md text-xs hover:bg-emerald-800 transition-all"
                >
                  Schedula Evento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Event Detail Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-lg p-10 shadow-2xl border border-slate-200">
            <div className="flex items-center gap-2 mb-6">
              <div className={`text-[9px] font-black px-3 py-1 rounded border uppercase tracking-widest ${
                selectedEvent.type === 'turno'
                  ? 'bg-blue-50 text-blue-700 border-blue-100'
                  : 'bg-purple-50 text-purple-700 border-purple-100'
              }`}>
                {selectedEvent.type}
              </div>
            </div>
            
            <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-8 leading-tight">{selectedEvent.title}</h3>
            
            <div className="space-y-4 mb-10 text-xs text-slate-600 bg-slate-50 p-6 rounded-lg border border-slate-200 shadow-inner">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <span className="font-black text-slate-400 uppercase tracking-widest">Cronologia</span>
                <span className="font-bold text-slate-900">{selectedEvent.date.split('-').reverse().join('/')} @ {selectedEvent.time}</span>
              </div>
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <span className="font-black text-slate-400 uppercase tracking-widest">Incaricato</span>
                <span className="flex items-center gap-2 font-bold text-slate-900 uppercase tracking-tight">
                  <div className="w-5 h-5 rounded bg-white border border-slate-300 flex items-center justify-center text-[8px]">{selectedEvent.memberAvatar}</div>
                  {selectedEvent.memberName}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-black text-slate-400 uppercase tracking-widest">Status Hub</span>
                <div className={`text-[10px] font-black px-2 py-0.5 rounded border uppercase tracking-widest ${
                  selectedEvent.status === 'completato' ? 'bg-emerald-50 text-emerald-800 border-emerald-100' : 'bg-slate-200 text-slate-600 border-slate-300'
                }`}>
                  {selectedEvent.status}
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <button
                onClick={() => {
                  toggleEventStatus(selectedEvent.id);
                  setSelectedEvent(null);
                }}
                className={`w-full h-12 rounded-lg text-xs font-black uppercase tracking-widest text-white shadow-md transition-all ${
                  selectedEvent.status === 'completato' ? 'bg-orange-600 hover:bg-orange-700' : 'bg-emerald-700 hover:bg-emerald-800'
                }`}
              >
                {selectedEvent.status === 'completato' ? 'Annulla Validazione' : 'Convalida Intervento'}
              </button>
              <button
                onClick={() => setSelectedEvent(null)}
                className="w-full h-12 bg-white text-slate-500 font-black uppercase tracking-widest rounded border border-slate-200 hover:bg-slate-50 transition-all text-xs"
              >
                Chiudi Modulo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
