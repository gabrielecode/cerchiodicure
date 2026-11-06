import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Settings, Mic, Camera, Send, Pill, Calendar as CalendarIcon, FileText, Utensils, Image as ImageIcon, CheckCircle2, Clock, Users, ShieldAlert } from 'lucide-react';
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

    addPost(inputText.trim() || 'Foto condivisa', inputType, inputType === 'pill', attachedImage || undefined);
    setInputText('');
    setAttachedImage(null);
    setInputType('note');
  };

  const handleMicClick = () => {
    showToast('Registrazione vocale non disponibile al momento', 'info');
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
    showToast('Foto allegata con successo');
  };

  const getTypeIcon = (type: PostType) => {
    switch (type) {
      case 'pill':
        return <Pill className="w-4 h-4 text-emerald-600" />;
      case 'calendar':
        return <CalendarIcon className="w-4 h-4 text-sky-600" />;
      case 'food':
        return <Utensils className="w-4 h-4 text-amber-600" />;
      case 'photo':
        return <ImageIcon className="w-4 h-4 text-indigo-600" />;
      default:
        return <FileText className="w-4 h-4 text-slate-600" />;
    }
  };

  const todayStr = new Date().toISOString().split('T')[0];
  const todayEvents = events.filter((ev) => ev.date === todayStr);

  return (
    <div className="w-full px-4 md:px-8 py-6 pb-32 md:pb-12 font-sans">
      {/* Mobile Top Header */}
      <div className="flex md:hidden items-center justify-between mb-6 bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
        <div>
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Cerchio Attivo</span>
          <h1 className="text-lg font-bold text-[#2D3748]">{profile?.recipientName || 'Nonna Rosa'}</h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex -space-x-2">
            {members.map((m) => (
              <span key={m.id} className="w-7 h-7 rounded-full bg-slate-100 border-2 border-white text-xs flex items-center justify-center">
                {m.avatar}
              </span>
            ))}
          </div>
          <button
            onClick={() => setShowSettings(true)}
            className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600"
          >
            <Settings className="w-5 h-5 text-[#7BA88A]" />
          </button>
        </div>
      </div>

      {/* Desktop Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left / Center Column: Feed & Composer (Span 2 on desktop) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Desktop Banner Header */}
          <div className="hidden md:flex items-center justify-between bg-white lg:p-6 p-4 rounded-3xl shadow-sm border border-slate-100">
            <div>
              <span className="text-xs font-semibold text-[#7BA88A] uppercase tracking-wider">Dashboard Assistenza</span>
              <h1 className="text-2xl font-bold text-[#2D3748] mt-1">Cerchio di Cura — {profile?.recipientName || 'Nonna Rosa'}</h1>
              <p className="text-sm text-slate-500 mt-1">Aggiornamenti in tempo reale tra familiari e assistenti.</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowSettings(true)}
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-2 transition-all shadow-2xs"
              >
                <Settings className="w-4 h-4 text-[#7BA88A]" />
                <span>Impostazioni Cerchio</span>
              </button>
            </div>
          </div>

          {/* Desktop Post Composer */}
          <div className="hidden md:block bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
            <h3 className="text-sm font-bold text-[#2D3748] mb-3">Condividi un aggiornamento con il cerchio</h3>
            {attachedImage && (
              <div className="flex items-center justify-between mb-3 p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs">
                <span className="text-slate-600">📷 Foto allegata pronta per l'invio</span>
                <button onClick={() => setAttachedImage(null)} className="text-red-500 font-semibold hover:underline">Rimuovi</button>
              </div>
            )}
            <form onSubmit={handlePostSubmit} className="space-y-4">
              <div className="flex items-center gap-3">
                <select
                  value={inputType}
                  onChange={(e) => setInputType(e.target.value as PostType)}
                  className="h-12 px-3 rounded-2xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#7BA88A]"
                >
                  <option value="note">📝 Nota generale</option>
                  <option value="pill">💊 Somministrazione farmaco</option>
                  <option value="calendar">📅 Visita / Appuntamento</option>
                  <option value="food">🍽️ Pasto / Alimentazione</option>
                  <option value="photo">📷 Foto ricordo</option>
                </select>

                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Scrivi come sta o cosa avete fatto..."
                  className="flex-1 h-12 px-4 rounded-2xl border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:border-[#7BA88A] focus:bg-white transition-all"
                />
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleMicClick}
                    className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-medium flex items-center gap-1.5 transition-colors"
                  >
                    <Mic className="w-4 h-4 text-[#7BA88A]" />
                    <span>Registra audio</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleCameraMock}
                    className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-medium flex items-center gap-1.5 transition-colors"
                  >
                    <Camera className="w-4 h-4 text-[#7BA88A]" />
                    <span>Scatta foto</span>
                  </button>
                </div>

                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#7BA88A] hover:bg-[#6c987c] text-white font-semibold rounded-xl text-xs shadow-sm transition-all flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Pubblica</span>
                </button>
              </div>
            </form>
          </div>

          {/* Timeline Feed */}
          <div className="space-y-4">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">Feed Attività Recenti</h2>
            {posts.map((post) => (
              <article key={post.id} className="bg-white rounded-3xl lg:p-6 p-4 shadow-sm border border-slate-100 transition-all hover:shadow-md">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="w-10 h-10 rounded-2xl bg-slate-100 flex items-center justify-center text-lg shadow-2xs">
                      {post.authorAvatar || '👤'}
                    </span>
                    <div>
                      <h3 className="text-sm font-bold text-[#2D3748]">{post.authorName}</h3>
                      <p className="text-[11px] text-slate-400">{post.timestamp}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                      {getTypeIcon(post.type)}
                    </span>
                    {post.completed && (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Completato</span>
                      </span>
                    )}
                  </div>
                </div>

                <p className="text-sm lg:text-base text-slate-700 leading-relaxed mb-3 pl-13">{post.text}</p>

                {post.imageUrl && (
                  <div className="ml-13 mb-2 rounded-2xl overflow-hidden border border-slate-100 max-h-72">
                    <img src={post.imageUrl} alt="Allegato" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                )}
              </article>
            ))}
          </div>
        </div>

        {/* Right Column: Desktop Widgets (Compact Calendar, Quick Medications Checklist, Members) */}
        <div className="space-y-6">
          
          {/* Care Circle Members Widget */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-[#2D3748] flex items-center gap-2">
                <Users className="w-4 h-4 text-[#7BA88A]" />
                <span>Membri del Cerchio ({members.length})</span>
              </h3>
            </div>
            <div className="space-y-3">
              {members.map((m) => (
                <div key={m.id} className="flex items-center justify-between p-3 rounded-2xl bg-slate-50/80 border border-slate-100">
                  <div className="flex items-center gap-3">
                    <span className="w-9 h-9 rounded-xl bg-white shadow-2xs flex items-center justify-center text-base">{m.avatar}</span>
                    <div>
                      <p className="text-xs font-bold text-slate-800">{m.name}</p>
                      <p className="text-[11px] text-slate-500">{m.role}</p>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span>Online</span>
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Today's Medications Quick Checklist Widget */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-[#2D3748] flex items-center gap-2">
                <Pill className="w-4 h-4 text-[#7BA88A]" />
                <span>Farmaci di Oggi</span>
              </h3>
              <button onClick={() => setActiveTab('farmaci')} className="text-xs font-semibold text-[#7BA88A] hover:underline">
                Vedi tutti →
              </button>
            </div>
            <div className="space-y-3">
              {medications.map((med) => (
                <div key={med.id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-slate-800">{med.name}</p>
                      <p className="text-[11px] text-slate-500">{med.dosage} · Resp: {med.responsible}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {med.times.map((slot) => {
                      const key = `${todayStr}_${slot}`;
                      const isTaken = !!med.checks[key];
                      return (
                        <button
                          key={slot}
                          onClick={() => toggleMedicationDose(med.id, slot, todayStr)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                            isTaken
                              ? 'bg-emerald-600 text-white shadow-xs'
                              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          <CheckCircle2 className={`w-3.5 h-3.5 ${isTaken ? 'text-white' : 'text-slate-400'}`} />
                          <span>{slot}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Today's Agenda Widget */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-[#2D3748] flex items-center gap-2">
                <CalendarIcon className="w-4 h-4 text-[#7BA88A]" />
                <span>Eventi di Oggi</span>
              </h3>
              <button onClick={() => setActiveTab('calendario')} className="text-xs font-semibold text-[#7BA88A] hover:underline">
                Agenda →
              </button>
            </div>
            {todayEvents.length === 0 ? (
              <p className="text-xs text-slate-500 py-2">Nessun appuntamento o turno programmato per oggi.</p>
            ) : (
              <div className="space-y-2.5">
                {todayEvents.map((ev) => (
                  <div key={ev.id} className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-slate-800">{ev.title}</p>
                      <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                        <Clock className="w-3 h-3" /> {ev.time} · {ev.memberName}
                      </p>
                    </div>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase ${
                      ev.status === 'completato' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                    }`}>
                      {ev.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>

      {/* Mobile Fixed bottom input */}
      <div className="fixed md:hidden bottom-16 left-0 right-0 p-3 bg-white/95 backdrop-blur-md border-t border-slate-100 z-30 shadow-lg">
        {attachedImage && (
          <div className="flex items-center justify-between mb-2 p-2 bg-slate-50 rounded-xl border border-slate-200 text-xs">
            <span className="text-slate-600 truncate">📷 Foto allegata pronta per l'invio</span>
            <button onClick={() => setAttachedImage(null)} className="text-red-500 font-semibold hover:underline">Rimuovi</button>
          </div>
        )}

        <form onSubmit={handlePostSubmit} className="flex items-center gap-2">
          <select
            value={inputType}
            onChange={(e) => setInputType(e.target.value as PostType)}
            className="h-11 px-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-medium text-slate-700 focus:outline-none focus:border-[#7BA88A]"
          >
            <option value="note">📝 Nota</option>
            <option value="pill">💊 Farmaco</option>
            <option value="calendar">📅 Visita</option>
            <option value="food">🍽️ Pasto</option>
            <option value="photo">📷 Foto</option>
          </select>

          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Scrivi un aggiornamento..."
            className="flex-1 h-11 px-3 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:border-[#7BA88A]"
          />

          <button type="button" onClick={handleMicClick} className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 shrink-0">
            <Mic className="w-4 h-4" />
          </button>

          <button type="button" onClick={handleCameraMock} className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 shrink-0">
            <Camera className="w-4 h-4" />
          </button>

          <button type="submit" className="w-11 h-11 bg-[#7BA88A] text-white rounded-xl flex items-center justify-center shadow-sm shrink-0">
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
    </div>
  );
};
