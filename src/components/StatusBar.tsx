import React from 'react';
import { ShieldCheck, ShieldAlert, MapPin, HardDrive, CheckCircle2 } from 'lucide-react';
import { PhotoItem } from '../types';
import { formatBytes } from '../utils/exifCleaner';

interface StatusBarProps {
  photos: PhotoItem[];
  lang: 'fa' | 'en';
}

export const StatusBar: React.FC<StatusBarProps> = ({ photos, lang }) => {
  const isFa = lang === 'fa';
  const totalCount = photos.length;
  const cleanedCount = photos.filter((p) => p.isCleaned).length;
  const gpsCount = photos.filter((p) => !p.isCleaned && p.exif.hasGps).length;
  const totalSize = photos.reduce((sum, p) => sum + p.size, 0);

  return (
    <footer className="h-7 bg-slate-950 border-t border-slate-800/80 text-[11px] text-slate-400 px-3 flex items-center justify-between select-none shrink-0 font-mono">
      {/* Left indicators */}
      <div className="flex items-center gap-3">
        <span className="flex items-center gap-1.5 text-slate-300 font-sans">
          <span>{isFa ? 'تعداد فایل‌ها:' : 'Total Files:'}</span>
          <strong className="text-slate-100 font-mono tabular-nums">{totalCount}</strong>
        </span>

        {cleanedCount > 0 && (
          <span className="flex items-center gap-1 text-emerald-400 font-sans">
            <CheckCircle2 className="w-3 h-3" />
            <span>{isFa ? 'پاکسازی شده:' : 'Cleaned:'}</span>
            <strong className="font-mono tabular-nums">{cleanedCount}</strong>
          </span>
        )}

        {gpsCount > 0 && (
          <span className="flex items-center gap-1 text-rose-400 animate-pulse font-sans">
            <MapPin className="w-3 h-3" />
            <span>{isFa ? 'لوکیشن در معرض خطر:' : 'GPS at risk:'}</span>
            <strong className="font-mono tabular-nums">{gpsCount}</strong>
          </span>
        )}

        {totalSize > 0 && (
          <span className="hidden sm:flex items-center gap-1 text-slate-400 font-sans">
            <HardDrive className="w-3 h-3" />
            <span>{formatBytes(totalSize)}</span>
          </span>
        )}
      </div>

      {/* Right Brand link */}
      <div className="flex items-center gap-2">
        <a
          href="https://byhrsn.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-slate-400 hover:text-blue-400 transition-colors flex items-center gap-1"
        >
          <span>byhrsn.com</span>
        </a>
      </div>
    </footer>
  );
};
