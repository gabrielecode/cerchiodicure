import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { Plus, FileText, Download, X, Calendar, User, Activity, FileCheck, ShieldCheck, Loader2 } from 'lucide-react';
import { CareDocument } from '../types';
import { storage, auth, db } from '../lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, doc, setDoc } from 'firebase/firestore';

const ALLOWED_TYPES = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export const DocumentsTab: React.FC = () => {
  const { documents, circleId, showToast, profile } = useApp();
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<CareDocument | null>(null);

  const [author, setAuthor] = useState(profile?.userName || 'Operatore');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!ALLOWED_TYPES.includes(file.type)) {
      showToast('Formato non supportato. Sono ammessi solo file PDF, JPG o PNG.', 'info');
      e.target.value = '';
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      showToast('Il file supera la dimensione massima consentita di 10 MB.', 'info');
      e.target.value = '';
      return;
    }

    setSelectedFile(file);
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!circleId || !auth.currentUser) {
      showToast('Sessione non valida.', 'info');
      return;
    }

    if (!selectedFile) {
      showToast('Selezionare un file da caricare.', 'info');
      return;
    }

    setUploading(true);
    try {
      // 1. Create document ref in Firestore to get docId
      const docRef = doc(collection(db, 'circles', circleId, 'documents'));
      const storagePath = `circles/${circleId}/documents/${docRef.id}/${selectedFile.name}`;
      const storageRef = ref(storage, storagePath);

      // 2. Upload file to Firebase Storage
      await uploadBytes(storageRef, selectedFile, {
        contentType: selectedFile.type,
      });

      // 3. Save metadata to Firestore
      await setDoc(docRef, {
        name: selectedFile.name,
        size: selectedFile.size,
        mimeType: selectedFile.type,
        path: storagePath,
        author: author.trim() || profile?.userName || 'Operatore',
        circleId,
        createdBy: auth.currentUser.uid,
      });

      showToast('Documento caricato con successo!');
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      setShowAddModal(false);
    } catch (err: any) {
      console.error('Errore durante il caricamento del documento:', err);
      showToast('Impossibile caricare il documento. Riprova.', 'info');
    } finally {
      setUploading(false);
    }
  };

  const handleDownload = async (docItem: CareDocument) => {
    setDownloading(true);
    try {
      let url = docItem.downloadUrl;
      if (!url && docItem.path) {
        const fileRef = ref(storage, docItem.path);
        url = await getDownloadURL(fileRef);
      }

      if (url) {
        window.open(url, '_blank', 'noopener,noreferrer');
        showToast('Download avviato');
      } else {
        showToast('Percorso file non disponibile', 'info');
      }
    } catch (err) {
      console.error('Errore download file:', err);
      showToast('Impossibile scaricare il file. Verifica i permessi.', 'info');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="w-full px-4 md:px-8 py-8 pb-24 md:pb-12 font-sans bg-slate-50 dark:bg-slate-950 min-h-screen transition-colors duration-300">
      <header className="mb-8 bg-white dark:bg-slate-900 p-6 rounded-lg shadow-sm border border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Activity className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
            <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Medical Archive</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight leading-none">Archivio Documentale</h1>
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
      <div className="hidden sm:grid grid-cols-12 gap-4 px-6 py-3 mb-2 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
        <div className="col-span-6">Descrizione Documento</div>
        <div className="col-span-2 text-center">Formato / Dimensione</div>
        <div className="col-span-3">Metadati</div>
        <div className="col-span-1 text-right">Azioni</div>
      </div>

      {/* List of Documents */}
      <div className="space-y-2">
        {documents.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-lg p-12 text-center border border-slate-200 dark:border-slate-800 text-slate-400">
            <FileText className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="text-sm font-bold uppercase tracking-wider">Nessun documento archiviato</p>
            <p className="text-xs text-slate-500 mt-1">Carica referti, prescrizioni e piani di cura (PDF, JPG, PNG).</p>
          </div>
        ) : (
          documents.map((docItem) => {
            const displayName = docItem.name || docItem.title || 'Documento';
            const displaySize = docItem.size ? formatBytes(docItem.size) : (docItem.fileSize || 'N/D');
            const displayType = docItem.mimeType ? docItem.mimeType.split('/')[1]?.toUpperCase() : (docItem.fileType || 'DOC');

            return (
              <div
                key={docItem.id}
                onClick={() => setSelectedDoc(docItem)}
                className="bg-white dark:bg-slate-900 rounded-lg p-5 shadow-sm border border-slate-200 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-12 gap-4 items-center transition-all cursor-pointer hover:border-emerald-300 dark:hover:border-emerald-700"
              >
                <div className="col-span-1 sm:col-span-6 flex items-center gap-4">
                  <div className="w-10 h-10 rounded bg-slate-50 dark:bg-slate-800 text-slate-400 dark:text-slate-500 flex items-center justify-center shrink-0 border border-slate-100 dark:border-slate-700 shadow-inner">
                    <FileCheck className="w-5 h-5 text-emerald-700 dark:text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-slate-900 dark:text-slate-100 tracking-tight leading-tight">{displayName}</h3>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider mt-1 sm:hidden">
                      {displaySize} · {docItem.author}
                    </p>
                  </div>
                </div>

                <div className="col-span-1 sm:col-span-2 text-center hidden sm:block">
                  <div className="flex flex-col items-center gap-0.5">
                    <span className="text-[9px] font-black px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                      {displayType}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">{displaySize}</span>
                  </div>
                </div>

                <div className="col-span-1 sm:col-span-3 hidden sm:block">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-600 dark:text-slate-400">
                      <User className="w-3 h-3 text-slate-300 dark:text-slate-600" />
                      <span>{docItem.author}</span>
                    </div>
                    {docItem.path && (
                      <span className="text-[9px] text-slate-400 truncate max-w-xs font-mono">{docItem.path}</span>
                    )}
                  </div>
                </div>

                <div className="col-span-1 text-right hidden sm:block">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDownload(docItem);
                    }}
                    className="p-2 text-slate-300 dark:text-slate-600 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors"
                    title="Scarica file originale"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add Document Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-t-lg sm:rounded-lg p-10 shadow-2xl animate-in slide-in-from-bottom duration-300 border border-slate-200 dark:border-slate-800">
            <h3 className="text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight mb-2">Protocollo Acquisizione</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider mb-8 border-b border-slate-100 dark:border-slate-800 pb-4">
              Upload protetto su Firebase Storage
            </p>

            <form onSubmit={handleUploadSubmit} className="space-y-6">
              <div>
                <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-2">
                  Operatore Addetto
                </label>
                <input
                  type="text"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="Es. Marco"
                  className="w-full h-12 px-5 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none focus:border-emerald-700 dark:focus:border-emerald-500 dark:text-slate-100 font-bold"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-2">
                  Seleziona File (PDF, JPG, PNG - Max 10MB)
                </label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,application/pdf,image/jpeg,image/png,image/jpg"
                  onChange={handleFileChange}
                  className="hidden"
                  id="doc-file-input"
                />
                <label
                  htmlFor="doc-file-input"
                  className="block border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-lg p-8 text-center bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 hover:border-emerald-300 dark:hover:border-emerald-700 cursor-pointer transition-colors"
                >
                  <FileText className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                  {selectedFile ? (
                    <div>
                      <p className="text-sm font-bold text-emerald-700 dark:text-emerald-400">{selectedFile.name}</p>
                      <p className="text-[11px] text-slate-500 mt-1">
                        {formatBytes(selectedFile.size)} · {selectedFile.type || 'Sconosciuto'}
                      </p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-widest">
                        Clicca per scegliere il file
                      </p>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold mt-1 uppercase tracking-tight">
                        Solo PDF, JPG o PNG fino a 10MB
                      </p>
                    </div>
                  )}
                </label>
              </div>

              <div className="flex gap-4 pt-6">
                <button
                  type="button"
                  disabled={uploading}
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 h-12 bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-black uppercase tracking-widest rounded border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all text-xs"
                >
                  Annulla
                </button>
                <button
                  type="submit"
                  disabled={uploading || !selectedFile}
                  className="flex-1 h-12 bg-emerald-700 disabled:opacity-50 text-white font-black uppercase tracking-widest rounded shadow-md text-xs hover:bg-emerald-800 transition-all flex items-center justify-center gap-2"
                >
                  {uploading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Caricamento...</span>
                    </>
                  ) : (
                    <span>Carica su Storage</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Document Detail Modal */}
      {selectedDoc && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-lg p-10 shadow-2xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between mb-8">
              <span className="text-[9px] font-black px-3 py-1 rounded border border-emerald-100 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-400 uppercase tracking-[0.2em]">
                {selectedDoc.mimeType || selectedDoc.fileType || 'DOC'}
              </span>
              <button
                onClick={() => setSelectedDoc(null)}
                className="w-8 h-8 rounded bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 dark:text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <h3 className="text-xl font-black text-slate-900 dark:text-slate-100 tracking-tight mb-8 leading-tight break-all">
              {selectedDoc.name || selectedDoc.title}
            </h3>

            <div className="space-y-4 mb-10 text-xs text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 p-6 rounded-lg border border-slate-200 dark:border-slate-800 shadow-inner">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-3">
                <span className="font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Dimensione</span>
                <span className="font-bold text-slate-900 dark:text-slate-100">
                  {selectedDoc.size ? formatBytes(selectedDoc.size) : (selectedDoc.fileSize || 'N/D')}
                </span>
              </div>
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-3">
                <span className="font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Caricato Da</span>
                <span className="font-bold text-slate-900 dark:text-slate-100 uppercase tracking-tight">{selectedDoc.author}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Storage Path</span>
                <span className="font-mono text-[10px] text-slate-600 dark:text-slate-300 break-all">{selectedDoc.path}</span>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <button
                onClick={() => handleDownload(selectedDoc)}
                disabled={downloading}
                className="w-full h-12 bg-emerald-700 text-white font-black uppercase tracking-widest rounded shadow-md text-xs hover:bg-emerald-800 transition-all flex items-center justify-center gap-3"
              >
                {downloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                <span>{downloading ? 'Recupero link...' : 'Apri / Scarica File'}</span>
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
