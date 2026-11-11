import React, { useRef } from 'react';
import {
  Upload,
  FolderPlus,
  BookOpen,
  Trash2,
  Download,
  ShieldCheck,
  Settings,
  Sliders,
  CheckCircle2,
  FileArchive,
} from 'lucide-react';
import { CleanSettings, CleanEngine, CleanMode } from '../types';

interface ToolbarProps {
  onFilesSelected: (files: FileList | File[]) => void;
  onOpenGuide: () => void;
  onCleanAll: () => void;
  onDownloadAllZip: () => void;
  onClearAll: () => void;
  photosCount: number;
  cleanedCount: number;
  isProcessingBatch: boolean;
  settings: CleanSettings;
  onUpdateSettings: (settings: CleanSettings) => void;
  lang: 'fa' | 'en';
}

export const Toolbar: React.FC<ToolbarProps> = ({
  onFilesSelected,
  onOpenGuide,
  onCleanAll,
  onDownloadAllZip,
  onClearAll,
  photosCount,
  cleanedCount,
  isProcessingBatch,
  settings,
  onUpdateSettings,
  lang,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);
  const isFa = lang === 'fa';

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFilesSelected(e.target.files);
      e.target.value = '';
    }
  };

  return (
    <div className="bg-slate-900/60 dark:bg-slate-900/80 border-b border-slate-800/80 p-2.5 flex flex-wrap items-center justify-between gap-3 text-xs">
      {/* Hidden file inputs */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        multiple
        accept="image/jpeg,image/jpg,image/png,image/webp,image/tiff,image/heic"
        className="hidden"
      />
      <input
        type="file"
        ref={folderInputRef}
        onChange={handleFileChange}
        // @ts-ignore - webkitdirectory is standard in browsers
        webkitdirectory="true"
        directory=""
        multiple
        className="hidden"
      />

      {/* Left zone: File import buttons */}
      <div className="flex items-center flex-wrap gap-2">
        <button
          onClick={() => fileInputRef.current?.click()}
          className="px-3 py-1.5 rounded-md bg-blue-600 hover:bg-blue-500 text-white font-medium flex items-center gap-1.5 shadow-sm shadow-blue-600/30 transition-colors"
        >
          <Upload className="w-3.5 h-3.5" />
          <span>{isFa ? 'انتخاب تصاویر...' : 'Select Photos...'}</span>
        </button>

        <button
          onClick={() => folderInputRef.current?.click()}
          className="px-3 py-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700/80 flex items-center gap-1.5 transition-colors"
          title={isFa ? 'انتخاب یک پوشه کامل عکس' : 'Select entire folder'}
        >
          <FolderPlus className="w-3.5 h-3.5 text-blue-400" />
          <span>{isFa ? 'انتخاب پوشه...' : 'Select Folder...'}</span>
        </button>

        <button
          onClick={onOpenGuide}
          className="px-2.5 py-1.5 rounded-md bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700/70 flex items-center gap-1.5 transition-colors"
          title={isFa ? 'راهنمای استفاده و حفظ حریم خصوصی' : 'User Guide & Privacy'}
        >
          <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
          <span>{isFa ? 'راهنمای کاربری' : 'User Guide'}</span>
        </button>

        {photosCount > 0 && (
          <button
            onClick={onClearAll}
            className="px-2.5 py-1.5 rounded-md text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors flex items-center gap-1"
            title={isFa ? 'پاکسازی لیست تصاویر' : 'Clear all photos'}
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>{isFa ? 'پاکسازی لیست' : 'Clear List'}</span>
          </button>
        )}
      </div>

      {/* Settings & Cleaning Configuration */}
      <div className="flex items-center flex-wrap gap-2">
        {/* Engine selector */}
        <div className="flex items-center gap-1.5 bg-slate-950/60 p-1 rounded-md border border-slate-800 text-[11px]">
          <span className="text-slate-400 px-1 font-medium">{isFa ? 'روش پاکسازی:' : 'Engine:'}</span>
          <button
            onClick={() => onUpdateSettings({ ...settings, engine: 'lossless' })}
            className={`px-2 py-0.5 rounded transition-colors ${
              settings.engine === 'lossless'
                ? 'bg-blue-600 text-white font-medium shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title={isFa ? 'حذف بدون تغییر بیت‌های تصویر و با کیفیت ۱۰۰٪ اصلی' : 'Lossless JPEG byte stripping'}
          >
            {isFa ? 'سریع (بدون افت کیفیت)' : 'Lossless (Fast)'}
          </button>
          <button
            onClick={() => onUpdateSettings({ ...settings, engine: 'canvas' })}
            className={`px-2 py-0.5 rounded transition-colors ${
              settings.engine === 'canvas'
                ? 'bg-blue-600 text-white font-medium shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title={isFa ? 'بازسازی دوباره بوم پیکسل‌ها جهت حذف قطعی همه بخش‌ها' : 'Re-render canvas pixels'}
          >
            {isFa ? 'عمیق (بوم تصویر)' : 'Deep Canvas'}
          </button>
        </div>

        {/* Primary Action: Clean All */}
        <button
          onClick={onCleanAll}
          disabled={photosCount === 0 || isProcessingBatch}
          className={`px-4 py-1.5 rounded-md font-medium flex items-center gap-2 shadow-sm transition-all ${
            photosCount === 0 || isProcessingBatch
              ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/50'
              : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/30 active:scale-98'
          }`}
        >
          {isProcessingBatch ? (
            <>
              <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>{isFa ? 'در حال پاکسازی...' : 'Cleaning...'}</span>
            </>
          ) : (
            <>
              <ShieldCheck className="w-4 h-4" />
              <span>
                {isFa
                  ? `حذف اگزیف و ایمن‌سازی ${photosCount > 0 ? `(${photosCount})` : ''}`
                  : `Strip Exif (${photosCount})`}
              </span>
            </>
          )}
        </button>

        {/* Download All as ZIP */}
        {cleanedCount > 0 && (
          <button
            onClick={onDownloadAllZip}
            className="px-3 py-1.5 rounded-md bg-indigo-600 hover:bg-indigo-500 text-white font-medium flex items-center gap-1.5 shadow-sm shadow-indigo-600/20 transition-all"
            title={isFa ? 'دانلود تمام عکس‌های پاکسازی شده در قالب یک فایل زیپ' : 'Download all cleaned photos as ZIP'}
          >
            <FileArchive className="w-3.5 h-3.5" />
            <span>
              {isFa ? `دانلود ZIP پاکسازی‌شده‌ها (${cleanedCount})` : `Download ZIP (${cleanedCount})`}
            </span>
          </button>
        )}
      </div>
    </div>
  );
};
