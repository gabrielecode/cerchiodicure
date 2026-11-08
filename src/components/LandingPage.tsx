import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Activity,
  HeartHandshake,
  ShieldCheck,
  Star,
  CheckCircle2,
  Calendar,
  Pill,
  FileText,
  Utensils,
  AlertTriangle,
  ArrowRight,
  Download,
  Apple,
  Smartphone,
  Monitor,
  Share2,
  MessageCircle,
  Copy,
  Check,
  ExternalLink,
  ChevronDown,
  Moon,
  Sun,
  User,
  Clock,
  Sparkles,
  Lock,
  PhoneCall
} from 'lucide-react';
import { InstallBanner } from './InstallBanner';
import { PWAInstallModal } from './PWAInstallModal';

export const LandingPage: React.FC = () => {
  const { setCurrentView, theme, toggleTheme, showToast } = useApp();
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Quick form state for the conversion block
  const [recipientName, setRecipientName] = useState('');
  const [userName, setUserName] = useState('');
  const [userRole, setUserRole] = useState('Caregiver Familiare');

  const handleQuickStart = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipientName.trim() || !userName.trim()) {
      showToast('Compilare i campi per iniziare', 'info');
      return;
    }
    // Navigate to login/signup
    setCurrentView('login');
  };

  const handleShare = (platform: 'whatsapp' | 'telegram' | 'facebook' | 'linkedin' | 'copy') => {
    const url = 'https://cerchiodicura.ch/';
    const text = 'Cerchio di Cura - La Web App per coordinare l\'assistenza agli anziani in Canton Ticino. Installabile su Apple e Android:';

    switch (platform) {
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`, '_blank');
        break;
      case 'telegram':
        window.open(`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`, '_blank');
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'linkedin':
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'copy':
        navigator.clipboard.writeText(url);
        setCopiedLink(true);
        showToast('Link copiato negli appunti!');
        setTimeout(() => setCopiedLink(false), 2500);
        break;
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 font-sans text-slate-800 dark:text-slate-200 flex flex-col selection:bg-emerald-100 dark:selection:bg-emerald-900/30 selection:text-emerald-900 dark:selection:text-emerald-100 transition-colors duration-300">
      <InstallBanner />
      <PWAInstallModal isOpen={isInstallModalOpen} onClose={() => setIsInstallModalOpen(false)} />

      {/* =========================================================================
          1. HEADER (LOGO E ANCORE DI NAVIGAZIONE LOCALE)
      ========================================================================= */}
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          {/* Logo */}
          <div 
            className="flex items-center gap-3 cursor-pointer select-none" 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center shadow-md">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-lg text-slate-900 dark:text-slate-100 tracking-tight leading-none">
                  Cerchio di Cura
                </span>
                <span className="text-[9px] bg-emerald-50 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300 font-extrabold px-1.5 py-0.5 rounded border border-emerald-200 dark:border-emerald-800 uppercase tracking-widest">
                  Ticino
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase mt-0.5">
                Web App Assistenza Familiare
              </p>
            </div>
          </div>

          {/* Ancore di Navigazione Locale */}
          <nav className="hidden lg:flex items-center gap-6 text-xs font-black uppercase tracking-wider text-slate-600 dark:text-slate-400">
            <a href="#offerta" className="hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors">Offerta</a>
            <a href="#benefici" className="hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors">Benefici</a>
            <a href="#testimonianze" className="hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors">Testimonianze</a>
            <a href="#elenco-puntato" className="hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors">Funzionalità</a>
            <a href="#conversione" className="hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors">Inizia Ora</a>
          </nav>

          {/* Actions: Install, Theme, Login */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => setIsInstallModalOpen(true)}
              className="hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 text-xs font-black uppercase tracking-wider transition-all shadow-sm"
              title="Installa come Web App su Apple iOS e Android"
            >
              <Download className="w-3.5 h-3.5 text-emerald-600" />
              <span>Installa App</span>
              <span className="flex items-center gap-1 opacity-70 border-l border-emerald-300 dark:border-emerald-700 pl-1.5">
                <Apple className="w-3 h-3" />
                <Smartphone className="w-3 h-3" />
              </span>
            </button>

            <button 
              onClick={toggleTheme}
              className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
              title="Cambia tema"
              aria-label="Modalità chiara/scura"
            >
              {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </button>

            <button
              onClick={() => setCurrentView('login')}
              className="text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-emerald-400 px-3 py-2 transition-colors uppercase tracking-wider"
            >
              Accedi
            </button>

            <button
              onClick={() => setCurrentView('login')}
              className="bg-red-600 hover:bg-red-700 text-white text-xs font-black uppercase tracking-wider px-4 py-2.5 rounded-xl shadow-md transition-all flex items-center gap-2"
            >
              <span>Crea Cerchio</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* =========================================================================
          2. OFFERTA PRINCIPALE (HEAD LINE, CALL TO ACTION & HERO IMAGE)
      ========================================================================= */}
      <section id="offerta" className="relative pt-12 pb-20 lg:pt-20 lg:pb-28 bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-950 border-b border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Solution & Heart of the Offer */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-400 text-xs font-black uppercase tracking-wider border border-emerald-200 dark:border-emerald-800 shadow-xs">
                <ShieldCheck className="w-4 h-4" />
                <span>Web App Ufficiale per Famiglie e Caregiver in Ticino</span>
              </div>

              {/* Head Line */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-slate-100 tracking-tight leading-[1.1]">
                Assistenza Domiciliare per i Tuoi Cari: <br />
                <span className="text-emerald-700 dark:text-emerald-400">Serena, Connessa e Condivisa.</span>
              </h1>

              {/* Soluzione del problema e cuore dell'offerta */}
              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                La prima Web App pensata per le famiglie, i caregiver e gli operatori del Canton Ticino. 
                Coordina <strong>farmaci, pasti, visite e documenti</strong> in tempo reale con badanti e servizi Spitex. 
                Installabile istantaneamente su qualsiasi smartphone <strong>Apple iOS e Android</strong> senza passare dagli app store.
              </p>

              {/* CALL TO ACTION (Come nello schema wireframe SGS) */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                <button
                  onClick={() => setCurrentView('login')}
                  className="h-14 px-8 bg-red-600 hover:bg-red-700 text-white font-black text-xs uppercase tracking-[0.2em] rounded-xl shadow-xl hover:shadow-2xl transition-all flex items-center justify-center gap-3 active:scale-95"
                >
                  <span>Attiva il Tuo Cerchio Gratuito</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setIsInstallModalOpen(true)}
                  className="h-14 px-6 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 font-black text-xs uppercase tracking-wider rounded-xl border-2 border-slate-300 dark:border-slate-700 transition-all flex items-center justify-center gap-2.5 shadow-sm"
                >
                  <Download className="w-4 h-4 text-emerald-600" />
                  <span>Installa su Apple & Android</span>
                </button>
              </div>

              {/* Micro Rassicurazioni */}
              <div className="pt-4 flex flex-wrap items-center gap-6 text-xs text-slate-500 dark:text-slate-400 font-semibold">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  100% Gratuito per nuclei familiari
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Protezione dati nLPD Svizzera
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Zero download da App Store
                </span>
              </div>
            </div>

            {/* Right Column: Hero Visual representation */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white dark:border-slate-800 bg-white dark:bg-slate-900 group">
                <img
                  src="/assets/aistudio/Daughter_and_mother_interacting___1fa1ba8c_6308a603.jpg"
                  alt="Caregiver e madre anziana che interagiscono serenamente"
                  className="w-full h-80 sm:h-96 object-cover object-center group-hover:scale-102 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
                
                {/* Floating app badge */}
                <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200 dark:border-slate-700 shadow-xl">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-emerald-700 dark:text-emerald-400">
                      Attività In Tempo Reale
                    </span>
                    <span className="flex items-center gap-1 text-[9px] bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-300 font-bold px-2 py-0.5 rounded">
                      Apple & Android
                    </span>
                  </div>
                  <div className="space-y-1.5 text-xs">
                    <p className="font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      Terapia delle 08:00 somministrata regolarmente da Marco
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                      <Clock className="w-3 h-3 text-slate-400" /> Visita Spitex confermata per domani alle 10:30
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* =========================================================================
          3. BENEFICI (3 COLONNE CON ICONE / STELLE COME DA SCHEMA)
      ========================================================================= */}
      <section id="benefici" className="py-20 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-[11px] font-black text-red-600 uppercase tracking-[0.2em] block mb-2">
              Benefici Principali
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
              I Vantaggi per la Tua Famiglia
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 font-medium">
              Elimina le incomprensioni e l'ansia quotidiana con una gestione trasparente
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Beneficio 1 */}
            <div className="p-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 hover:border-emerald-300 dark:hover:border-emerald-700 transition-all text-center flex flex-col items-center shadow-xs">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center mb-6 shadow-xs border border-amber-500/20">
                <Star className="w-7 h-7 fill-amber-500 text-amber-500" />
              </div>
              <h3 className="text-lg font-black text-slate-900 dark:text-slate-100 mb-3 tracking-tight">
                Coordinamento H24 Senza Stress
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                Basta telefonate incrociate e messaggi WhatsApp dispersi. Tutta la rete familiare, assistenti domiciliari e personale medico sono allineati su farmaci, pasti e bisogni in tempo reale.
              </p>
            </div>

            {/* Beneficio 2 */}
            <div className="p-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 hover:border-emerald-300 dark:hover:border-emerald-700 transition-all text-center flex flex-col items-center shadow-xs">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-6 shadow-xs border border-emerald-500/20">
                <Star className="w-7 h-7 fill-emerald-600 text-emerald-600 dark:fill-emerald-400" />
              </div>
              <h3 className="text-lg font-black text-slate-900 dark:text-slate-100 mb-3 tracking-tight">
                Web App per Apple & Android
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                Si installa in 5 secondi direttamente dal browser su iPhone, iPad, Android e computer desktop. Funziona a schermo intero come una vera app nativa, con notifiche push e zero spazio occupato.
              </p>
            </div>

            {/* Beneficio 3 */}
            <div className="p-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 hover:border-emerald-300 dark:hover:border-emerald-700 transition-all text-center flex flex-col items-center shadow-xs">
              <div className="w-14 h-14 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-6 shadow-xs border border-blue-500/20">
                <Star className="w-7 h-7 fill-blue-600 text-blue-600 dark:fill-blue-400" />
              </div>
              <h3 className="text-lg font-black text-slate-900 dark:text-slate-100 mb-3 tracking-tight">
                Privacy Svizzera & Sicurezza nLPD
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                Dati sanitari e personali protetti con crittografia end-to-end e trattati in piena conformità con la nuova Legge federale sulla protezione dei dati (nLPD). Accesso protetto tramite codice unico cifrato.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          4. DETTAGLIO DELL'OFFERTA & TESTIMONIANZE (4 BOX + CALL TO ACTION)
      ========================================================================= */}
      <section id="testimonianze" className="py-24 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-[11px] font-black text-red-600 uppercase tracking-[0.2em] block mb-2">
              Dettaglio dell'Offerta
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-slate-100 tracking-tight leading-tight">
              Come Risolviamo le Sfide dell'Assistenza Quotidiana
            </h2>
            <p className="text-base text-slate-600 dark:text-slate-400 mt-3 font-medium">
              Esprime la promessa, i benefit e i vantaggi dell'offerta descrivendo come vengono risolti i problemi reali delle famiglie in Ticino.
            </p>
          </div>

          {/* 4 Testimonianze (Cards come da schema wireframe SGS) */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            
            {/* Card 1 */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1 text-amber-500 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-500 text-amber-500" />
                  ))}
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed italic mb-6">
                  "Prima vivevo con l'ansia costante che la mamma saltasse le pillole per la pressione. Ora ricevo la conferma in tempo reale e so esattamente cosa ha mangiato anche se sono al lavoro a Lugano."
                </p>
              </div>
              <div className="pt-4 border-t border-slate-100 dark:border-slate-700 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-300 font-black text-xs flex items-center justify-center">
                  EM
                </div>
                <div>
                  <h4 className="text-xs font-black text-slate-900 dark:text-slate-100">Elena Martignoni</h4>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Caregiver Familiare · Lugano</p>
                </div>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1 text-amber-500 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-500 text-amber-500" />
                  ))}
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed italic mb-6">
                  "L'installazione su iPhone è stata fulminea: senza password di Apple ID o complicazioni. Anche mia sorella che vive fuori cantone può seguire le visite mediche del papà senza perdersi nulla."
                </p>
              </div>
              <div className="pt-4 border-t border-slate-100 dark:border-slate-700 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 font-black text-xs flex items-center justify-center">
                  MB
                </div>
                <div>
                  <h4 className="text-xs font-black text-slate-900 dark:text-slate-100">Marco Bernasconi</h4>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Amministratore Hub · Bellinzona</p>
                </div>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1 text-amber-500 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-500 text-amber-500" />
                  ))}
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed italic mb-6">
                  "Lavoro come assistente domiciliare. Avere un piano pasti chiaro e la lista farmaci direttamente sullo smartphone Android mi permette di lavorare con precisione e tranquillità assoluta."
                </p>
              </div>
              <div className="pt-4 border-t border-slate-100 dark:border-slate-700 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-300 font-black text-xs flex items-center justify-center">
                  AS
                </div>
                <div>
                  <h4 className="text-xs font-black text-slate-900 dark:text-slate-100">Ana Silva</h4>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Assistente Domiciliare · Locarno</p>
                </div>
              </div>
            </div>

            {/* Card 4 */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1 text-amber-500 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-500 text-amber-500" />
                  ))}
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed italic mb-6">
                  "La sincronizzazione tra operatori Spitex e familiari riduce drasticamente gli errori terapeutici. L'archivio referti digitale è uno strumento prezioso per noi sanitari sul territorio."
                </p>
              </div>
              <div className="pt-4 border-t border-slate-100 dark:border-slate-700 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-300 font-black text-xs flex items-center justify-center">
                  CB
                </div>
                <div>
                  <h4 className="text-xs font-black text-slate-900 dark:text-slate-100">Dott.ssa C. Bianchi</h4>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Personale Sanitario · Mendrisio</p>
                </div>
              </div>
            </div>

          </div>

          {/* CALL TO ACTION Centrato (Come previsto dallo schema SGS) */}
          <div className="text-center">
            <button
              onClick={() => setCurrentView('login')}
              className="h-14 px-10 bg-red-600 hover:bg-red-700 text-white font-black text-xs uppercase tracking-[0.2em] rounded-xl shadow-xl transition-all inline-flex items-center gap-3 active:scale-95"
            >
              <span>Inizia Subito la Prova Gratuita</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <p className="text-[11px] text-slate-400 font-semibold mt-3 uppercase tracking-wider">
              Nessun impegno • Attivazione in 60 secondi • Supporto Canton Ticino
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================================
          5. ELENCO PUNTATO (CARATTERISTICHE E PUNTI DI FORZA DELL'OFFERTA)
      ========================================================================= */}
      <section id="elenco-puntato" className="py-24 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-[11px] font-black text-red-600 uppercase tracking-[0.2em] block mb-2">
              Elenco Dettagliato
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
              Tutto ciò che serve per un'assistenza completa
            </h2>
            <p className="text-base text-slate-600 dark:text-slate-400 mt-3 font-medium">
              Ogni funzionalità è progettata per semplificare i compiti di caregiver e familiari in Canton Ticino:
            </p>
          </div>

          {/* Elenco puntato con evidenziatori grafici (come da schema) */}
          <div className="space-y-6">
            <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-md">
                <Pill className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900 dark:text-slate-100 mb-1">
                  Protocollo Farmacologico & Allarmi Intelligenti
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                  Orari di somministrazione precisi, dosaggi personalizzati e checklist di spunta in tempo reale per non dimenticare mai una terapia essenziale.
                </p>
              </div>
            </div>

            <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-md">
                <Utensils className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900 dark:text-slate-100 mb-1">
                  Piano Alimentare Settimanale & Monitoraggio Dieta
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                  Pianificazione dettagliata di pranzo e cena, tracciamento consumazione e note sanitarie condivise (diabete, restrizioni iposodiche, disfagia).
                </p>
              </div>
            </div>

            <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-md">
                <Calendar className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900 dark:text-slate-100 mb-1">
                  Agenda Condivisa Visite Mediche & Turni Assistenza
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                  Calendario integrato per coordinare visite specialistiche, turni badante e passaggi infermieristici Spitex senza sovrapposizioni.
                </p>
              </div>
            </div>

            <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-md">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900 dark:text-slate-100 mb-1">
                  Archivio Digitale Protetto di Referti & Prescrizioni
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                  Safe documentale cifrato per salvare PDF, esami clinici e tessere sanitarie, accessibili in qualsiasi istante da qualsiasi membro abilitato.
                </p>
              </div>
            </div>

            <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-md">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900 dark:text-slate-100 mb-1">
                  Protocollo SOS & Chiamata Rapida Emergenze Cantonali
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                  Broadcast immediato d'allarme a tutti i membri del cerchio con un solo tocco, con directory telefonica integrata per 144 e polizia 117.
                </p>
              </div>
            </div>

            <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-900/40 flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-emerald-700 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-md">
                <Smartphone className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-base font-black text-slate-900 dark:text-slate-100">
                    Installazione Web App Multi-Piattaforma (Apple & Android)
                  </h3>
                  <span className="text-[9px] bg-emerald-700 text-white font-black px-2 py-0.5 rounded uppercase">
                    PWA Certified
                  </span>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                  Compatibile al 100% con Safari (iPhone/iPad), Chrome (Android) e browser desktop. Funziona a schermo intero senza barre del browser e con avvio istantaneo.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          6. CONVERSIONE (BLOCCO IN EVIDENZA CON IMMAGINE, FORM E CALL TO ACTION)
      ========================================================================= */}
      <section id="conversione" className="py-20 bg-slate-100 dark:bg-slate-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Card di Conversione colorata (come nello schema SGS con sfondo forte) */}
          <div className="bg-red-600 rounded-3xl p-8 sm:p-12 lg:p-16 shadow-2xl text-white overflow-hidden relative">
            <div className="grid lg:grid-cols-12 gap-10 items-center relative z-10">
              
              {/* Sinistra: Immagine / Mockup dell'app */}
              <div className="lg:col-span-5 flex flex-col items-center">
                <div className="w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl border-4 border-white/20 bg-slate-900 relative group">
                  <img
                    src="/assets/aistudio/image_18e19e45.png"
                    alt="Interfaccia dashboard di Cerchio di Cura"
                    className="w-full h-auto object-cover"
                  />
                  <div className="p-4 bg-slate-900 text-center">
                    <p className="text-xs font-black uppercase tracking-wider text-emerald-400">
                      ✓ Piattaforma Attiva in Ticino
                    </p>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      Installabile su Apple iOS, Android e PC
                    </p>
                  </div>
                </div>
              </div>

              {/* Destra: Ripetizione dell'offerta & Form di Conversione */}
              <div className="lg:col-span-7 space-y-6">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] bg-white text-red-700 px-3 py-1 rounded-md mb-3 inline-block">
                    Inizia Ora Gratuitamente
                  </span>
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight leading-tight">
                    Crea il Tuo Cerchio di Cura in Meno di 1 Minuto
                  </h2>
                  <p className="text-sm text-red-100 font-medium mt-2 leading-relaxed">
                    Compila i campi per attivare la dashboard protetta del tuo familiare. Potrai invitare gli altri membri tramite codice univoco.
                  </p>
                </div>

                <form onSubmit={handleQuickStart} className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-red-100 mb-1.5">
                      Nome Destinatario Assistenza
                    </label>
                    <input
                      type="text"
                      value={recipientName}
                      onChange={(e) => setRecipientName(e.target.value)}
                      placeholder="Es. Rosa Rossi"
                      className="w-full h-12 px-4 rounded-xl bg-white text-slate-900 placeholder:text-slate-400 font-bold text-sm focus:outline-none focus:ring-4 focus:ring-white/30 shadow-md"
                      required
                    />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-red-100 mb-1.5">
                        Tuo Nome e Cognome
                      </label>
                      <input
                        type="text"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        placeholder="Es. Marco Rossi"
                        className="w-full h-12 px-4 rounded-xl bg-white text-slate-900 placeholder:text-slate-400 font-bold text-sm focus:outline-none focus:ring-4 focus:ring-white/30 shadow-md"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-red-100 mb-1.5">
                        Profilo / Ruolo Operativo
                      </label>
                      <select
                        value={userRole}
                        onChange={(e) => setUserRole(e.target.value)}
                        className="w-full h-12 px-4 rounded-xl bg-white text-slate-900 font-bold text-sm focus:outline-none focus:ring-4 focus:ring-white/30 shadow-md appearance-none"
                      >
                        <option value="Caregiver Familiare">Caregiver Familiare</option>
                        <option value="Personale Spitex">Operatore Spitex</option>
                        <option value="Assistente Domiciliare">Badante / Assistente</option>
                        <option value="Personale Medico">Medico di Base</option>
                      </select>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full h-14 bg-slate-950 hover:bg-slate-900 text-white font-black text-xs uppercase tracking-[0.2em] rounded-xl shadow-2xl transition-all flex items-center justify-center gap-3 mt-4 active:scale-95"
                  >
                    <span>Convalida e Crea Cerchio Adesso</span>
                    <ArrowRight className="w-4 h-4 text-emerald-400" />
                  </button>
                </form>

                <div className="pt-2 flex flex-wrap items-center justify-between text-[11px] text-red-100 font-bold opacity-90 gap-2 border-t border-red-500/50">
                  <span>✓ 100% Gratuito per famiglie</span>
                  <span>✓ Nessuna carta di credito</span>
                  <span>✓ Server protetti in Svizzera (nLPD)</span>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          7. BOTTONI SOCIAL & FOOTER (CONDIVISIONE SPONTANEA E RIFERIMENTI CANTONALI)
      ========================================================================= */}
      <footer className="bg-slate-950 text-slate-400 pt-16 pb-12 border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Sezione Bottoni Social (Come da wireframe SGS: Permettono condivisione spontanea) */}
          <div className="pb-12 border-b border-slate-800 text-center">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500 block mb-2">
              Condivisione Spontanea
            </span>
            <h3 className="text-lg font-black text-white tracking-tight mb-2">
              Conosci un familiare o caregiver che ha bisogno di aiuto?
            </h3>
            <p className="text-xs text-slate-400 max-w-xl mx-auto mb-6">
              Condividi Cerchio di Cura direttamente tramite i canali social o invia il link su WhatsApp alla tua famiglia:
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={() => handleShare('whatsapp')}
                className="h-10 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-2 transition-all shadow-md"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp</span>
              </button>

              <button
                onClick={() => handleShare('telegram')}
                className="h-10 px-4 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs flex items-center gap-2 transition-all shadow-md"
              >
                <Share2 className="w-4 h-4" />
                <span>Telegram</span>
              </button>

              <button
                onClick={() => handleShare('facebook')}
                className="h-10 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-2 transition-all shadow-md"
              >
                <Share2 className="w-4 h-4" />
                <span>Facebook</span>
              </button>

              <button
                onClick={() => handleShare('linkedin')}
                className="h-10 px-4 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs flex items-center gap-2 transition-all shadow-md"
              >
                <Share2 className="w-4 h-4" />
                <span>LinkedIn</span>
              </button>

              <button
                onClick={() => handleShare('copy')}
                className="h-10 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center gap-2 border border-slate-700 transition-all shadow-md"
              >
                {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copiedLink ? 'Copiato!' : 'Copia Link'}</span>
              </button>
            </div>
          </div>

          {/* Dettagli Istituzionali e Navigazione Footer */}
          <div className="py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-700 text-white flex items-center justify-center font-bold">
                  <Activity className="w-4 h-4" />
                </div>
                <span className="font-black text-white text-base">Cerchio di Cura</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Piattaforma di coordinamento integrato per l'assistenza anziani a domicilio nel Canton Ticino.
              </p>
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-wider text-slate-500">
                <span>🇨🇭 Swiss Made</span>
                <span>•</span>
                <span>nLPD Compliant</span>
              </div>
            </div>

            <div>
              <h4 className="text-[11px] font-black uppercase tracking-widest text-white mb-4">Navigazione</h4>
              <ul className="space-y-2.5 text-xs">
                <li><a href="#offerta" className="hover:text-emerald-400 transition-colors">Offerta Principale</a></li>
                <li><a href="#benefici" className="hover:text-emerald-400 transition-colors">Benefici per la Famiglia</a></li>
                <li><a href="#testimonianze" className="hover:text-emerald-400 transition-colors">Testimonianze Canton Ticino</a></li>
                <li><a href="#elenco-puntato" className="hover:text-emerald-400 transition-colors">Elenco Funzionalità</a></li>
                <li>
                  <button onClick={() => setIsInstallModalOpen(true)} className="hover:text-emerald-400 transition-colors text-left flex items-center gap-1.5">
                    <Download className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Installa Web App (Apple & Android)</span>
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-[11px] font-black uppercase tracking-widest text-white mb-4">Risorse Cantonali</h4>
              <ul className="space-y-2.5 text-xs">
                <li><a href="https://www.spitex.ch" target="_blank" rel="noreferrer" className="hover:text-emerald-400 transition-colors flex items-center gap-1"><span>Spitex Svizzera</span><ExternalLink className="w-3 h-3 text-slate-600" /></a></li>
                <li><a href="https://www.prosenectute.ch" target="_blank" rel="noreferrer" className="hover:text-emerald-400 transition-colors flex items-center gap-1"><span>Pro Senectute Ticino</span><ExternalLink className="w-3 h-3 text-slate-600" /></a></li>
                <li><a href="https://www4.ti.ch/dss/sanita" target="_blank" rel="noreferrer" className="hover:text-emerald-400 transition-colors flex items-center gap-1"><span>DSS Sanità Ticino</span><ExternalLink className="w-3 h-3 text-slate-600" /></a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-[11px] font-black uppercase tracking-widest text-white mb-4">Contatti & Legale</h4>
              <ul className="space-y-2.5 text-xs">
                <li><a href="mailto:info@sititicino.ch" className="hover:text-emerald-400 transition-colors">info@sititicino.ch</a></li>
                <li><span className="text-slate-300">Connect & Create • Canton Ticino</span></li>
                <li>
                  <button onClick={() => setCurrentView('privacy')} className="hover:text-emerald-400 transition-colors text-left text-emerald-500 underline font-semibold">
                    Informativa Privacy (nLPD)
                  </button>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-[10px] font-bold uppercase tracking-widest text-slate-600 gap-4">
            <p>© 2026 Cerchio di Cura. Tutti i diritti riservati.</p>
            <p>Piattaforma PWA conforme a Apple iOS e Google Android.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
