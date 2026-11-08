import React, { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';

export const InstallBanner: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Check if already in standalone mode
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true;

    if (isStandalone) {
      return;
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowBanner(true);
    };

    const handleCustomInstall = () => {
      setShowBanner(true);
    };

    window.addEventListener('beforeinstallprompt', handler);
    window.addEventListener('pwa-install', handleCustomInstall);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
      window.removeEventListener('pwa-install', handleCustomInstall);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      alert('Per installare l’app, usa il menu del tuo browser (Aggiungi a schermata Home o Installa app).');
      setShowBanner(false);
      return;
    }

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
    }
    setDeferredPrompt(null);
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-20 left-4 right-4 md:bottom-6 md:right-6 md:left-auto md:w-80 z-50 max-w-md mx-auto bg-white rounded-2xl p-4 shadow-xl border border-[#7BA88A]/30 flex items-center justify-between gap-3 animate-slide-down">
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 bg-[#7BA88A]/20 text-[#7BA88A] rounded-2xl flex items-center justify-center shrink-0">
          <Download className="w-6 h-6" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-[#2D3748]">Installa Cerchio di Cura</h4>
          <p className="text-[11px] text-slate-500">Accesso rapido e uso offline.</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={handleInstallClick}
          className="px-3.5 py-2 bg-[#7BA88A] text-white font-semibold rounded-xl text-xs shadow-sm hover:bg-[#6c987c] transition-all whitespace-nowrap"
        >
          Installa
        </button>
        <button
          onClick={() => setShowBanner(false)}
          className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
          aria-label="Chiudi"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
