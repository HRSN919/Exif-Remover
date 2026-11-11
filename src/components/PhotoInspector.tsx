import React, { useState } from 'react';
import {
  MapPin,
  Camera,
  Calendar,
  Layers,
  ZoomIn,
  ZoomOut,
  Maximize2,
  ExternalLink,
  ShieldAlert,
  ShieldCheck,
  Download,
  Search,
  Sliders,
  CheckCircle,
  Copy,
  Info,
  Smartphone,
  Eye,
} from 'lucide-react';
import { PhotoItem } from '../types';
import { formatBytes } from '../utils/exifCleaner';

interface PhotoInspectorProps {
  photo: PhotoItem;
  onCleanSingle: (id: string) => void;
  onDownloadSingle: (id: string) => void;
  lang: 'fa' | 'en';
}

export const PhotoInspector: React.FC<PhotoInspectorProps> = ({
  photo,
  onCleanSingle,
  onDownloadSingle,
  lang,
}) => {
  const isFa = lang === 'fa';
  const [activeTab, setActiveTab] = useState<'preview' | 'metadata' | 'gps'>('preview');
  const [previewMode, setPreviewMode] = useState<'original' | 'cleaned' | 'split'>('original');
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [tagFilter, setTagFilter] = useState<string>('');
  const [copiedCoord, setCopiedCoord] = useState(false);

  const { exif, isCleaned } = photo;
  const hasGps = exif.hasGps && exif.gps;

  const currentPreviewUrl =
    previewMode === 'cleaned' && isCleaned && photo.cleanedPreviewUrl
      ? photo.cleanedPreviewUrl
      : photo.previewUrl;

  const handleCopyCoords = () => {
    if (hasGps && exif.gps) {
      navigator.clipboard.writeText(`${exif.gps.latitude}, ${exif.gps.longitude}`);
      setCopiedCoord(true);
      setTimeout(() => setCopiedCoord(false), 2000);
    }
  };

  // Filter raw tags
  const filteredTags = Object.entries(exif.allTags).filter(([key, val]) => {
    const q = tagFilter.toLowerCase();
    return key.toLowerCase().includes(q) || String(val).toLowerCase().includes(q);
  });

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-900/40 overflow-hidden">
      {/* Inspector Header */}
      <div className="px-4 py-3 bg-slate-900/80 border-b border-slate-800 flex items-center justify-between gap-4 shrink-0">
        <div className="min-w-0">
          <h2 className="text-sm font-semibold text-slate-100 truncate flex items-center gap-2">
            <span>{photo.name}</span>
            {isCleaned && (
              <span className="text-[11px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 font-medium">
                {isFa ? 'پاکسازی شده' : 'Cleaned'}
              </span>
            )}
          </h2>
          <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono tabular-nums mt-0.5">
            <span>{photo.type}</span>
            <span>·</span>
            <span>{formatBytes(photo.size)}</span>
            {exif.imageWidth && exif.imageHeight && (
              <>
                <span>·</span>
                <span>
                  {exif.imageWidth} × {exif.imageHeight} px
                </span>
              </>
            )}
          </div>
        </div>

        {/* Action Button */}
        <div className="flex items-center gap-2 shrink-0">
          {isCleaned ? (
            <button
              onClick={() => onDownloadSingle(photo.id)}
              className="px-3.5 py-1.5 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white font-medium flex items-center gap-1.5 text-xs shadow-sm shadow-emerald-600/20 transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isFa ? 'دانلود نسخه امن' : 'Download Clean File'}</span>
            </button>
          ) : (
            <button
              onClick={() => onCleanSingle(photo.id)}
              disabled={photo.isProcessing}
              className="px-3.5 py-1.5 rounded-md bg-blue-600 hover:bg-blue-500 text-white font-medium flex items-center gap-1.5 text-xs shadow-sm shadow-blue-600/20 transition-all"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{isFa ? 'حذف اگزیف و ایمن‌سازی' : 'Strip Metadata Now'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Tabs bar */}
      <div className="flex items-center justify-between px-4 bg-slate-950/40 border-b border-slate-800/80 text-xs shrink-0">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setActiveTab('preview')}
            className={`px-3 py-2 border-b-2 font-medium transition-colors flex items-center gap-1.5 ${
              activeTab === 'preview'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>{isFa ? 'پیش‌نمایش تصویر' : 'Image Preview'}</span>
          </button>

          <button
            onClick={() => setActiveTab('metadata')}
            className={`px-3 py-2 border-b-2 font-medium transition-colors flex items-center gap-1.5 ${
              activeTab === 'metadata'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>
              {isFa ? 'اطلاعات اگزیف و حریم خصوصی' : 'EXIF & Privacy'}
              <span className="ml-1 text-[10px] px-1.5 py-0.2 bg-slate-800 rounded font-mono">
                {isCleaned ? 0 : exif.rawTagsCount}
              </span>
            </span>
          </button>

          {hasGps && (
            <button
              onClick={() => setActiveTab('gps')}
              className={`px-3 py-2 border-b-2 font-medium transition-colors flex items-center gap-1.5 text-rose-400 ${
                activeTab === 'gps'
                  ? 'border-rose-500 text-rose-400'
                  : 'border-transparent hover:text-rose-300'
              }`}
            >
              <MapPin className="w-3.5 h-3.5 animate-bounce" />
              <span>{isFa ? 'موقعیت مکانی GPS (حساس)' : 'GPS Location'}</span>
            </button>
          )}
        </div>

        {/* Zoom controls for preview tab */}
        {activeTab === 'preview' && (
          <div className="flex items-center gap-1 text-slate-400">
            {isCleaned && (
              <div className="flex items-center bg-slate-900 border border-slate-800 rounded p-0.5 mr-2">
                <button
                  onClick={() => setPreviewMode('original')}
                  className={`px-2 py-0.5 rounded text-[11px] ${
                    previewMode === 'original' ? 'bg-slate-700 text-white' : 'hover:text-slate-200'
                  }`}
                >
                  {isFa ? 'تصویر اصلی' : 'Original'}
                </button>
                <button
                  onClick={() => setPreviewMode('cleaned')}
                  className={`px-2 py-0.5 rounded text-[11px] ${
                    previewMode === 'cleaned' ? 'bg-emerald-600 text-white' : 'hover:text-slate-200'
                  }`}
                >
                  {isFa ? 'پاکسازی شده' : 'Cleaned'}
                </button>
              </div>
            )}

            <button
              onClick={() => setZoomLevel((z) => Math.max(0.5, z - 0.25))}
              className="p-1 rounded hover:bg-slate-800 hover:text-slate-200"
              title="Zoom out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-[11px] font-mono px-1">{Math.round(zoomLevel * 100)}%</span>
            <button
              onClick={() => setZoomLevel((z) => Math.min(3, z + 0.25))}
              className="p-1 rounded hover:bg-slate-800 hover:text-slate-200"
              title="Zoom in"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setZoomLevel(1)}
              className="p-1 rounded hover:bg-slate-800 hover:text-slate-200"
              title="Reset Zoom"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {activeTab === 'preview' && (
          <div className="flex flex-col items-center justify-center min-h-[360px] bg-slate-950/80 rounded-xl border border-slate-800/80 overflow-hidden relative p-4">
            <div
              className="transition-transform duration-150 ease-out flex items-center justify-center"
              style={{ transform: `scale(${zoomLevel})` }}
            >
              <img
                src={currentPreviewUrl}
                alt={photo.name}
                className="max-h-[500px] max-w-full rounded object-contain shadow-2xl"
              />
            </div>

            {/* Floating preview badge */}
            <div className="absolute bottom-3 left-3 bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-700/60 text-xs flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-400"></span>
              <span>
                {previewMode === 'cleaned' && isCleaned
                  ? isFa
                    ? 'پیش‌نمایش نسخه پاکسازی شده (بدون متادیتا)'
                    : 'Cleaned preview (No metadata)'
                  : isFa
                  ? 'پیش‌نمایش تصویر اصلی'
                  : 'Original photo preview'}
              </span>
            </div>
          </div>
        )}

        {/* Tab 2: Metadata & Privacy Analysis */}
        {activeTab === 'metadata' && (
          <div className="space-y-4">
            {/* Privacy Assessment Card */}
            <div
              className={`p-4 rounded-xl border ${
                isCleaned
                  ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-200'
                  : exif.riskLevel === 'critical'
                  ? 'bg-rose-950/40 border-rose-500/40 text-rose-200'
                  : exif.riskLevel === 'high'
                  ? 'bg-amber-950/30 border-amber-500/30 text-amber-200'
                  : 'bg-slate-900/60 border-slate-800 text-slate-300'
              }`}
            >
              <div className="flex items-start gap-3">
                {isCleaned ? (
                  <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                )}
                <div>
                  <h4 className="text-xs font-bold mb-1">
                    {isCleaned
                      ? isFa
                        ? 'تصویر ایمن‌سازی شده و آماده اشتراک‌گذاری در اینترنت'
                        : 'Image is safe & ready for public sharing'
                      : isFa
                      ? `سطح ریسک حریم خصوصی: ${
                          exif.riskLevel === 'critical'
                            ? 'بحرانی (افشای مکان)'
                            : exif.riskLevel === 'high'
                            ? 'بالا'
                            : 'متوسط'
                        }`
                      : `Privacy Risk: ${exif.riskLevel.toUpperCase()}`}
                  </h4>
                  <ul className="text-xs opacity-90 space-y-1 list-disc list-inside">
                    {isCleaned ? (
                      <li>
                        {isFa
                          ? 'تمام اطلاعات اگزیف، موقعیت مکانی و هویت دوربین با موفقیت پاک شدند.'
                          : 'All EXIF tags, GPS location, and camera signatures successfully stripped.'}
                      </li>
                    ) : (
                      exif.riskReasons.map((reason, idx) => <li key={idx}>{reason}</li>)
                    )}
                  </ul>
                </div>
              </div>
            </div>

            {/* Metadata Cards Grid */}
            {!isCleaned && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* Camera & Hardware */}
                <div className="p-3.5 bg-slate-900/60 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-200 border-b border-slate-800/80 pb-2">
                    <Smartphone className="w-4 h-4 text-blue-400" />
                    <span>{isFa ? 'دستگاه و دوربین عکاسی' : 'Camera & Device'}</span>
                  </div>
                  <div className="space-y-1.5 text-xs text-slate-300">
                    <div className="flex justify-between py-0.5">
                      <span className="text-slate-400">{isFa ? 'شرکت سازنده:' : 'Make:'}</span>
                      <span className="font-medium text-slate-100">{exif.make || '—'}</span>
                    </div>
                    <div className="flex justify-between py-0.5">
                      <span className="text-slate-400">{isFa ? 'مدل دقیق:' : 'Model:'}</span>
                      <span className="font-medium text-slate-100">{exif.model || '—'}</span>
                    </div>
                    <div className="flex justify-between py-0.5">
                      <span className="text-slate-400">{isFa ? 'مدل لنز:' : 'Lens:'}</span>
                      <span className="font-medium text-slate-100 truncate max-w-[200px]" title={exif.lensModel}>
                        {exif.lensModel || '—'}
                      </span>
                    </div>
                    {exif.serialNumber && (
                      <div className="flex justify-between py-0.5 text-rose-300">
                        <span className="text-rose-400">{isFa ? 'شماره سریال:' : 'Serial No:'}</span>
                        <span className="font-mono">{exif.serialNumber}</span>
                      </div>
                    )}
                    {exif.software && (
                      <div className="flex justify-between py-0.5">
                        <span className="text-slate-400">{isFa ? 'نرم‌افزار/سیستم‌عامل:' : 'Software:'}</span>
                        <span className="font-medium truncate max-w-[200px]" title={exif.software}>
                          {exif.software}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Shooting Settings */}
                <div className="p-3.5 bg-slate-900/60 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-200 border-b border-slate-800/80 pb-2">
                    <Sliders className="w-4 h-4 text-amber-400" />
                    <span>{isFa ? 'تنظیمات تصویر و نوردهی' : 'Capture Settings'}</span>
                  </div>
                  <div className="space-y-1.5 text-xs text-slate-300 font-mono tabular-nums">
                    <div className="flex justify-between py-0.5">
                      <span className="text-slate-400 font-sans">{isFa ? 'ایزو (ISO):' : 'ISO:'}</span>
                      <span className="font-medium text-slate-100">{exif.iso || '—'}</span>
                    </div>
                    <div className="flex justify-between py-0.5">
                      <span className="text-slate-400 font-sans">{isFa ? 'دیافراگم (Aperture):' : 'Aperture:'}</span>
                      <span className="font-medium text-slate-100">
                        {exif.fNumber ? `f/${exif.fNumber}` : '—'}
                      </span>
                    </div>
                    <div className="flex justify-between py-0.5">
                      <span className="text-slate-400 font-sans">{isFa ? 'سرعت شاتر:' : 'Shutter Speed:'}</span>
                      <span className="font-medium text-slate-100">{exif.exposureTime || '—'}</span>
                    </div>
                    <div className="flex justify-between py-0.5">
                      <span className="text-slate-400 font-sans">{isFa ? 'فاصله کانونی:' : 'Focal Length:'}</span>
                      <span className="font-medium text-slate-100">
                        {exif.focalLength ? `${exif.focalLength}mm` : '—'}
                      </span>
                    </div>
                    <div className="flex justify-between py-0.5">
                      <span className="text-slate-400 font-sans">{isFa ? 'فلاش:' : 'Flash:'}</span>
                      <span className="font-medium font-sans text-slate-100">{exif.flash || '—'}</span>
                    </div>
                  </div>
                </div>

                {/* Timestamps */}
                <div className="p-3.5 bg-slate-900/60 rounded-xl border border-slate-800 space-y-2 md:col-span-2">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-200 border-b border-slate-800/80 pb-2">
                    <Calendar className="w-4 h-4 text-indigo-400" />
                    <span>{isFa ? 'تاریخ‌ها و مهرهای زمانی' : 'Timestamps'}</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-300">
                    <div className="flex justify-between py-0.5 bg-slate-950/40 p-2 rounded">
                      <span className="text-slate-400">{isFa ? 'تاریخ دقیق عکاسی:' : 'Date Taken:'}</span>
                      <span className="font-medium text-slate-100 font-mono">{exif.dateTimeOriginal || '—'}</span>
                    </div>
                    <div className="flex justify-between py-0.5 bg-slate-950/40 p-2 rounded">
                      <span className="text-slate-400">{isFa ? 'تاریخ ویرایش یا ایجاد:' : 'Create/Modify Date:'}</span>
                      <span className="font-medium text-slate-100 font-mono">{exif.modifyDate || exif.createDate || '—'}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Raw Tags Searchable Table */}
            {!isCleaned && (
              <div className="p-3.5 bg-slate-900/60 rounded-xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="text-xs font-semibold text-slate-200 flex items-center gap-2">
                    <Layers className="w-4 h-4 text-emerald-400" />
                    <span>{isFa ? 'فهرست کامل برچسب‌های خام (Raw Tags)' : 'All Raw EXIF Tags'}</span>
                  </div>
                  <div className="relative w-48">
                    <input
                      type="text"
                      value={tagFilter}
                      onChange={(e) => setTagFilter(e.target.value)}
                      placeholder={isFa ? 'جستجو در برچسب‌ها...' : 'Filter tags...'}
                      className="w-full bg-slate-950 text-xs px-2.5 py-1 pr-7 rounded border border-slate-800 text-slate-200 focus:outline-none focus:border-blue-500"
                    />
                    <Search className="w-3.5 h-3.5 text-slate-500 absolute right-2 top-2" />
                  </div>
                </div>

                <div className="max-h-60 overflow-y-auto divide-y divide-slate-800/60 rounded border border-slate-800/60 font-mono text-[11px]">
                  {filteredTags.length > 0 ? (
                    filteredTags.map(([k, v]) => (
                      <div key={k} className="flex items-center justify-between p-2 hover:bg-slate-800/40">
                        <span className="text-blue-400 font-semibold">{k}</span>
                        <span className="text-slate-300 max-w-xs truncate text-right" title={String(v)}>
                          {typeof v === 'object' ? JSON.stringify(v) : String(v)}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-center text-slate-500 text-xs">
                      {isFa ? 'برچسبی یافت نشد' : 'No tags match filter'}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: GPS & Location Detailed View */}
        {(activeTab === 'gps' || (hasGps && activeTab === 'metadata')) && hasGps && exif.gps && (
          <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-500/30 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-rose-300 font-semibold text-xs">
                <MapPin className="w-4 h-4 text-rose-400 animate-pulse" />
                <span>{isFa ? 'هشدار حریم خصوصی: موقعیت مکانی GPS ثبت شده' : 'Privacy Warning: GPS Coordinates Found'}</span>
              </div>
              <button
                onClick={handleCopyCoords}
                className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] flex items-center gap-1 transition-colors"
              >
                {copiedCoord ? <CheckCircle className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedCoord ? (isFa ? 'کپی شد!' : 'Copied!') : (isFa ? 'کپی مختصات' : 'Copy Coordinates')}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                <span className="text-slate-400 text-[11px] block">{isFa ? 'عرض جغرافیایی (Latitude):' : 'Latitude:'}</span>
                <span className="text-rose-400 font-mono font-bold text-sm">{exif.gps.latitude}</span>
              </div>
              <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                <span className="text-slate-400 text-[11px] block">{isFa ? 'طول جغرافیایی (Longitude):' : 'Longitude:'}</span>
                <span className="text-rose-400 font-mono font-bold text-sm">{exif.gps.longitude}</span>
              </div>
              <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                <span className="text-slate-400 text-[11px] block">{isFa ? 'ارتفاع از سطح دریا:' : 'Altitude:'}</span>
                <span className="text-slate-200 font-mono font-bold text-sm">
                  {exif.gps.altitude ? `${exif.gps.altitude} m` : '—'}
                </span>
              </div>
            </div>

            {exif.gps.formattedLocation && (
              <div className="text-xs text-slate-300 bg-slate-900/60 p-2 rounded border border-slate-800 flex items-center gap-2">
                <Info className="w-4 h-4 text-blue-400 shrink-0" />
                <span>{exif.gps.formattedLocation}</span>
              </div>
            )}

            {/* Interactive coordinates preview / external map launchers */}
            <div className="flex items-center gap-3 pt-1">
              <a
                href={exif.gps.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs flex items-center gap-1.5 transition-colors shadow-xs"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>{isFa ? 'نمایش در نقشه گوگل (Google Maps)' : 'Open in Google Maps'}</span>
              </a>

              <a
                href={`https://www.openstreetmap.org/?mlat=${exif.gps.latitude}&mlon=${exif.gps.longitude}#map=16/${exif.gps.latitude}/${exif.gps.longitude}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs flex items-center gap-1.5 transition-colors border border-slate-700"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>{isFa ? 'نمایش در OpenStreetMap' : 'Open in OpenStreetMap'}</span>
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
