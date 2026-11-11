/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import JSZip from 'jszip';
import { TitleBar } from './components/TitleBar';
import { Toolbar } from './components/Toolbar';
import { PhotoList } from './components/PhotoList';
import { PhotoInspector } from './components/PhotoInspector';
import { StatusBar } from './components/StatusBar';
import { AboutModal } from './components/AboutModal';
import { GuideModal } from './components/GuideModal';
import { PhotoItem, CleanSettings } from './types';
import { parseExifData } from './utils/exifParser';
import { cleanImageMetadata, generateCleanFileName } from './utils/exifCleaner';
import { ShieldCheck, ShieldAlert, FolderOpen, RefreshCw, X, Maximize2, LayoutGrid, Laptop } from 'lucide-react';

export default function App() {
  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const [selectedPhotoId, setSelectedPhotoId] = useState<string | null>(null);
  const [isProcessingBatch, setIsProcessingBatch] = useState(false);
  const [batchProgress, setBatchProgress] = useState<{ current: number; total: number } | null>(null);
  
  // Windows UI states
  const [isMaximized, setIsMaximized] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [lang, setLang] = useState<'fa' | 'en'>('fa');

  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  // Settings
  const [settings, setSettings] = useState<CleanSettings>({
    mode: 'strip_all',
    engine: 'lossless',
    fileSuffix: '_clean',
    quality: 0.95,
    preserveName: false,
  });

  const isFa = lang === 'fa';

  // Listen for native install prompt (Windows Edge/Chrome PWA)
  useEffect(() => {
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
  }, []);

  const handleInstallWindowsApp = async () => {
    if (deferredPrompt) {
      try {
        deferredPrompt.prompt();
        const choice = await deferredPrompt.userChoice;
        if (choice?.outcome === 'accepted') {
          setDeferredPrompt(null);
        }
      } catch {
        setIsGuideOpen(true);
      }
    } else {
      setIsGuideOpen(true);
    }
  };

  // Apply theme and direction to document
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    document.documentElement.setAttribute('dir', lang === 'fa' ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('lang', lang);
  }, [lang]);

  // Handle file uploads (individual or batch or folder)
  const handleFilesSelected = async (fileList: FileList | File[]) => {
    const newItems: PhotoItem[] = [];
    const files = Array.from(fileList).filter((f) => f.type.startsWith('image/'));

    if (files.length === 0) return;

    for (const file of files) {
      const id = `photo-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const previewUrl = URL.createObjectURL(file);
      
      // Parse EXIF metadata
      const exif = await parseExifData(file);

      newItems.push({
        id,
        file,
        name: file.name,
        size: file.size,
        type: file.type || 'image/jpeg',
        previewUrl,
        exif,
        isProcessing: false,
        isCleaned: false,
      });
    }

    setPhotos((prev) => {
      const combined = [...prev, ...newItems];
      if (!selectedPhotoId && newItems.length > 0) {
        setSelectedPhotoId(newItems[0].id);
      }
      return combined;
    });

    if (newItems.length > 0) {
      setSelectedPhotoId(newItems[0].id);
    }
  };

  // Clean a single photo
  const handleCleanSingle = async (id: string) => {
    const photo = photos.find((p) => p.id === id);
    if (!photo || photo.isProcessing) return;

    setPhotos((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isProcessing: true, error: undefined } : p))
    );

    try {
      const { blob, cleanedSize } = await cleanImageMetadata(photo.file, settings);
      const cleanedPreviewUrl = URL.createObjectURL(blob);
      const cleanedExif = await parseExifData(blob);

      setPhotos((prev) =>
        prev.map((p) =>
          p.id === id
            ? {
                ...p,
                isProcessing: false,
                isCleaned: true,
                cleanedBlob: blob,
                cleanedPreviewUrl,
                cleanedSize,
                cleanedExif,
              }
            : p
        )
      );
    } catch (err: any) {
      console.error('Cleaning failed for photo:', id, err);
      setPhotos((prev) =>
        prev.map((p) =>
          p.id === id ? { ...p, isProcessing: false, error: err.message || 'خطا در پاکسازی' } : p
        )
      );
    }
  };

  // Clean all photos in batch
  const handleCleanAll = async () => {
    if (photos.length === 0 || isProcessingBatch) return;

    setIsProcessingBatch(true);
    const uncleaned = photos.filter((p) => !p.isCleaned);
    let count = 0;
    setBatchProgress({ current: 0, total: uncleaned.length });

    for (const photo of uncleaned) {
      try {
        const { blob, cleanedSize } = await cleanImageMetadata(photo.file, settings);
        const cleanedPreviewUrl = URL.createObjectURL(blob);
        const cleanedExif = await parseExifData(blob);

        setPhotos((prev) =>
          prev.map((p) =>
            p.id === photo.id
              ? {
                  ...p,
                  isProcessing: false,
                  isCleaned: true,
                  cleanedBlob: blob,
                  cleanedPreviewUrl,
                  cleanedSize,
                  cleanedExif,
                }
              : p
          )
        );
      } catch (err) {
        console.error('Failed cleaning photo:', photo.name, err);
      }

      count++;
      setBatchProgress({ current: count, total: uncleaned.length });
    }

    setIsProcessingBatch(false);
    setBatchProgress(null);
  };

  // Download a single cleaned file
  const handleDownloadSingle = (id: string) => {
    const photo = photos.find((p) => p.id === id);
    if (!photo || !photo.cleanedBlob) return;

    const fileName = generateCleanFileName(photo.name, settings.fileSuffix);
    const downloadUrl = URL.createObjectURL(photo.cleanedBlob);
    const a = document.createElement('a');
    a.href = downloadUrl;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(downloadUrl), 5000);
  };

  // Download all cleaned photos as a ZIP archive
  const handleDownloadAllZip = async () => {
    const cleanedPhotos = photos.filter((p) => p.isCleaned && p.cleanedBlob);
    if (cleanedPhotos.length === 0) return;

    const zip = new JSZip();
    const folder = zip.folder('byhrsn_cleaned_photos');

    for (const photo of cleanedPhotos) {
      if (photo.cleanedBlob && folder) {
        const fileName = generateCleanFileName(photo.name, settings.fileSuffix);
        folder.file(fileName, photo.cleanedBlob);
      }
    }

    const zipBlob = await zip.generateAsync({ type: 'blob' });
    const downloadUrl = URL.createObjectURL(zipBlob);
    const a = document.createElement('a');
    a.href = downloadUrl;
    a.download = `byhrsn_privacy_photos_${Date.now()}.zip`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(downloadUrl), 5000);
  };

  const handleRemovePhoto = (id: string) => {
    setPhotos((prev) => {
      const next = prev.filter((p) => p.id !== id);
      if (selectedPhotoId === id) {
        setSelectedPhotoId(next.length > 0 ? next[0].id : null);
      }
      return next;
    });
  };

  const handleClearAll = () => {
    setPhotos([]);
    setSelectedPhotoId(null);
  };

  const selectedPhoto = photos.find((p) => p.id === selectedPhotoId) || null;
  const cleanedCount = photos.filter((p) => p.isCleaned).length;

  return (
    <div className="h-screen w-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100 flex flex-col items-center justify-center p-0 md:p-3 overflow-hidden select-none">
      {/* If Minimized, show Windows 11 Desktop Taskbar Pill */}
      {isMinimized ? (
        <div className="flex-1 flex flex-col items-center justify-center space-y-4">
          <div className="p-6 bg-slate-900/90 border border-slate-700/80 rounded-2xl shadow-2xl text-center max-w-sm backdrop-blur-xl">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white mx-auto mb-4 shadow-lg shadow-blue-500/30">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h3 className="font-bold text-slate-100 text-sm mb-1">
              ByHRSN Exif Privacy Remover
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              {isFa
                ? 'پنجره برنامه کوچک (Minimize) شده است.'
                : 'The application window is minimized.'}
            </p>
            <button
              onClick={() => setIsMinimized(false)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-medium transition-all shadow-md shadow-blue-600/30"
            >
              {isFa ? 'بازگردانی پنجره برنامه' : 'Restore Window'}
            </button>
          </div>
        </div>
      ) : (
        /* Windows 11 Fluent App Window Frame */
        <div
          className={`flex flex-col bg-slate-900/95 dark:bg-slate-950/95 text-slate-100 border border-slate-800 transition-all duration-200 overflow-hidden shadow-2xl ${
            isMaximized
              ? 'fixed inset-0 rounded-none w-full h-full'
              : 'w-full h-full md:w-[98%] md:h-[96%] md:rounded-xl md:border-slate-700/70'
          }`}
        >
          {/* Windows Title Bar */}
          <TitleBar
            isMaximized={isMaximized}
            onToggleMaximize={() => setIsMaximized(!isMaximized)}
            onMinimize={() => setIsMinimized(true)}
            onClose={() => {
              if (confirm(isFa ? 'آیا مایل به بستن برنامه هستید؟' : 'Close ByHRSN Exif Cleaner?')) {
                handleClearAll();
              }
            }}
            theme={theme}
            onToggleTheme={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            lang={lang}
            onToggleLang={() => setLang(lang === 'fa' ? 'en' : 'fa')}
            onOpenAbout={() => setIsAboutOpen(true)}
            onOpenGuide={() => setIsGuideOpen(true)}
            onInstallWindowsApp={handleInstallWindowsApp}
          />

          {/* Windows Action Toolbar */}
          <Toolbar
            onFilesSelected={handleFilesSelected}
            onOpenGuide={() => setIsGuideOpen(true)}
            onCleanAll={handleCleanAll}
            onDownloadAllZip={handleDownloadAllZip}
            onClearAll={handleClearAll}
            photosCount={photos.length}
            cleanedCount={cleanedCount}
            isProcessingBatch={isProcessingBatch}
            settings={settings}
            onUpdateSettings={setSettings}
            lang={lang}
          />

          {/* Progress bar during batch processing */}
          {batchProgress && (
            <div className="bg-slate-900 border-b border-slate-800 px-4 py-1.5 flex items-center justify-between text-xs text-blue-400">
              <span>
                {isFa
                  ? `در حال پردازش: ${batchProgress.current} از ${batchProgress.total} تصویر...`
                  : `Processing: ${batchProgress.current} of ${batchProgress.total}...`}
              </span>
              <div className="w-48 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 transition-all duration-200"
                  style={{
                    width: `${Math.round((batchProgress.current / batchProgress.total) * 100)}%`,
                  }}
                />
              </div>
            </div>
          )}

          {/* Main App Workspace: Left Photo List & Right Inspector */}
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            {/* Left Column: Photos Queue / Batch List */}
            <div className="w-full md:w-80 lg:w-96 border-b md:border-b-0 md:border-l border-slate-800 flex flex-col shrink-0 overflow-hidden bg-slate-950/20">
              <div className="px-3 py-2 bg-slate-900/40 border-b border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                <span className="font-semibold text-slate-200">
                  {isFa ? 'فهرست تصاویر پردازشی' : 'Photo Queue'}
                </span>
                <span className="font-mono text-[11px] bg-slate-800 px-2 py-0.5 rounded text-slate-300">
                  {photos.length} {isFa ? 'فایل' : 'files'}
                </span>
              </div>

              <PhotoList
                photos={photos}
                selectedPhotoId={selectedPhotoId}
                onSelectPhoto={setSelectedPhotoId}
                onCleanSingle={handleCleanSingle}
                onDownloadSingle={handleDownloadSingle}
                onRemovePhoto={handleRemovePhoto}
                onFilesSelected={handleFilesSelected}
                onOpenGuide={() => setIsGuideOpen(true)}
                lang={lang}
              />
            </div>

            {/* Right Column: Full Inspector & Preview */}
            {selectedPhoto ? (
              <PhotoInspector
                photo={selectedPhoto}
                onCleanSingle={handleCleanSingle}
                onDownloadSingle={handleDownloadSingle}
                lang={lang}
              />
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-500">
                <div className="w-16 h-16 rounded-2xl bg-slate-800/40 border border-slate-800 flex items-center justify-center text-slate-600 mb-3">
                  <ShieldCheck className="w-8 h-8" />
                </div>
                <h3 className="text-sm font-medium text-slate-300 mb-1">
                  {isFa ? 'هیچ تصویری انتخاب نشده است' : 'No photo selected'}
                </h3>
                <p className="text-xs text-slate-500 max-w-xs">
                  {isFa
                    ? 'از نوار بالا تصاویری را انتخاب کنید یا یکی از عکس‌های فهرست را کلیک کنید تا متادیتای آن نمایش یابد.'
                    : 'Select a photo from the queue to inspect its EXIF tags and GPS coordinates.'}
                </p>
              </div>
            )}
          </div>

          {/* Windows Status Bar */}
          <StatusBar photos={photos} lang={lang} />
        </div>
      )}

      {/* Windows 11 Taskbar simulation at bottom of desktop */}
      <div className="w-full h-11 bg-slate-950/80 backdrop-blur-xl border-t border-slate-800/80 flex items-center justify-between px-3 shrink-0 text-xs text-slate-400 select-none z-40 hidden md:flex">
        {/* Windows Start Button & Centered Taskbar Icons */}
        <div className="flex items-center gap-1.5 mx-auto">
          {/* Windows Start Orb */}
          <button
            onClick={() => setIsAboutOpen(true)}
            className="w-8 h-8 rounded-md flex items-center justify-center hover:bg-slate-800 text-blue-400 transition-colors"
            title="Start (ByHRSN)"
          >
            <div className="grid grid-cols-2 gap-0.5 w-4 h-4">
              <span className="bg-blue-400 rounded-xs"></span>
              <span className="bg-blue-400 rounded-xs"></span>
              <span className="bg-blue-400 rounded-xs"></span>
              <span className="bg-blue-400 rounded-xs"></span>
            </div>
          </button>

          {/* Active App in Taskbar */}
          <button
            onClick={() => setIsMinimized(false)}
            className={`px-3 py-1.5 rounded-md flex items-center gap-2 transition-colors border ${
              !isMinimized
                ? 'bg-slate-800/90 text-white border-blue-500/40 shadow-xs'
                : 'hover:bg-slate-800 text-slate-400 border-transparent'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-blue-400" />
            <span className="text-xs font-medium">ByHRSN Exif Cleaner</span>
            {!isMinimized && (
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
            )}
          </button>
        </div>

        {/* System Tray: Time & Date, ByHRSN link */}
        <div className="flex items-center gap-3 font-mono text-[11px] text-slate-400" dir="ltr">
          <a
            href="https://byhrsn.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-400 transition-colors"
          >
            byhrsn.com
          </a>
          <span>·</span>
          <span>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
      </div>

      {/* About Modal */}
      <AboutModal
        isOpen={isAboutOpen}
        onClose={() => setIsAboutOpen(false)}
        lang={lang}
      />

      {/* Guide & Windows Setup Modal */}
      <GuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
        lang={lang}
      />
    </div>
  );
}
