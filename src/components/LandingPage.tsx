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
  Globe2
} from 'lucide-react';
import { InstallBanner } from './InstallBanner';

export const LandingPage: React.FC = () => {
  const { setCurrentView } = useApp();
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: 'I dati sanitari e familiari sono sicuri?',
      a: 'Assolutamente sì. Cerchio di Cura è progettato con un’architettura Privacy First. I dati sono salvati in modo sicuro e accessibili unicamente ai membri invitati tramite codice segreto del cerchio.'
    },
    {
      q: 'Come avviene il coordinamento con i servizi Spitex in Ticino?',
      a: 'La sezione Guida e Documenti permette di condividere il piano di assistenza e i referti con gli infermieri Spitex e i medici di famiglia nel Canton Ticino, facilitando la comunicazione quotidiana.'
    },
    {
      q: 'Come faccio a invitare fratelli, parenti o badanti?',
      a: 'Basta condividere il codice invito del cerchio (es. ROSA42) generato durante la configurazione. Chiunque può scaricare l’app e unirsi in pochi secondi inserendo il codice.'
    },
    {
      q: 'L’applicazione sostituisce il parere dei medici?',
      a: 'No. Cerchio di Cura è uno strumento di coordinamento organizzativo e condivisione familiare. Non sostituisce in alcun modo le diagnosi o le prescrizioni dei medici curanti.'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 flex flex-col selection:bg-[#7BA88A]/20 selection:text-[#7BA88A]">
      <InstallBanner />

      {/* Sticky Header */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setCurrentView('landing')}>
            <div className="w-11 h-11 rounded-2xl bg-[#7BA88A]/20 text-[#7BA88A] flex items-center justify-center shadow-2xs">
              <HeartHandshake className="w-6 h-6 text-[#7BA88A]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg text-slate-900 tracking-tight">Cerchio di Cura</span>
                <span className="text-xs bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
                  🇨🇭 Ticino
                </span>
              </div>
              <p className="text-[11px] text-slate-500">Assistenza Familiare Condivisa</p>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <a href="#funzionalita" className="hover:text-[#7BA88A] transition-colors">Funzionalità</a>
            <a href="#privacy" className="hover:text-[#7BA88A] transition-colors">Privacy & EEAT</a>
            <a href="#prezzi" className="hover:text-[#7BA88A] transition-colors">Prezzi</a>
            <a href="#faq" className="hover:text-[#7BA88A] transition-colors">FAQ</a>
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setCurrentView('login')}
              className="text-sm font-semibold text-slate-700 hover:text-[#7BA88A] px-4 py-2.5 transition-colors"
            >
              Accedi
            </button>
            <button
              onClick={() => setCurrentView('login')}
              className="bg-[#7BA88A] hover:bg-[#6c987c] text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-md transition-all active:scale-95 flex items-center gap-2"
            >
              <span>Crea il tuo cerchio</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-24 lg:pt-24 lg:pb-32 bg-gradient-to-b from-white via-slate-50 to-[#E8F0FE]/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#7BA88A]/15 text-[#7BA88A] text-xs font-semibold mb-6">
                <Sparkles className="w-4 h-4" />
                <span>Punto di riferimento per le famiglie in Ticino</span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15] mb-6">
                Coordinare l'assistenza non deve essere <span className="text-[#7BA88A]">un secondo lavoro</span>.
              </h1>
              <p className="text-lg sm:text-xl text-slate-600 mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Riunisci familiari, fratelli e badanti in un unico cerchio digitale sicuro. Monitora farmaci, turni di visita e appuntamenti medici in tempo reale, senza stress.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <button
                  onClick={() => setCurrentView('login')}
                  className="w-full sm:w-auto h-14 bg-[#7BA88A] hover:bg-[#6c987c] text-white font-bold px-8 rounded-2xl shadow-lg shadow-[#7BA88A]/25 transition-all active:scale-98 flex items-center justify-center gap-3 text-base"
                >
                  <span>Crea il tuo cerchio gratuito</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setCurrentView('login')}
                  className="w-full sm:w-auto h-14 bg-white hover:bg-slate-100 text-slate-800 font-bold px-8 rounded-2xl border border-slate-200 shadow-sm transition-all flex items-center justify-center gap-2 text-base"
                >
                  <span>Ho già un codice invito</span>
                </button>
              </div>

              <div className="mt-8 flex items-center justify-center lg:justify-start gap-6 text-xs text-slate-500">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#7BA88A]" /> Nessuna carta di credito richiesta
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#7BA88A]" /> Configurazione in 1 minuto
                </span>
              </div>
            </div>

            {/* Visual Mockup Card */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-3xl p-6 shadow-xl border border-slate-200 relative">
                <div className="absolute -top-4 -right-4 bg-emerald-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md flex items-center gap-1">
                  <span>🟢 Live in Ticino</span>
                </div>
                <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
                  <div className="flex items-center gap-3">
                    <span className="w-10 h-10 rounded-xl bg-[#7BA88A]/20 text-[#7BA88A] flex items-center justify-center font-bold">👵</span>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">Cerchio di Nonna Rosa</h4>
                      <p className="text-[11px] text-slate-500">3 membri attivi oggi</p>
                    </div>
                  </div>
                  <span className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-lg font-mono">ROSA42</span>
                </div>

                <div className="space-y-3">
                  <div className="p-3 bg-emerald-50/70 border border-emerald-100 rounded-2xl flex items-start gap-3">
                    <span className="text-lg">💊</span>
                    <div>
                      <p className="text-xs font-semibold text-emerald-900">Cardioaspirin (100mg)</p>
                      <p className="text-[11px] text-emerald-700">Dose delle 08:00 confermata da Marco</p>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50 border border-slate-100 rounded-2xl flex items-start gap-3">
                    <span className="text-lg">🚗</span>
                    <div>
                      <p className="text-xs font-semibold text-slate-900">Visita Cardiologo Dr. Rossi</p>
                      <p className="text-[11px] text-slate-500">Oggi alle 10:00 • Accompagna Giulia</p>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50 border border-slate-100 rounded-2xl flex items-start gap-3">
                    <span className="text-lg">🍲</span>
                    <div>
                      <p className="text-xs font-semibold text-slate-900">Pranzo e Compagnia</p>
                      <p className="text-[11px] text-slate-500">Turno completato da Ana (Badante)</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span>Sincronizzato in tempo reale</span>
                  <span className="font-semibold text-[#7BA88A]">Canton Ticino 🇨🇭</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Bar (EEAT) */}
      <section id="privacy" className="py-12 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="w-12 h-12 rounded-2xl bg-[#7BA88A]/15 text-[#7BA88A] flex items-center justify-center shrink-0">
                <Globe2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 mb-1">🇨🇭 Pensato per il Ticino</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Sviluppato sulle esigenze delle famiglie ticinesi, con riferimenti a Spitex, Pro Senectute e sussidi cantonali.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="w-12 h-12 rounded-2xl bg-[#7BA88A]/15 text-[#7BA88A] flex items-center justify-center shrink-0">
                <Lock className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 mb-1">🔒 Privacy First & Dati Locali</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  I dati della tua famiglia rimangono protetti. Nessuna condivisione pubblicitaria o indicizzazione esterna.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="w-12 h-12 rounded-2xl bg-[#7BA88A]/15 text-[#7BA88A] flex items-center justify-center shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 mb-1">🤝 Supporto Etico & Professionale</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Progettato per affiancare caregiver e familiari, riducendo il carico mentale senza sostituirsi ai medici.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="funzionalita" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold text-[#7BA88A] uppercase tracking-wider mb-2">Funzionalità complete</h2>
            <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-4">
              Tutto ciò che serve per la cura quotidiana in un unico posto
            </h3>
            <p className="text-slate-600 text-base">
              Elimina le chat di gruppo caotiche e le dimenticanze. Cerchio di Cura organizza ogni aspetto dell'assistenza.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200/80 hover:shadow-md transition-all">
              <div className="w-14 h-14 rounded-2xl bg-[#7BA88A]/15 text-[#7BA88A] flex items-center justify-center mb-6">
                <Users className="w-7 h-7" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 mb-2">Timeline e Diario Condiviso</h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                Aggiornamenti in tempo reale tra familiari, fratelli e badanti. Condividi note, pasti, umore e foto della giornata.
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200/80 hover:shadow-md transition-all">
              <div className="w-14 h-14 rounded-2xl bg-[#7BA88A]/15 text-[#7BA88A] flex items-center justify-center mb-6">
                <Pill className="w-7 h-7" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 mb-2">Gestione Farmaci & Dosi</h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                Orari delle terapie, dosaggi e spunte di avvenuta somministrazione per evitare doppie dosi o dimenticanze critiche.
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200/80 hover:shadow-md transition-all">
              <div className="w-14 h-14 rounded-2xl bg-[#7BA88A]/15 text-[#7BA88A] flex items-center justify-center mb-6">
                <Calendar className="w-7 h-7" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 mb-2">Calendario & Turni di Cura</h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                Pianifica chi fa visita al caro, le visite mediche specialistiche e le commissioni senza sovrapposizioni.
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200/80 hover:shadow-md transition-all">
              <div className="w-14 h-14 rounded-2xl bg-[#7BA88A]/15 text-[#7BA88A] flex items-center justify-center mb-6">
                <FileText className="w-7 h-7" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 mb-2">Documenti & Prescrizioni</h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                Conserva referti medici, prescrizioni e piani Spitex in un archivio digitale sicuro e sempre accessibile.
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200/80 hover:shadow-md transition-all">
              <div className="w-14 h-14 rounded-2xl bg-[#7BA88A]/15 text-[#7BA88A] flex items-center justify-center mb-6">
                <BookOpen className="w-7 h-7" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 mb-2">Guida Locale Ticino</h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                Accesso rapido ai contatti di emergenza, Spitex cantonale, Pro Senectute, centri diurni e servizi di supporto.
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200/80 hover:shadow-md transition-all">
              <div className="w-14 h-14 rounded-2xl bg-[#7BA88A]/15 text-[#7BA88A] flex items-center justify-center mb-6">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 mb-2">Accesso con Codice Invito</h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                Ogni cerchio ha un codice unico e sicuro. Nessuno può accedere senza l'invito esplicito dei familiari amministratori.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="prezzi" className="py-24 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold text-[#7BA88A] uppercase tracking-wider mb-2">Trasparenza e Prezzi</h2>
            <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-4">
              Piani trasparenti per ogni esigenza familiare
            </h3>
            <p className="text-slate-600 text-base">
              Inizia gratis con il tuo cerchio di famiglia, senza vincoli.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free Plan */}
            <div className="bg-slate-50 rounded-3xl p-8 border border-slate-200 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-xl font-bold text-slate-900">Cerchio Base</h4>
                  <span className="text-xs bg-slate-200 text-slate-700 font-semibold px-3 py-1 rounded-full">Gratuito</span>
                </div>
                <p className="text-xs text-slate-600 mb-6">Ideale per iniziare a coordinare l'assistenza essenziale.</p>
                <div className="text-3xl font-extrabold text-slate-900 mb-6">0 CHF <span className="text-xs font-normal text-slate-500">/ per sempre</span></div>

                <div className="space-y-3 mb-8 text-xs text-slate-700">
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#7BA88A] shrink-0" />
                    <span>Fino a 3 membri nel cerchio</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#7BA88A] shrink-0" />
                    <span>Timeline e diario condiviso</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#7BA88A] shrink-0" />
                    <span>Gestione farmaci e dosi base</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#7BA88A] shrink-0" />
                    <span>Calendario turni e visite</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setCurrentView('login')}
                className="w-full h-12 bg-white text-slate-800 font-bold rounded-xl border border-slate-300 hover:bg-slate-100 transition-all text-sm shadow-sm"
              >
                Inizia gratis
              </button>
            </div>

            {/* Pro Plan */}
            <div className="bg-[#7BA88A]/10 rounded-3xl p-8 border-2 border-[#7BA88A] flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-4 right-4 bg-[#7BA88A] text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                Consigliato
              </div>
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-xl font-bold text-slate-900">Cerchio Famiglia Pro</h4>
                  <span className="text-xs bg-[#7BA88A] text-white font-semibold px-3 py-1 rounded-full">Illimitato</span>
                </div>
                <p className="text-xs text-slate-600 mb-6">Per famiglie numerose, badanti e coordinamento avanzato.</p>
                <div className="text-3xl font-extrabold text-slate-900 mb-6">10 CHF <span className="text-xs font-normal text-slate-500">/ mese</span></div>

                <div className="space-y-3 mb-8 text-xs text-slate-700">
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#7BA88A] shrink-0" />
                    <span>Membri e assistenti illimitati</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#7BA88A] shrink-0" />
                    <span>Storico illimitato farmaci e referti</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#7BA88A] shrink-0" />
                    <span>Esportazione PDF riassunti medici</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#7BA88A] shrink-0" />
                    <span>Supporto prioritario in Ticino</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setCurrentView('login')}
                className="w-full h-12 bg-[#7BA88A] text-white font-bold rounded-xl hover:bg-[#6c987c] transition-all text-sm shadow-md"
              >
                Attiva Famiglia Pro
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-24 bg-slate-50 border-t border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-xs font-bold text-[#7BA88A] uppercase tracking-wider mb-2">Domande Frequenti</h2>
            <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Tutto quello che devi sapere su Cerchio di Cura
            </h3>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs transition-all"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-6 text-left flex items-center justify-between gap-4 font-bold text-slate-900 hover:text-[#7BA88A] transition-colors"
                  >
                    <span className="text-base">{faq.q}</span>
                    <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${isOpen ? 'rotate-180 text-[#7BA88A]' : ''}`} />
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-6 text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-4">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-16 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-2xl bg-[#7BA88A]/20 text-[#7BA88A] flex items-center justify-center">
                  <HeartHandshake className="w-5 h-5 text-[#7BA88A]" />
                </div>
                <span className="font-bold text-lg text-white tracking-tight">Cerchio di Cura</span>
              </div>
              <p className="text-xs text-slate-400 mb-4 max-w-sm leading-relaxed">
                La piattaforma digitale ticinese per il coordinamento dell'assistenza familiare agli anziani non autosufficienti.
              </p>
              <p className="text-[11px] text-slate-500">
                🇨🇭 Progettato per il Canton Ticino • Conforme agli standard di privacy e protezione dati.
              </p>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">Link Utili Ticino</h4>
              <ul className="space-y-2.5 text-xs">
                <li><a href="https://www.prosenectute.ch" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">Pro Senectute Ticino</a></li>
                <li><a href="https://www.spitex.ch" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">Spitex Ticino</a></li>
                <li><a href="https://www4.ti.ch" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">Canton Ticino - Sanità</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">Contatti & Info</h4>
              <ul className="space-y-2.5 text-xs">
                <li><a href="mailto:info@sititicino.ch" className="hover:text-white transition-colors flex items-center gap-1">✉️ info@sititicino.ch</a></li>
                <li><span className="text-slate-400 font-semibold">Creato da Connect & Create</span></li>
                <li><a href="#privacy" className="hover:text-white transition-colors">Informativa sulla Privacy</a></li>
                <li><a href="#faq" className="hover:text-white transition-colors">Termini di Servizio</a></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
            <p>© 2026 Cerchio di Cura Ticino. Creato da <span className="text-slate-300 font-semibold">Connect & Create</span>. Tutti i diritti riservati.</p>
            <p className="flex items-center gap-1">
              Contattaci: <a href="mailto:info@sititicino.ch" className="text-[#7BA88A] hover:underline font-semibold">info@sititicino.ch</a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};
