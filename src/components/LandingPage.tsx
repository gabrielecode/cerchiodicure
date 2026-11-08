import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  HeartHandshake,
  ShieldCheck,
  Calendar,
  Pill,
  FileText,
  BookOpen,
  Users,
  CheckCircle2,
  ChevronDown,
  Sparkles,
  ArrowRight,
  Download,
  Lock,
  Globe2,
  Activity,
  User,
  Clock,
  Briefcase,
  Moon,
  Sun
} from 'lucide-react';
import { InstallBanner } from './InstallBanner';

export const LandingPage: React.FC = () => {
  const { setCurrentView, theme, toggleTheme } = useApp();
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: 'I dati sanitari e familiari sono sicuri?',
      a: 'Cerchio di Cura adotta un approccio Privacy First. I dati sono protetti da crittografia e l’accesso è limitato esclusivamente ai membri del cerchio autorizzati tramite codice univoco.'
    },
    {
      q: 'Come avviene il coordinamento con i servizi Spitex in Ticino?',
      a: 'L’applicazione integra moduli specifici per la condivisione di piani di assistenza e referti, ottimizzati per la comunicazione con professionisti sanitari e medici di base operanti sul territorio cantonale.'
    },
    {
      q: 'Come posso invitare altri membri?',
      a: 'Il sistema genera un codice di accesso univoco (es. ROSA42) per ogni cerchio. Condividendo questo codice, i collaboratori possono unirsi istantaneamente all’ecosistema di assistenza.'
    },
    {
      q: 'Qual è il ruolo dell’applicazione nel supporto medico?',
      a: 'Cerchio di Cura funge da piattaforma di coordinamento logistico e organizzativo. Non si sostituisce a diagnosi o consulti medici, ma ne facilita la gestione operativa.'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-700 dark:text-slate-300 flex flex-col selection:bg-emerald-100 dark:selection:bg-emerald-900/30 selection:text-emerald-900 dark:selection:text-emerald-100 transition-colors duration-300">
      <InstallBanner />

      {/* Corporate Header */}
      <header className="sticky top-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setCurrentView('landing')}>
            <div className="w-9 h-9 rounded-lg bg-emerald-700 text-white flex items-center justify-center">
              <Activity className="w-5 h-5" />
            </div>
            <div className="hidden sm:block">
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg text-slate-900 dark:text-slate-100 tracking-tight">Cerchio di Cura</span>
                <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-400 font-bold px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700 uppercase tracking-wider">
                  Ticino
                </span>
              </div>
            </div>
          </div>

          <nav className="hidden lg:flex items-center gap-8 text-sm font-semibold text-slate-600 dark:text-slate-400">
            <a href="#funzionalita" className="hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors">Soluzioni</a>
            <a href="#privacy" className="hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors">Privacy & Sicurezza</a>
            <a href="#prezzi" className="hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors">Piani</a>
            <a href="#faq" className="hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors">Supporto</a>
          </nav>

          <div className="flex items-center gap-3">
            <button 
              onClick={toggleTheme}
              className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors"
              title="Toggle theme"
            >
              {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </button>
            <button
              onClick={() => {
                const event = new CustomEvent('pwa-install');
                window.dispatchEvent(event);
              }}
              className="text-sm font-bold text-slate-700 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-emerald-400 px-4 py-2 transition-colors flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Installa
            </button>
            <button
              onClick={() => setCurrentView('login')}
              className="text-sm font-bold text-slate-700 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-emerald-400 px-4 py-2 transition-colors"
            >
              Accedi
            </button>
            <button
              onClick={() => setCurrentView('login')}
              className="bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-bold px-5 py-2.5 rounded-lg shadow-sm transition-all flex items-center gap-2"
            >
              <span>Crea account</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Professional Hero Section with Background Watermark */}
      <section className="relative overflow-hidden pt-24 pb-32 lg:pt-40 lg:pb-52 bg-white dark:bg-slate-950 flex items-center min-h-[600px] sm:min-h-[700px]">
        
        {/* Background Image Layer (Watermark) */}
        <div className="absolute inset-0 z-0 pointer-events-none flex items-center justify-center lg:justify-end overflow-hidden">
          <div className="w-full max-w-5xl lg:max-w-6xl opacity-50 dark:opacity-40 transform scale-110 lg:translate-x-32 transition-opacity duration-1000">
            <img 
              src="/assets/aistudio/Daughter_and_mother_interacting___1fa1ba8c_6308a603.jpg" 
              alt="Caregiver e anziano" 
              className="w-full h-auto object-contain" 
              loading="eager"
            />
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-emerald-50 dark:bg-emerald-900/20 text-emerald-800 dark:text-emerald-400 text-[11px] font-bold uppercase tracking-wider border border-emerald-100 dark:border-emerald-800 mb-8">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Gestione Assistenza Domiciliare Ticino</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black text-slate-900 dark:text-slate-100 tracking-tight leading-[1.05] mb-8">
              Assistenza Domiciliare, <br />
              <span className="text-emerald-700 dark:text-emerald-500">Coordinata e Semplice.</span>
            </h1>
            
            <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 mb-10 max-w-2xl leading-relaxed font-medium">
              Cerchio di Cura è la piattaforma professionale che unifica la gestione di terapie farmacologiche, agenda visite, alimentazione e documenti sanitari. La soluzione definitiva per le famiglie in Ticino che cercano trasparenza, sicurezza e collaborazione h24.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center gap-4 mb-10">
              <button
                onClick={() => setCurrentView('login')}
                className="w-full sm:w-auto h-14 bg-emerald-700 hover:bg-emerald-800 text-white font-black uppercase tracking-widest rounded-lg shadow-xl transition-all flex items-center justify-center gap-3 text-sm px-10"
              >
                <span>Attiva il Tuo Cerchio</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 bg-slate-100 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
              <h4 className="text-sm font-black text-slate-900 dark:text-slate-100 mb-3 flex items-center gap-2">
                <Download className="w-4 h-4 text-emerald-700" /> Disponibile su ogni dispositivo
              </h4>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                La nostra app si adatta alle tue esigenze: installala su <strong>PC, Mac, Android e iPhone/iPad</strong> per accedere al coordinamento della tua famiglia ovunque ti trovi. Nessun download complesso: basta un click dal browser per avere Cerchio di Cura sempre a portata di mano.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Architecture Section */}
      <section id="privacy" className="py-20 bg-slate-50 dark:bg-slate-900 border-y border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-12">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center shadow-sm text-emerald-700 dark:text-emerald-400">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Infrastruttura Enterprise</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Architettura basata su crittografia end-to-end per la massima protezione dei dati sanitari della famiglia. Conforme alla LPD svizzera.
              </p>
            </div>

            <div className="space-y-4">
              <div className="w-12 h-12 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center shadow-sm text-emerald-700 dark:text-emerald-400">
                <Briefcase className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Coordinamento Pro</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Sincronizzazione immediata tra tutti i membri del cerchio. Riduce errori di comunicazione e sovrapposizioni logistiche.
              </p>
            </div>

            <div className="space-y-4">
              <div className="w-12 h-12 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center shadow-sm text-emerald-700 dark:text-emerald-400">
                <Activity className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Interoperabilità Ticinese</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Moduli configurati per facilitare lo scambio di informazioni con operatori Spitex e istituzioni sanitarie cantonali.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Solutions Grid */}
      <section id="funzionalita" className="py-24 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-[0.2em] mb-4">Soluzioni integrate</h2>
            <h3 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-slate-100 tracking-tight mb-6 leading-tight">
              Un unico hub operativo per la gestione dell'assistenza
            </h3>
            <p className="text-slate-600 dark:text-slate-400 text-lg">
              Ottimizza il workflow familiare ed elimina la dispersione informativa causata da strumenti non specializzati.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="group p-8 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-emerald-200 dark:hover:border-emerald-700 hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-md bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 group-hover:bg-emerald-50 dark:group-hover:bg-emerald-900/40 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 flex items-center justify-center mb-8 transition-colors">
                <Users className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-3">Timeline Collaborativa</h4>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Diario di bordo condiviso in tempo reale. Ogni membro aggiorna lo stato e condivide informazioni cruciali istantaneamente.
              </p>
            </div>

            <div className="group p-8 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-emerald-200 dark:hover:border-emerald-700 hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-md bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 group-hover:bg-emerald-50 dark:group-hover:bg-emerald-900/40 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 flex items-center justify-center mb-8 transition-colors">
                <Pill className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-3">Gestione Terapie</h4>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Modulo farmaceutico con controllo incrociato dei dosaggi e tracking delle somministrazioni certificate dai caregiver.
              </p>
            </div>

            <div className="group p-8 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-emerald-200 dark:hover:border-emerald-700 hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-md bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 group-hover:bg-emerald-50 dark:group-hover:bg-emerald-900/40 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 flex items-center justify-center mb-8 transition-colors">
                <Calendar className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-3">Agenda & Turnistica</h4>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Pianificazione centralizzata di visite mediche e turni di assistenza domiciliare per una copertura familiare h24.
              </p>
            </div>

            <div className="group p-8 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-emerald-200 dark:hover:border-emerald-700 hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-md bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 group-hover:bg-emerald-50 dark:group-hover:bg-emerald-900/40 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 flex items-center justify-center mb-8 transition-colors">
                <FileText className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-3">Archivio Documentale</h4>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Safe digitale per la conservazione e condivisione di referti, prescrizioni e documentazione clinica indispensabile.
              </p>
            </div>

            <div className="group p-8 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-emerald-200 dark:hover:border-emerald-700 hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-md bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 group-hover:bg-emerald-50 dark:group-hover:bg-emerald-900/40 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 flex items-center justify-center mb-8 transition-colors">
                <BookOpen className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-3">Service Locator</h4>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Database integrato dei servizi sanitari cantonali, contatti Spitex locali e centri di supporto per la terza età.
              </p>
            </div>

            <div className="group p-8 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-emerald-200 dark:hover:border-emerald-700 hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-md bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 group-hover:bg-emerald-50 dark:group-hover:bg-emerald-900/40 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 flex items-center justify-center mb-8 transition-colors">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-3">Access Management</h4>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Controllo granulare degli accessi tramite sistema di inviti a tempo e codici di sicurezza rigenerabili.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Table */}
      <section id="prezzi" className="py-24 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-widest mb-4">Modello di abbonamento</h2>
            <h3 className="text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight mb-4">
              Soluzioni scalabili per ogni famiglia
            </h3>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Standard Plan */}
            <div className="bg-white dark:bg-slate-900 rounded-lg p-10 border border-slate-200 dark:border-slate-800 flex flex-col h-full shadow-sm">
              <div className="mb-10">
                <h4 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">Piano Standard</h4>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-4xl font-black text-slate-900 dark:text-slate-100 tracking-tight">0 CHF</span>
                  <span className="text-sm text-slate-500 dark:text-slate-500 font-semibold uppercase tracking-wider">/ mese</span>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Perfetto per nuclei familiari ristretti che necessitano di coordinamento essenziale.
                </p>
              </div>

              <ul className="space-y-4 mb-10 text-sm text-slate-700 dark:text-slate-300 flex-grow">
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-500 shrink-0" />
                  <span>Fino a 3 operatori abilitati</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-500 shrink-0" />
                  <span>Timeline operativa in tempo reale</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-500 shrink-0" />
                  <span>Gestione farmaci e agenda visite</span>
                </li>
              </ul>

              <button
                onClick={() => setCurrentView('login')}
                className="w-full h-13 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-black rounded-lg border border-slate-900 dark:border-slate-700 hover:bg-slate-900 hover:text-white dark:hover:bg-slate-700 transition-all text-sm uppercase tracking-widest"
              >
                Crea cerchio free
              </button>
            </div>

            {/* Enterprise Plan */}
            <div className="bg-white dark:bg-slate-900 rounded-lg p-10 border-2 border-emerald-700 flex flex-col h-full shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-emerald-700 text-white text-[10px] font-black px-4 py-2 uppercase tracking-[0.2em] rounded-bl-lg">
                Recommended
              </div>
              <div className="mb-10">
                <h4 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">Piano Famiglia Pro</h4>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-4xl font-black text-slate-900 dark:text-slate-100 tracking-tight">10 CHF</span>
                  <span className="text-sm text-slate-500 dark:text-slate-500 font-semibold uppercase tracking-wider">/ mese</span>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Progettato per coordinamenti complessi con badanti h24 e necessità documentali avanzate.
                </p>
              </div>

              <ul className="space-y-4 mb-10 text-sm text-slate-700 dark:text-slate-300 flex-grow">
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-500 shrink-0" />
                  <span className="font-bold">Membri e assistenti illimitati</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-500 shrink-0" />
                  <span>Archivio documentale senza limiti</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-500 shrink-0" />
                  <span>Report medici esportabili in PDF</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-500 shrink-0" />
                  <span>Supporto tecnico prioritario</span>
                </li>
              </ul>

              <button
                onClick={() => setCurrentView('login')}
                className="w-full h-13 bg-emerald-700 text-white font-black rounded-lg hover:bg-emerald-800 transition-all text-sm uppercase tracking-widest shadow-sm"
              >
                Attiva Pro
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Accordion FAQ */}
      <section id="faq" className="py-24 bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-[0.2em] mb-4">Centro Risposte</h2>
            <h3 className="text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
              Domande Frequenti
            </h3>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden transition-all"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-6 text-left flex items-center justify-between gap-4 font-bold text-slate-900 dark:text-slate-100 transition-colors"
                  >
                    <span className="text-base">{faq.q}</span>
                    <ChevronDown className={`w-5 h-5 text-slate-400 dark:text-slate-600 transition-transform ${isOpen ? 'rotate-180 text-emerald-700 dark:text-emerald-400' : ''}`} />
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-6 text-sm text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800 pt-5">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Corporate Footer */}
      <footer className="bg-slate-950 text-slate-500 py-20 border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-16 mb-20">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-lg bg-emerald-700 text-white flex items-center justify-center">
                  <Activity className="w-6 h-6" />
                </div>
                <span className="font-black text-xl text-white tracking-tight">Cerchio di Cura</span>
              </div>
              <p className="text-sm text-slate-400 mb-8 max-w-sm leading-relaxed">
                Piattaforma professionale per il coordinamento integrato dell'assistenza domiciliare. Garantiamo trasparenza operativa e sicurezza dei dati sanitari.
              </p>
              <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                <span>Swiss Made</span>
                <span className="w-1 h-1 bg-slate-800 rounded-full" />
                <span>GDPR Compliant</span>
                <span className="w-1 h-1 bg-slate-800 rounded-full" />
                <span>256-bit Encrypted</span>
              </div>
            </div>

            <div>
              <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-white mb-6">Risorse Esterne</h4>
              <ul className="space-y-4 text-xs font-bold">
                <li><a href="https://www.prosenectute.ch" target="_blank" rel="noreferrer" className="hover:text-emerald-500 transition-colors">Pro Senectute Ticino</a></li>
                <li><a href="https://www.spitex.ch" target="_blank" rel="noreferrer" className="hover:text-emerald-500 transition-colors">Spitex Svizzera</a></li>
                <li><a href="https://www4.ti.ch/dss/sanita" target="_blank" rel="noreferrer" className="hover:text-emerald-500 transition-colors">DSS Canton Ticino</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-white mb-6">Contatti Corporate</h4>
              <ul className="space-y-4 text-xs font-bold">
                <li><a href="mailto:info@sititicino.ch" className="hover:text-emerald-500 transition-colors">info@sititicino.ch</a></li>
                <li><span className="text-slate-200">Connect & Create SA</span></li>
                <li><a href="#privacy" className="hover:text-emerald-500 transition-colors">Legal & Compliance</a></li>
              </ul>
            </div>
          </div>

          <div className="pt-10 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-[10px] font-bold uppercase tracking-[0.2em] text-slate-600 gap-6">
            <p>© 2026 Cerchio di Cura. All Rights Reserved.</p>
            <p className="flex items-center gap-1">
              Operativo in <span className="text-slate-400">Canton Ticino 🇨🇭</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};
