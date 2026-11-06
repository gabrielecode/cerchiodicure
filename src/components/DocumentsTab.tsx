import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Plus, FileText, Download, X, Calendar, User } from 'lucide-react';
import { CareDocument } from '../types';

export const DocumentsTab: React.FC = () => {
  const { documents, addDocument, showToast } = useApp();
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<CareDocument | null>(null);

  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('Marco');
  const [fileType, setFileType] = useState('PDF');

  const handleAddDocument = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      showToast('Inserisci il titolo del documento', 'info');
      return;
    }

    const todayStr = new Date().toLocaleDateString('it-CH', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).replace(/\//g, '.');

    addDocument({
      title: title.trim(),
      date: todayStr,
      author: author.trim(),
      fileSize: '1.5 MB',
      fileType,
    });

    setTitle('');
    setShowAddModal(false);
  };

  const handleDownloadMock = (docTitle: string) => {
    showToast(`Scaricamento di "${docTitle}" simulato con successo`);
    setSelectedDoc(null);
  };

  return (
    <div className="w-full px-4 md:px-8 py-6 pb-24 md:pb-12 font-sans">
      <header className="mb-6 bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
        <div>
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Archivio Condiviso</span>
          <h1 className="text-lg font-bold text-[#2D3748]">Documenti e Referti</h1>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="w-10 h-10 rounded-xl bg-[#7BA88A] text-white flex items-center justify-center hover:bg-[#6c987c] transition-all shadow-sm"
          title="Carica documento"
        >
          <Plus className="w-5 h-5" />
        </button>
      </header>

      {/* Grid of Cards */}
      <div className="grid grid-cols-1 gap-3">
        {documents.map((doc) => (
          <div
            key={doc.id}
            onClick={() => setSelectedDoc(doc)}
            className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex items-center justify-between transition-all cursor-pointer hover:border-[#7BA88A]/50"
          >
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0 border border-sky-100">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#2D3748] mb-1">{doc.title}</h3>
                <div className="flex items-center gap-2 text-[11px] text-slate-400">
                  <span>{doc.date}</span>
                  <span>·</span>
                  <span>Caricato da {doc.author}</span>
                </div>
              </div>
            </div>

            <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 border border-slate-200 uppercase">
              {doc.fileType}
            </span>
          </div>
        ))}
      </div>

      {/* Add Document Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl animate-slide-up">
            <h3 className="text-xl font-bold text-[#2D3748] mb-1">Carica Documento</h3>
            <p className="text-xs text-slate-500 mb-6">Aggiungi prescrizioni, referti o lettere ufficiali.</p>

            <form onSubmit={handleAddDocument} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1.5">
                  Titolo documento
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Es. Certificato medico Spitex"
                  className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:border-[#7BA88A]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1.5">
                  Autore / Caricato da
                </label>
                <input
                  type="text"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="Es. Marco"
                  className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:border-[#7BA88A]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1.5">
                  File (Simulato)
                </label>
                <div className="border-2 border-dashed border-slate-200 rounded-2xl p-6 text-center bg-slate-50">
                  <FileText className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <p className="text-xs font-semibold text-slate-700">Trascina qui il file PDF o clicca</p>
                  <p className="text-[10px] text-slate-400 mt-1">Formati supportati: PDF, JPG, PNG (Max 10MB)</p>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 h-12 bg-slate-100 text-slate-700 font-semibold rounded-xl text-sm"
                >
                  Annulla
                </button>
                <button
                  type="submit"
                  className="flex-1 h-12 bg-[#7BA88A] text-white font-semibold rounded-xl shadow-md text-sm hover:bg-[#6c987c]"
                >
                  Salva documento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Document Detail Modal */}
      {selectedDoc && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl animate-slide-up">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-sky-50 text-sky-700 border border-sky-100 uppercase">
                {selectedDoc.fileType} • {selectedDoc.fileSize}
              </span>
              <button
                onClick={() => setSelectedDoc(null)}
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <h3 className="text-lg font-bold text-[#2D3748] mb-3">{selectedDoc.title}</h3>

            <div className="space-y-2 mb-6 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-400">Data caricamento</span>
                <span>{selectedDoc.date}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-400">Autore</span>
                <span>{selectedDoc.author}</span>
              </div>
            </div>

            <button
              onClick={() => handleDownloadMock(selectedDoc.title)}
              className="w-full h-12 bg-[#7BA88A] text-white font-semibold rounded-xl text-xs hover:bg-[#6c987c] transition-all flex items-center justify-center gap-2 shadow-md"
            >
              <Download className="w-4 h-4" />
              <span>Scarica documento</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
