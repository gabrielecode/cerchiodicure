import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { BookOpen, ChevronDown, ChevronUp, ExternalLink, Bookmark, Check, Activity, Search } from 'lucide-react';

export const GuidaTab: React.FC = () => {
  const { showToast } = useApp();
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [savedFavorites, setSavedFavorites] = useState<Record<number, boolean>>({});

  const articles = [
    {
      title: 'Protocollo Spitex: Accesso alle Cure Domiciliari',
      category: 'Sanità Pubblica',
      content:
        'Le prestazioni Spitex in Canton Ticino sono erogate previa certificazione medica. Il servizio coordina interventi infermieristici, aiuto domiciliare e assistenza specializzata. È necessario contattare l’antenna regionale di riferimento (es. Luganese, Locarnese, Bellinzonese) per l’attivazione del piano di cura individuale.',
      link: 'https://www3.ti.ch/dss/sw/temi/anziani/spitex.htm',
    },
    {
      title: 'Tutele Legali e Congedi per Caregiver',
      category: 'Diritto del Lavoro',
      content:
        'Il quadro normativo federale e cantonale prevede congedi retribuiti per l’assistenza a familiari con problemi di salute. Pro Senectute Ticino offre consulenza giuridica specifica per la gestione dei rapporti di lavoro e l’ottenimento di sgravi fiscali legati all’accudimento.',
      link: 'https://www.ti.ch',
    },
    {
      title: 'Sussidi Cantonali: Assegni di Grande Invalidità',
      category: 'Previdenza Sociale',
      content:
        'L’Istituto delle Assicurazioni Sociali (IAS) gestisce le istanze per l’ottenimento di indennità giornaliere e contributi per l’assistenza domiciliare. La procedura richiede una valutazione multidimensionale dello stato di autosufficienza del beneficiario.',
      link: 'https://www.ias.ti.ch',
    },
    {
      title: 'Rete Emergenze e Supporto Logistico',
      category: 'Sicurezza Territoriale',
      content:
        '• Centrale Operativa 144: Emergenze sanitarie h24\n• Croce Rossa Ticino: Trasporti assistiti e telesoccorso\n• Pro Senectute: Servizio pasti e animazione domiciliare\n• ATTE (Associazione Ticinese Terza Età): Supporto sociale e centri diurni',
      link: 'https://www.prosenectute.ch',
    },
  ];

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const handleSaveFavorite = (index: number, title: string) => {
    setSavedFavorites((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
    if (!savedFavorites[index]) {
      showToast(`Articolo "${title}" archiviato nei preferiti.`);
    } else {
      showToast(`Articolo "${title}" rimosso dall'archivio preferiti.`, 'info');
    }
  };

  return (
    <div className="w-full px-4 md:px-8 py-8 pb-24 md:pb-12 font-sans bg-slate-50 dark:bg-slate-950 min-h-screen transition-colors duration-300">
      <header className="mb-8 bg-white dark:bg-slate-900 p-6 rounded-lg shadow-sm border border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2 mb-1">
          <Activity className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
          <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Knowledge Base</span>
        </div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight leading-none">Normative & Guide Ticino</h1>
      </header>

      {/* Search Proxy */}
      <div className="mb-8 relative max-w-xl">
        <Search className="absolute left-4 top-3.5 w-4 h-4 text-slate-300 dark:text-slate-600" />
        <input 
          type="text" 
          placeholder="Ricerca termini legali o servizi (es. Spitex, IAS)..." 
          className="w-full h-12 pl-12 pr-4 rounded border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:border-emerald-700 dark:focus:border-emerald-500 shadow-sm font-medium dark:text-slate-100"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {articles.map((art, idx) => {
          const isOpen = openIndex === idx;
          const isSaved = !!savedFavorites[idx];
          return (
            <div
              key={idx}
              className={`bg-white dark:bg-slate-900 rounded-lg border transition-all duration-300 shadow-sm ${isOpen ? 'border-emerald-700 dark:border-emerald-500 ring-4 ring-emerald-50 dark:ring-emerald-900/20' : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'}`}
            >
              <button
                onClick={() => toggleAccordion(idx)}
                className="w-full p-6 text-left flex items-start justify-between gap-6"
              >
                <div className="flex-1">
                  <span className="text-[9px] font-black text-emerald-700 dark:text-emerald-400 uppercase tracking-[0.2em] block mb-2">
                    {art.category}
                  </span>
                  <h3 className="text-base font-black text-slate-900 dark:text-slate-100 tracking-tight leading-tight">{art.title}</h3>
                </div>
                <div className={`w-8 h-8 rounded border flex items-center justify-center transition-colors ${isOpen ? 'bg-emerald-700 dark:bg-emerald-600 text-white border-emerald-800 dark:border-emerald-700' : 'bg-slate-50 dark:bg-slate-800 text-slate-400 dark:text-slate-500 border-slate-200 dark:border-slate-700'}`}>
                  {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
              </button>

              {isOpen && (
                <div className="px-6 pb-6 pt-0 animate-in fade-in duration-500">
                  <div className="p-5 bg-slate-50 dark:bg-slate-800/50 rounded border border-slate-100 dark:border-slate-800 text-sm text-slate-600 dark:text-slate-400 leading-relaxed space-y-5">
                    <p className="whitespace-pre-line font-medium">{art.content}</p>

                    <div className="flex items-center justify-between pt-5 border-t border-slate-200 dark:border-slate-700">
                      <a
                        href={art.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-[10px] font-black text-emerald-700 dark:text-emerald-400 uppercase tracking-widest hover:text-emerald-800 dark:hover:text-emerald-300"
                      >
                        <span>Documentazione Esterna</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>

                      <button
                        onClick={() => handleSaveFavorite(idx, art.title)}
                        className={`inline-flex items-center gap-2 px-4 py-2 rounded text-[10px] font-black uppercase tracking-widest transition-all border ${
                          isSaved
                            ? 'bg-emerald-700 dark:bg-emerald-600 text-white border-emerald-800 dark:border-emerald-700 shadow-md'
                            : 'bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
                        }`}
                      >
                        {isSaved ? <Check className="w-3 h-3" /> : <Bookmark className="w-3 h-3" />}
                        <span>{isSaved ? 'Archiviato' : 'Archivia'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Corporate Info Footer */}
      <div className="mt-12 p-8 bg-slate-900 rounded-lg text-white border border-slate-800 shadow-xl overflow-hidden relative">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <BookOpen className="w-32 h-32" />
        </div>
        <div className="relative z-10">
          <h2 className="text-xl font-black tracking-tight mb-2 uppercase tracking-[0.1em]">Centro Supporto Caregiver</h2>
          <p className="text-slate-400 text-sm max-w-2xl leading-relaxed mb-6">
            La nostra Knowledge Base è aggiornata trimestralmente in collaborazione con i principali enti del Canton Ticino. Se necessiti di consulenza personalizzata, contatta il nostro hub di supporto.
          </p>
          <button className="h-11 px-8 bg-emerald-700 hover:bg-emerald-800 text-white font-black uppercase tracking-widest rounded transition-all text-[11px] shadow-lg">
            Apri Ticket Supporto
          </button>
        </div>
      </div>
    </div>
  );
};
