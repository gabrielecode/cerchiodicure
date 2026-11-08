import React, { useState, useEffect } from 'react';
import { X, Smartphone, Apple, Monitor, Download, Share, PlusSquare, CheckCircle, ArrowRight, Sparkles } from 'lucide-react';

interface PWAInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PWAInstallModal: React.FC<PWAInstallModalProps> = ({ isOpen, onClose }) => {
  const [activeDevice, setActiveDevice] = useState<'ios' | 'android' | 'desktop'>('ios');
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Detect OS for smart default tab
    const ua = navigator.userAgent.toLowerCase();
    if (/iphone|ipad|ipod/.test(ua)) {
      setActiveDevice('ios');
    } else if (/android/.test(ua)) {
      setActiveDevice('android');
    } else {
      setActiveDevice('desktop');
    }

    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true;
    setIsInstalled(isStandalone);

    const handlePrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handlePrompt);
    return () => window.removeEventListener('beforeinstallprompt', handlePrompt);
  }, []);

  if (!isOpen) return null;

  const handleNativeInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === 'accepted') {
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
    } else {
      alert('Seleziona "Aggiungi a schermata Home" dal menu del tuo browser.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 w-full max-w-xl rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        {/* Header */}
        <div className="p-6 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-700/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-md">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900 dark:text-slate-100 tracking-tight">
                Installa Cerchio di Cura
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Web App nativa per Apple iOS, Android e Computer
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-white dark:hover:bg-slate-800 rounded-xl transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Device Switcher Tabs */}
        <div className="p-4 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800">
          <div className="grid grid-cols-3 gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
            <button
              onClick={() => setActiveDevice('ios')}
              className={`py-2.5 px-3 rounded-lg text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                activeDevice === 'ios'
                  ? 'bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-400 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100'
              }`}
            >
              <Apple className="w-4 h-4" />
              <span>Apple iOS</span>
            </button>
            <button
              onClick={() => setActiveDevice('android')}
              className={`py-2.5 px-3 rounded-lg text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                activeDevice === 'android'
                  ? 'bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-400 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100'
              }`}
            >
              <Smartphone className="w-4 h-4" />
              <span>Android</span>
            </button>
            <button
              onClick={() => setActiveDevice('desktop')}
              className={`py-2.5 px-3 rounded-lg text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                activeDevice === 'desktop'
                  ? 'bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-400 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100'
              }`}
            >
              <Monitor className="w-4 h-4" />
              <span>PC / Mac</span>
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Apple iOS Guide */}
          {activeDevice === 'ios' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300 font-medium">
                💡 <strong>iPhone & iPad:</strong> Grazie alla tecnologia PWA, non serve passare da App Store. Si installa direttamente dal browser Safari in 3 semplici passaggi:
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
                  <div className="w-7 h-7 rounded-lg bg-emerald-700 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    1
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                      Apri in Safari e tocca il tasto Condividi
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-1.5">
                      Tocca l'icona <Share className="w-3.5 h-3.5 text-blue-500 inline" /> nella barra in basso di Safari.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
                  <div className="w-7 h-7 rounded-lg bg-emerald-700 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    2
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                      Seleziona "Aggiungi alla schermata Home"
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-1.5">
                      Scorri le opzioni verso il basso e tocca <PlusSquare className="w-3.5 h-3.5 text-slate-600 dark:text-slate-400 inline" /> <strong>"Aggiungi alla schermata Home"</strong>.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
                  <div className="w-7 h-7 rounded-lg bg-emerald-700 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    3
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                      Conferma toccando "Aggiungi"
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      L'icona di Cerchio di Cura comparirà sulla schermata principale del tuo iPhone come una vera app.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Android Guide */}
          {activeDevice === 'android' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300 font-medium">
                💡 <strong>Smartphone Android (Samsung, Xiaomi, Pixel...):</strong> Puoi installare Cerchio di Cura istantaneamente con un click o dal menu del browser Google Chrome / Samsung Internet.
              </div>

              {deferredPrompt ? (
                <button
                  onClick={handleNativeInstall}
                  className="w-full h-14 bg-emerald-700 hover:bg-emerald-800 text-white font-black uppercase tracking-widest rounded-xl shadow-lg transition-all flex items-center justify-center gap-3 text-xs"
                >
                  <Download className="w-4 h-4" />
                  <span>Installa Subito su questo dispositivo</span>
                </button>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
                    <div className="w-7 h-7 rounded-lg bg-emerald-700 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                      1
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                        Apri il menu di Google Chrome
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Tocca i 3 puntini verticali <strong>⋮</strong> in alto a destra nel browser.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
                    <div className="w-7 h-7 rounded-lg bg-emerald-700 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                      2
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                        Tocca "Installa applicazione" o "Aggiungi a Home"
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        L'app verrà installata nel cassetto delle tue applicazioni e riceverai le notifiche push.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Desktop Guide */}
          {activeDevice === 'desktop' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300 font-medium">
                💡 <strong>Computer Windows & Mac:</strong> Puoi installare Cerchio di Cura come finestra indipendente sul tuo desktop per un accesso rapido h24.
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
                  <div className="w-7 h-7 rounded-lg bg-emerald-700 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    1
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                      Icona nella barra degli indirizzi
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Nella barra dell'URL in alto a destra (su Chrome o Edge), fai clic sull'icona <strong>Installa app</strong> (o icona con freccia verso il basso).
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
                  <div className="w-7 h-7 rounded-lg bg-emerald-700 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    2
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                      Conferma "Installa"
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Cerchio di Cura si aprirà in una finestra autonoma e potrai fissarla alla barra delle applicazioni o al Dock del Mac.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Benefits summary */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 grid grid-cols-3 gap-2 text-center">
            <div className="p-2">
              <p className="text-[10px] font-black uppercase tracking-wider text-emerald-700 dark:text-emerald-400">Zero MB</p>
              <p className="text-[10px] text-slate-400">Non appesantisce</p>
            </div>
            <div className="p-2 border-x border-slate-100 dark:border-slate-800">
              <p className="text-[10px] font-black uppercase tracking-wider text-emerald-700 dark:text-emerald-400">Schermo Intero</p>
              <p className="text-[10px] text-slate-400">Senza barre browser</p>
            </div>
            <div className="p-2">
              <p className="text-[10px] font-black uppercase tracking-wider text-emerald-700 dark:text-emerald-400">Sempre Attiva</p>
              <p className="text-[10px] text-slate-400">Notifiche e offline</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-200 dark:border-slate-700/60 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-bold text-xs rounded-xl transition-all"
          >
            Ho capito, chiudi
          </button>
        </div>
      </div>
    </div>
  );
};
