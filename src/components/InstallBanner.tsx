import React, { useState, useEffect } from 'react';
import { Download, X, Smartphone, Apple } from 'lucide-react';
import { PWAInstallModal } from './PWAInstallModal';

export const InstallBanner: React.FC = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // Check if already in standalone mode
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true;

    if (isStandalone) {
      return;
    }

    const dismissed = sessionStorage.getItem('pwa-banner-dismissed');
    if (!dismissed) {
      setShowBanner(true);
    }

    const handleCustomInstall = () => {
      setShowModal(true);
    };

    window.addEventListener('pwa-install', handleCustomInstall);
    return () => {
      window.removeEventListener('pwa-install', handleCustomInstall);
    };
  }, []);

  const handleDismiss = () => {
    setShowBanner(false);
    sessionStorage.setItem('pwa-banner-dismissed', 'true');
  };

  return (
    <>
      {showBanner && (
        <aside 
          aria-label="Installazione Web App"
          className="fixed bottom-20 left-4 right-4 md:bottom-6 md:right-6 md:left-auto md:w-96 z-50 max-w-md mx-auto bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-2xl border border-emerald-500/30 dark:border-emerald-500/20 flex items-center justify-between gap-3 animate-slide-down transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 rounded-2xl flex items-center justify-center shrink-0 border border-emerald-200 dark:border-emerald-800">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className="text-xs font-black text-slate-900 dark:text-slate-100">Web App Cerchio</span>
                <span className="flex items-center gap-1 text-[9px] bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300 font-bold px-1.5 py-0.5 rounded">
                  <Apple className="w-2.5 h-2.5" /> <Smartphone className="w-2.5 h-2.5" />
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Installa su iPhone o Android.</p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setShowModal(true)}
              className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-xs shadow-sm transition-all whitespace-nowrap"
            >
              Installa
            </button>
            <button
              onClick={handleDismiss}
              className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg transition-colors"
              aria-label="Chiudi banner installazione"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </aside>
      )}

      <PWAInstallModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </>
  );
};
