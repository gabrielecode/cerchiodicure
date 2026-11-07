import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Settings, 
  Mic, 
  Camera, 
  Send, 
  Pill, 
  Calendar as CalendarIcon, 
  FileText, 
  Utensils, 
  Image as ImageIcon, 
  CheckCircle2, 
  Clock, 
  Users, 
  ShieldAlert,
  MoreVertical,
  Activity,
  ChevronRight,
  User
} from 'lucide-react';
import { SettingsModal } from './SettingsModal';
import { PostType } from '../types';

export const TimelineTab: React.FC = () => {
  const { profile, members, posts, events, medications, addPost, toggleMedicationDose, showToast, setActiveTab } = useApp();
  const [showSettings, setShowSettings] = useState(false);
  const [inputText, setInputText] = useState('');
  const [inputType, setInputType] = useState<PostType>('note');
  const [attachedImage, setAttachedImage] = useState<string | null>(null);

  const handlePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() && !attachedImage) return;

    addPost(inputText.trim() || 'Aggiornamento media condiviso', inputType, inputType === 'pill', attachedImage || undefined);
    setInputText('');
    setAttachedImage(null);
    setInputType('note');
  };

  const handleMicClick = () => {
    showToast('Modulo di acquisizione vocale in attesa di configurazione', 'info');
  };

  const handleCameraMock = () => {
    const mockPhotos = [
      'https://images.unsplash.com/photo-1516307365426-fea591f28e46?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=600&q=80',
    ];
    const chosen = mockPhotos[Math.floor(Math.random() * mockPhotos.length)];
    setAttachedImage(chosen);
    setInputType('photo');
    showToast('Documentazione fotografica allegata');
  };

  const getTypeIcon = (type: PostType) => {
    switch (type) {
      case 'pill':
        return <Pill className="w-4 h-4 text-emerald-700" />;
      case 'calendar':
        return <CalendarIcon className="w-4 h-4 text-blue-700" />;
      case 'food':
        return <Utensils className="w-4 h-4 text-orange-700" />;
      case 'photo':
        return <ImageIcon className="w-4 h-4 text-slate-700" />;
      default:
        return <FileText className="w-4 h-4 text-slate-700" />;
    }
  };

  const todayStr = new Date().toISOString().split('T')[0];
  const todayEvents = events.filter((ev) => ev.date === todayStr);

  return (
    <div className="w-full px-4 md:px-8 py-8 pb-32 md:pb-12 font-sans bg-slate-50 dark:bg-slate-950 min-h-screen transition-colors duration-300">
      {/* Mobile Top Header */}
      <div className="flex md:hidden items-center justify-between mb-8 bg-white dark:bg-slate-900 p-5 rounded-lg shadow-sm border border-slate-200 dark:border-slate-800">
        <div>
          <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Care Profile</span>
          <h1 className="text-xl font-black text-slate-900 dark:text-slate-100 tracking-tight">{profile?.recipientName || 'Rosa Rossi'}</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex -space-x-2">
            {members.slice(0, 3).map((m) => (
              <span key={m.id} className="w-8 h-8 rounded bg-slate-100 dark:bg-slate-800 border-2 border-white dark:border-slate-900 text-[10px] font-bold flex items-center justify-center text-slate-600 dark:text-slate-400 shadow-sm">
                {m.avatar}
              </span>
            ))}
          </div>
          <button
            onClick={() => setShowSettings(true)}
            className="w-10 h-10 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-400 dark:text-slate-500"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Corporate Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left / Center Column: Feed & Composer (Span 8 on desktop) */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Desktop Dashboard Header */}
          <div className="hidden md:flex items-center justify-between bg-white dark:bg-slate-900 p-8 rounded-lg shadow-sm border border-slate-200 dark:border-slate-800">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-5 h-5 rounded bg-emerald-700 flex items-center justify-center">
                  <Activity className="w-3 h-3 text-white" />
                </div>
                <span className="text-[10px] font-black text-emerald-800 dark:text-emerald-400 uppercase tracking-[0.2em]">Control Center</span>
              </div>
              <h1 className="text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight leading-none">Gestione Assistenza: {profile?.recipientName || 'Rosa Rossi'}</h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 font-medium">Log operativo sincronizzato tra caregiver e familiari.</p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowSettings(true)}
                className="px-5 py-2.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-[11px] font-black uppercase tracking-wider flex items-center gap-2 transition-all shadow-sm"
              >
                <Settings className="w-4 h-4 text-slate-400" />
                <span>Configurazione Hub</span>
              </button>
            </div>
          </div>

          {/* Desktop Post Composer */}
          <div className="hidden md:block bg-white dark:bg-slate-900 rounded-lg p-8 shadow-sm border border-slate-200 dark:border-slate-800">
            <h3 className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-6">Nuovo Aggiornamento Log</h3>
            {attachedImage && (
              <div className="flex items-center justify-between mb-4 p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border border-emerald-100 dark:border-emerald-800 text-[11px] font-bold text-emerald-800 dark:text-emerald-400 uppercase tracking-wider">
                <span className="flex items-center gap-2">📷 Media pronto per la pubblicazione</span>
                <button onClick={() => setAttachedImage(null)} className="text-red-700 dark:text-red-400 hover:underline">Elimina</button>
              </div>
            )}
            <form onSubmit={handlePostSubmit} className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="relative w-48">
                  <select
                    value={inputType}
                    onChange={(e) => setInputType(e.target.value as PostType)}
                    className="w-full h-12 pl-4 pr-10 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-[11px] font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 focus:outline-none focus:border-emerald-700 dark:focus:border-emerald-500 appearance-none"
                  >
                    <option value="note">Nota Operativa</option>
                    <option value="pill">Terapia</option>
                    <option value="calendar">Visita Medica</option>
                    <option value="food">Pasto</option>
                    <option value="photo">Documentazione</option>
                  </select>
                  <ChevronRight className="absolute right-3 top-4 w-4 h-4 text-slate-400 rotate-90" />
                </div>

                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Inserire dettagli sull'intervento o stato attuale..."
                  className="flex-1 h-12 px-5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none focus:border-emerald-700 dark:focus:border-emerald-500 focus:bg-white dark:focus:bg-slate-900 dark:text-slate-100 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600"
                />
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handleMicClick}
                    className="h-10 px-4 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-[11px] font-bold uppercase tracking-wider flex items-center gap-2 transition-colors"
                  >
                    <Mic className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                    <span>Dettatura</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleCameraMock}
                    className="h-10 px-4 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-[11px] font-bold uppercase tracking-wider flex items-center gap-2 transition-colors"
                  >
                    <Camera className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                    <span>Allegato</span>
                  </button>
                </div>

                <button
                  type="submit"
                  className="h-10 px-8 bg-emerald-700 hover:bg-emerald-800 text-white font-black uppercase tracking-widest rounded-lg text-[11px] shadow-sm transition-all flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Pubblica Log</span>
                </button>
              </div>
            </form>
          </div>

          {/* Timeline Feed */}
          <div className="space-y-6">
            <h2 className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] px-1">Registro Attività Recenti</h2>
            {posts.map((post) => (
              <article key={post.id} className="bg-white dark:bg-slate-900 rounded-lg p-6 shadow-sm border border-slate-200 dark:border-slate-800 transition-all hover:border-emerald-200 dark:hover:border-emerald-700 group">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xs font-black text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                      {post.authorAvatar || 'U'}
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-slate-900 dark:text-slate-100 leading-none">{post.authorName}</h3>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider mt-1">{post.timestamp}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded border border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
                      {getTypeIcon(post.type)}
                    </div>
                    {post.completed && (
                      <div className="flex items-center gap-1.5 text-[10px] font-black text-emerald-800 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-3 py-1 rounded border border-emerald-100 dark:border-emerald-800 uppercase tracking-wider">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Validato</span>
                      </div>
                    )}
                    <button className="p-1 text-slate-300 dark:text-slate-600 hover:text-slate-500 dark:hover:text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="pl-14">
                  <p className="text-sm lg:text-base text-slate-700 dark:text-slate-300 leading-relaxed mb-4">{post.text}</p>

                  {post.imageUrl && (
                    <div className="rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 max-h-80 shadow-inner">
                      <img src={post.imageUrl} alt="Documentazione Visiva" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* Right Column: Corporate Widgets (Span 4 on desktop) */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* Care Team Widget */}
          <div className="bg-white dark:bg-slate-900 rounded-lg p-6 shadow-sm border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-[11px] font-black text-slate-900 dark:text-slate-100 uppercase tracking-[0.2em] flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
                <span>Team Hub ({members.length})</span>
              </h3>
            </div>
            <div className="space-y-3">
              {members.map((m) => (
                <div key={m.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-50/50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-white dark:bg-slate-900 shadow-sm flex items-center justify-center text-[10px] font-black text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">{m.avatar}</div>
                    <div>
                      <p className="text-xs font-black text-slate-900 dark:text-slate-100 leading-none">{m.name}</p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold mt-1 uppercase tracking-wider">{m.role}</p>
                    </div>
                  </div>
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                </div>
              ))}
            </div>
          </div>

          {/* Critical Items: Medications Quick List */}
          <div className="bg-white dark:bg-slate-900 rounded-lg p-6 shadow-sm border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-[11px] font-black text-slate-900 dark:text-slate-100 uppercase tracking-[0.2em] flex items-center gap-2">
                <Pill className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
                <span>Status Farmacologico</span>
              </h3>
              <button onClick={() => setActiveTab('farmaci')} className="text-[10px] font-black text-emerald-700 dark:text-emerald-400 hover:underline uppercase tracking-wider">
                Log completo
              </button>
            </div>
            <div className="space-y-4">
              {medications.map((med) => (
                <div key={med.id} className="p-4 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-4 shadow-xs">
                  <div>
                    <p className="text-xs font-black text-slate-900 dark:text-slate-100 uppercase tracking-wider mb-1">{med.name}</p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">Dose: {med.dosage} · Resp: {med.responsible}</p>
                  </div>
                  <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-50 dark:border-slate-700">
                    {med.times.map((slot) => {
                      const key = `${todayStr}_${slot}`;
                      const isTaken = !!med.checks[key];
                      return (
                        <button
                          key={slot}
                          onClick={() => toggleMedicationDose(med.id, slot, todayStr)}
                          className={`h-8 px-3 rounded text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${
                            isTaken
                              ? 'bg-emerald-700 text-white shadow-sm'
                              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800'
                          }`}
                        >
                          <CheckCircle2 className={`w-3.5 h-3.5 ${isTaken ? 'text-white' : 'text-slate-300 dark:text-slate-600'}`} />
                          <span>{slot}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Agenda Today */}
          <div className="bg-white dark:bg-slate-900 rounded-lg p-6 shadow-sm border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-[11px] font-black text-slate-900 dark:text-slate-100 uppercase tracking-[0.2em] flex items-center gap-2">
                <CalendarIcon className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
                <span>Pianificazione Odierna</span>
              </h3>
              <button onClick={() => setActiveTab('calendario')} className="text-[10px] font-black text-emerald-700 dark:text-emerald-400 hover:underline uppercase tracking-wider">
                Full View
              </button>
            </div>
            {todayEvents.length === 0 ? (
              <p className="text-[11px] text-slate-400 dark:text-slate-500 font-bold text-center py-6 uppercase tracking-widest">Nessun evento schedulato</p>
            ) : (
              <div className="space-y-3">
                {todayEvents.map((ev) => (
                  <div key={ev.id} className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between transition-colors hover:border-emerald-200 dark:hover:border-emerald-600">
                    <div>
                      <p className="text-xs font-black text-slate-900 dark:text-slate-100 leading-none mb-1.5">{ev.title}</p>
                      <div className="flex items-center gap-3 text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {ev.time}</span>
                        <span className="flex items-center gap-1"><User className="w-3 h-3" /> {ev.memberName}</span>
                      </div>
                    </div>
                    <div className={`text-[9px] font-black px-2 py-0.5 rounded border uppercase tracking-widest ${
                      ev.status === 'completato' ? 'bg-emerald-50 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-400 border-emerald-100 dark:border-emerald-800' : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-600'
                    }`}>
                      {ev.status}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>

      {/* Mobile Fixed bottom input */}
      <div className="fixed md:hidden bottom-16 left-0 right-0 p-4 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 z-30 shadow-2xl">
        {attachedImage && (
          <div className="flex items-center justify-between mb-3 p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border border-emerald-100 dark:border-emerald-800 text-[10px] font-black uppercase tracking-wider text-emerald-800 dark:text-emerald-400">
            <span className="truncate">📷 Documentazione allegata</span>
            <button onClick={() => setAttachedImage(null)} className="text-red-700 dark:text-red-400">Rimuovi</button>
          </div>
        )}

        <form onSubmit={handlePostSubmit} className="flex items-center gap-2">
          <div className="relative">
            <select
              value={inputType}
              onChange={(e) => setInputType(e.target.value as PostType)}
              className="h-12 w-24 pl-3 pr-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-[10px] font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 focus:outline-none focus:border-emerald-700 dark:focus:border-emerald-500 appearance-none"
            >
              <option value="note">Log</option>
              <option value="pill">Pill</option>
              <option value="calendar">Doc</option>
              <option value="food">Eat</option>
              <option value="photo">Img</option>
            </select>
          </div>

          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Dettagli log..."
            className="flex-1 h-12 px-4 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none focus:border-emerald-700 dark:focus:border-emerald-500 dark:text-slate-100"
          />

          <button type="button" onClick={handleCameraMock} className="w-12 h-12 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-400">
            <Camera className="w-5 h-5" />
          </button>

          <button type="submit" className="w-12 h-12 bg-emerald-700 text-white rounded-lg flex items-center justify-center shadow-md">
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>

      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
    </div>
  );
};
