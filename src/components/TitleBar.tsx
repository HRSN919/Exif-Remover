import React from 'react';
import { Minus, Square, Copy, X, ShieldCheck, Sun, Moon, Globe, Info, ExternalLink, BookOpen, Laptop } from 'lucide-react';

interface TitleBarProps {
  isMaximized: boolean;
  onToggleMaximize: () => void;
  onMinimize: () => void;
  onClose: () => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  lang: 'fa' | 'en';
  onToggleLang: () => void;
  onOpenAbout: () => void;
  onOpenGuide: () => void;
  onInstallWindowsApp?: () => void;
}

export const TitleBar: React.FC<TitleBarProps> = ({
  isMaximized,
  onToggleMaximize,
  onMinimize,
  onClose,
  theme,
  onToggleTheme,
  lang,
  onToggleLang,
  onOpenAbout,
  onOpenGuide,
  onInstallWindowsApp,
}) => {
  const isFa = lang === 'fa';

  return (
    <header className="h-10 select-none bg-slate-900/90 dark:bg-slate-950/95 border-b border-slate-800 text-slate-300 flex items-center justify-between px-3 text-xs tracking-normal z-50">
      {/* Brand & App Title */}
      <div className="flex items-center gap-2.5">
        <div className="w-5 h-5 rounded-md bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-sm shadow-blue-500/30">
          <ShieldCheck className="w-3.5 h-3.5" />
        </div>
        <span className="font-semibold text-slate-100 flex items-center gap-1.5">
          {isFa ? 'نرم‌افزار حفظ حریم خصوصی تصاویر ByHRSN' : 'ByHRSN Exif Privacy Remover'}
          <span className="text-[10px] text-blue-400 bg-blue-500/10 px-1.5 py-0.5 rounded border border-blue-500/20 font-mono">
            v2.5
          </span>
        </span>
        <span className="text-slate-600 hidden sm:inline">|</span>
        <a
          href="https://byhrsn.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-slate-400 hover:text-blue-400 transition-colors hidden sm:flex items-center gap-1 group font-mono text-[11px]"
          title="بازدید از وب‌سایت رسمی byhrsn.com"
        >
          byhrsn.com
          <ExternalLink className="w-2.5 h-2.5 opacity-60 group-hover:opacity-100" />
        </a>
      </div>

      {/* Center status guarantee */}
      <div className="hidden lg:flex items-center gap-1.5 text-[11px] text-emerald-400/90 bg-emerald-950/40 border border-emerald-500/20 px-2 py-0.5 rounded-full">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
        <span>{isFa ? 'پردازش ۱۰۰٪ آفلاین و محلی (بدون آپلود)' : '100% Offline & Client-Side Secure'}</span>
      </div>

      {/* Right controls: Theme, Lang, About, Windows Buttons */}
      <div className="flex items-center gap-1" dir="ltr">
        {/* Install on Windows Button */}
        {onInstallWindowsApp && (
          <button
            onClick={onInstallWindowsApp}
            className="px-2 py-0.5 rounded bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 transition-colors flex items-center gap-1 text-[11px] font-sans"
            title={isFa ? 'نصب نرم‌افزار روی ویندوز (Desktop App)' : 'Install App on Windows'}
          >
            <Laptop className="w-3 h-3 text-blue-400" />
            <span className="hidden sm:inline">{isFa ? 'نصب در ویندوز' : 'Install'}</span>
          </button>
        )}

        {/* Guide Modal Button */}
        <button
          onClick={onOpenGuide}
          className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-blue-400 transition-colors flex items-center gap-1"
          title={isFa ? 'راهنمای کاربری و حفظ حریم خصوصی' : 'User Guide & Privacy'}
        >
          <BookOpen className="w-3.5 h-3.5" />
        </button>

        {/* About Dialog Button */}
        <button
          onClick={onOpenAbout}
          className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-100 transition-colors"
          title={isFa ? 'درباره برنامه و سازنده' : 'About ByHRSN App'}
        >
          <Info className="w-3.5 h-3.5" />
        </button>

        {/* Theme Toggle */}
        <button
          onClick={onToggleTheme}
          className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-100 transition-colors"
          title={theme === 'dark' ? 'تم روشن' : 'تم تاریک'}
        >
          {theme === 'dark' ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-blue-400" />}
        </button>

        {/* Language switch */}
        <button
          onClick={onToggleLang}
          className="px-2 py-1 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-100 transition-colors flex items-center gap-1 font-mono text-[11px]"
          title={isFa ? 'تغییر زبان به انگلیسی' : 'Switch to Persian'}
        >
          <Globe className="w-3 h-3" />
          <span>{lang.toUpperCase()}</span>
        </button>

        {/* Windows Standard Window Action Buttons */}
        <div className="flex items-center ml-1 border-l border-slate-800 pl-1">
          <button
            onClick={onMinimize}
            className="w-8 h-8 flex items-center justify-center hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
            title="Minimize"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onToggleMaximize}
            className="w-8 h-8 flex items-center justify-center hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
            title={isMaximized ? 'Restore Down' : 'Maximize'}
          >
            {isMaximized ? <Copy className="w-3 h-3 rotate-180" /> : <Square className="w-3 h-3" />}
          </button>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center hover:bg-rose-600 text-slate-400 hover:text-white transition-colors"
            title="Close"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
};
