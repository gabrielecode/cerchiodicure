import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { BookOpen, ChevronDown, ChevronUp, ExternalLink, Bookmark, Check } from 'lucide-react';

export const GuidaTab: React.FC = () => {
  const { showToast } = useApp();
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [savedFavorites, setSavedFavorites] = useState<Record<number, boolean>>({});

  const articles = [
    {
      title: 'Come richiedere aiuto Spitex in Ticino',
      category: 'Assistenza Sanitaria',
      content:
        'Le cure Spitex (assistenza e cura a domicilio) in Ticino possono essere richieste su prescrizione medica (del medico curante). È possibile contattare il servizio Spitex regionale del proprio distretto (es. Mendrisio, Lugano, Locarno, Bellinzona) per una valutazione iniziale dei bisogni infermieristici e di igiene.',
      link: 'https://www3.ti.ch/dss/sw/temi/anziani/spitex.htm',
    },
    {
      title: 'Diritti dell’assistente familiare',
      category: 'Lavoro & Famiglia',
      content:
        'I familiari che assistono un congiunto non autosufficiente in Ticino hanno diritto a diverse tutele, tra cui congedi di accudimento retribuiti (secondo le leggi federali e cantonali), consulenza specializzata e supporto psicologico tramite Pro Senectute Ticino.',
      link: 'https://www.ti.ch',
    },
    {
      title: 'Indennità per cure e contributi assistenziali',
      category: 'Finanze & Sussidi',
      content:
        'L’assegno per grandi invalidi e le indennità giornaliere per cure fornite dai familiari sono erogati dall’Istituto delle Assicurazioni Sociali (IAS) del Canton Ticino, a seguito di perizia medico-sociale che attesti il grado di non autosufficienza.',
      link: 'https://www.ias.ti.ch',
    },
    {
      title: 'Contatti Utili: Pro Senectute, Croce Rossa, ACSI',
      category: 'Contatti di Emergenza',
      content:
        '• Pro Senectute Ticino: Consulenza sociale e pasti a domicilio (Tel. 091 912 17 17)\n• Croce Rossa Svizzera - Sezione Ticino: Trasporti sanitari e picchetto di soccorso\n• ACSI (Associazione Consumatori della Svizzera Italiana): Per tutela e difesa dei diritti sociosanitari\n• Numero unico di emergenza: 144',
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
      showToast(`"${title}" salvato nei preferiti`);
    } else {
      showToast(`"${title}" rimosso dai preferiti`, 'info');
    }
  };

  return (
    <div className="w-full px-4 md:px-8 py-6 pb-24 md:pb-12 font-sans">
      <header className="mb-6 bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
        <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Informazioni Utili</span>
        <h1 className="text-lg font-bold text-[#2D3748]">Guida e Normative Ticino</h1>
      </header>

      <div className="space-y-3">
        {articles.map((art, idx) => {
          const isOpen = openIndex === idx;
          const isSaved = !!savedFavorites[idx];
          return (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden transition-all"
            >
              <button
                onClick={() => toggleAccordion(idx)}
                className="w-full p-4 text-left flex items-center justify-between gap-3 hover:bg-slate-50/50 transition-colors"
              >
                <div>
                  <span className="text-[10px] font-semibold text-[#7BA88A] uppercase tracking-wider block mb-0.5">
                    {art.category}
                  </span>
                  <h3 className="text-sm font-bold text-[#2D3748]">{art.title}</h3>
                </div>
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 shrink-0">
                  {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
              </button>

              {isOpen && (
                <div className="px-4 pb-4 pt-1 border-t border-slate-100 text-xs text-slate-600 leading-relaxed space-y-3">
                  <p className="whitespace-pre-line">{art.content}</p>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                    <a
                      href={art.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-[#7BA88A] font-semibold hover:underline"
                    >
                      <span>Sito ufficiale ti.ch</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>

                    <button
                      onClick={() => handleSaveFavorite(idx, art.title)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
                        isSaved
                          ? 'bg-[#7BA88A] text-white border-[#7BA88A]'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {isSaved ? <Check className="w-3.5 h-3.5" /> : <Bookmark className="w-3.5 h-3.5" />}
                      <span>{isSaved ? 'Salvato' : 'Salva preferito'}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
