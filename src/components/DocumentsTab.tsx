import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Plus, FileText, Download, X, Calendar, User, Activity, FileCheck, ShieldCheck } from 'lucide-react';
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
      showToast('Specificare l\'oggetto della documentazione', 'info');
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
    showToast(`Download del file "${docTitle}" completato.`);
    setSelectedDoc(null);
  };

  return (
    <div className="w-full px-4 md:px-8 py-8 pb-24 md:pb-12 font-sans bg-slate-50 min-h-screen">
      <header className="mb-8 bg-white p-6 rounded-lg shadow-sm border border-slate-200 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Activity className="w-4 h-4 text-emerald-700" />
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Medical Archive</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none">Archivio Documentale</h1>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="h-10 px-5 rounded-lg bg-emerald-700 text-white flex items-center justify-center hover:bg-emerald-800 transition-all shadow-md text-[11px] font-black uppercase tracking-widest gap-2"
          title="Nuova acquisizione"
        >
          <Plus className="w-4 h-4" />
          <span>Carica File</span>
        </button>
      </header>

      {/* Corporate Table Header */}
      <div className="hidden sm:grid grid-cols-12 gap-4 px-6 py-3 mb-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
        <div className="col-span-6">Descrizione Documento</div>
        <div className="col-span-2 text-center">Formato</div>
        <div className="col-span-3">Metadati</div>
        <div className="col-span-1 text-right">Azioni</div>
      </div>

      {/* List of Documents */}
      <div className="space-y-2">
        {documents.map((doc) => (
          <div
            key={doc.id}
            onClick={() => setSelectedDoc(doc)}
            className="bg-white rounded-lg p-5 shadow-sm border border-slate-200 grid grid-cols-1 sm:grid-cols-12 gap-4 items-center transition-all cursor-pointer hover:border-emerald-300"
          >
            <div className="col-span-1 sm:col-span-6 flex items-center gap-4">
              <div className="w-10 h-10 rounded bg-slate-50 text-slate-400 flex items-center justify-center shrink-0 border border-slate-100 shadow-inner">
                <FileCheck className="w-5 h-5 text-emerald-700" />
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-900 tracking-tight leading-tight">{doc.title}</h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1 sm:hidden">
                  {doc.date} · {doc.author}
                </p>
              </div>
            </div>

            <div className="col-span-1 sm:col-span-2 text-center hidden sm:block">
              <span className="text-[9px] font-black px-2 py-0.5 rounded border border-slate-200 bg-slate-50 text-slate-500 uppercase tracking-widest">
                {doc.fileType}
              </span>
            </div>

            <div className="col-span-1 sm:col-span-3 hidden sm:block">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-600">
                  <Calendar className="w-3 h-3 text-slate-300" />
                  <span>{doc.date}</span>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-600">
                  <User className="w-3 h-3 text-slate-300" />
                  <span>{doc.author}</span>
                </div>
              </div>
            </div>

            <div className="col-span-1 text-right hidden sm:block">
              <button className="p-2 text-slate-300 hover:text-emerald-700 transition-colors">
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Document Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white w-full max-w-lg rounded-t-lg sm:rounded-lg p-10 shadow-2xl animate-in slide-in-from-bottom duration-300 border border-slate-200">
            <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-2">Protocollo Acquisizione</h3>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-8 border-b border-slate-100 pb-4">Digitalizzazione documentazione clinica</p>

            <form onSubmit={handleAddDocument} className="space-y-6">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">
                  Titolo Identificativo
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Es. Referto Esami Ematici Nov 2026"
                  className="w-full h-12 px-5 rounded border border-slate-300 bg-slate-50 text-sm focus:outline-none focus:border-emerald-700 font-bold"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">
                  Operatore Addetto
                </label>
                <input
                  type="text"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="Es. Marco"
                  className="w-full h-12 px-5 rounded border border-slate-300 bg-slate-50 text-sm focus:outline-none focus:border-emerald-700 font-bold"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">
                  Upload Area
                </label>
                <div className="border-2 border-dashed border-slate-200 rounded-lg p-10 text-center bg-slate-50 transition-colors hover:bg-slate-100 hover:border-emerald-300 cursor-pointer">
                  <FileText className="w-10 h-10 text-slate-300 mx-auto mb-4" />
                  <p className="text-xs font-black text-slate-700 uppercase tracking-widest">Selezionare File Sorgente</p>
                  <p className="text-[10px] text-slate-400 font-bold mt-2 uppercase tracking-tight">PDF, DICOM, JPEG (Max 25MB)</p>
                </div>
              </div>

              <div className="flex gap-4 pt-8">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 h-12 bg-white text-slate-500 font-black uppercase tracking-widest rounded border border-slate-200 hover:bg-slate-50 transition-all text-xs"
                >
                  Annulla
                </button>
                <button
                  type="submit"
                  className="flex-1 h-12 bg-emerald-700 text-white font-black uppercase tracking-widest rounded shadow-md text-xs hover:bg-emerald-800 transition-all"
                >
                  Archivia Documento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Document Detail Modal */}
      {selectedDoc && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-lg p-10 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between mb-8">
              <span className="text-[9px] font-black px-3 py-1 rounded border border-emerald-100 bg-emerald-50 text-emerald-800 uppercase tracking-[0.2em]">
                {selectedDoc.fileType} Hub Archiving
              </span>
              <button
                onClick={() => setSelectedDoc(null)}
                className="w-8 h-8 rounded bg-slate-100 flex items-center justify-center text-slate-400 hover:bg-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-8 leading-tight">{selectedDoc.title}</h3>

            <div className="space-y-4 mb-10 text-xs text-slate-600 bg-slate-50 p-6 rounded-lg border border-slate-200 shadow-inner">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <span className="font-black text-slate-400 uppercase tracking-widest">Metadata Date</span>
                <span className="font-bold text-slate-900">{selectedDoc.date}</span>
              </div>
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <span className="font-black text-slate-400 uppercase tracking-widest">Owner</span>
                <span className="font-bold text-slate-900 uppercase tracking-tight">{selectedDoc.author}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-black text-slate-400 uppercase tracking-widest">File Size</span>
                <span className="font-bold text-slate-900">{selectedDoc.fileSize}</span>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <button
                onClick={() => handleDownloadMock(selectedDoc.title)}
                className="w-full h-12 bg-emerald-700 text-white font-black uppercase tracking-widest rounded shadow-md text-xs hover:bg-emerald-800 transition-all flex items-center justify-center gap-3"
              >
                <Download className="w-4 h-4" />
                <span>Richiedi Download</span>
              </button>
              <div className="mt-4 flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Security Verified Content</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
