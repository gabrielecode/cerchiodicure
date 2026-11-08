import React from 'react';
import { useApp } from '../context/AppContext';
import { ArrowLeft, ShieldCheck, Lock, Database, UserCheck, Mail } from 'lucide-react';

export const PrivacyPolicy: React.FC = () => {
  const { setCurrentView } = useApp();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-700 dark:text-slate-300 transition-colors duration-300">
      <header className="sticky top-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <button
            onClick={() => setCurrentView('landing')}
            className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-500 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Torna alla Home</span>
          </button>
          <span className="text-xs font-black uppercase tracking-widest text-slate-400">Cerchio di Cura</span>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white dark:bg-slate-900 rounded-lg p-8 sm:p-12 shadow-sm border border-slate-200 dark:border-slate-800 space-y-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-emerald-50 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-400 text-[10px] font-black uppercase tracking-widest mb-4">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Informativa sulla Protezione dei Dati</span>
            </div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">Privacy Policy</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
              Trattamento dati personali e sanitari secondo la nuova Legge federale sulla protezione dei dati (nLPD).
            </p>
          </div>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-emerald-700 dark:text-emerald-400" />
              1. Titolare del Trattamento
            </h2>
            <div className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg border border-slate-200 dark:border-slate-800">
              <p><strong>Connect & Create</strong></p>
              <p>Sede: Canton Ticino, Svizzera</p>
              <p className="flex items-center gap-1 mt-1">
                <Mail className="w-3.5 h-3.5" />
                <span>Contatto e-mail: </span>
                <a href="mailto:info@sititicino.ch" className="text-emerald-700 dark:text-emerald-400 hover:underline">info@sititicino.ch</a>
              </p>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Database className="w-5 h-5 text-emerald-700 dark:text-emerald-400" />
              2. Dati Raccolti e Categorie di Dati
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              La piattaforma raccoglie esclusivamente i dati necessari all'erogazione del servizio di coordinamento assistenziale domiciliare:
            </p>
            <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1.5 leading-relaxed">
              <li><strong>Dati dell'utente/caregiver:</strong> indirizzo email (utilizzato per l'invio del link di accesso), nome o identificativo operatore, ruolo all'interno del cerchio.</li>
              <li><strong>Dati del beneficiario di cura:</strong> nominativo del destinatario dell'assistenza, note operative, preferenze o restrizioni alimentari.</li>
              <li><strong>Dati sanitari e terapeutici:</strong> denominazione farmaci, orari di somministrazione, dosaggi, conferme di avvenuta assunzione, appuntamenti medici e documenti clinici (PDF, immagini caricate dai membri autorizzati).</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Lock className="w-5 h-5 text-emerald-700 dark:text-emerald-400" />
              3. Finalità del Trattamento e Base Giuridica
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              I dati vengono trattati unicamente per consentire il coordinamento operativo tra familiari, badanti e personale medico o Spitex accreditato sul territorio. Il trattamento è svolto nel rispetto della <strong>nuova Legge federale sulla protezione dei dati (nLPD)</strong> della Confederazione Svizzera e basato sul consenso esplicito manifestato tramite l'adesione al cerchio e l'inserimento dei dati.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-700 dark:text-emerald-400" />
              4. Misure di Sicurezza e Fornitore Tecnologico (Google Firebase)
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              I dati sono <strong>cifrati in transito (HTTPS/TLS) e a riposo (encryption at rest)</strong>.
            </p>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              L'accesso ai dati è rigorosamente <strong>limitato ai membri del cerchio tramite codice invito</strong> univoco e regole di sicurezza server-side (Firebase Firestore Rules e Storage Rules). I servizi di database, autenticazione e archiviazione cloud sono forniti da Google Firebase (Google Cloud Platform), con standard di sicurezza certificati (ISO 27001, SOC 1/2/3).
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              5. Diritti dell'Utente
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              In accordo con la nLPD, gli utenti hanno il diritto in qualsiasi momento di:
            </p>
            <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1 leading-relaxed">
              <li>Richiedere l'accesso ai propri dati personali registrati.</li>
              <li>Chiedere la rettifica di dati inesatti o incompleti.</li>
              <li>Richiedere la cancellazione dei dati (diritto all'oblio) o la rimozione dal cerchio di cura.</li>
              <li>Revocare il proprio consenso al trattamento scrivendo a <a href="mailto:info@sititicino.ch" className="text-emerald-700 dark:text-emerald-400 hover:underline">info@sititicino.ch</a>.</li>
            </ul>
          </section>

          <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center text-xs text-slate-400">
            <span>Ultimo aggiornamento: Novembre 2026</span>
            <button
              onClick={() => setCurrentView('landing')}
              className="text-emerald-700 dark:text-emerald-400 font-bold hover:underline"
            >
              Ritorna all'applicazione
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};
