import React from 'react';
import {
  MapPin,
  Camera,
  ShieldAlert,
  ShieldCheck,
  CheckCircle,
  Clock,
  Download,
  Trash2,
  Eye,
  FileImage,
  Upload,
  AlertTriangle,
} from 'lucide-react';
import { PhotoItem } from '../types';
import { formatBytes } from '../utils/exifCleaner';

interface PhotoListProps {
  photos: PhotoItem[];
  selectedPhotoId: string | null;
  onSelectPhoto: (id: string) => void;
  onCleanSingle: (id: string) => void;
  onDownloadSingle: (id: string) => void;
  onRemovePhoto: (id: string) => void;
  onFilesSelected: (files: FileList | File[]) => void;
  onOpenGuide: () => void;
  lang: 'fa' | 'en';
}

export const PhotoList: React.FC<PhotoListProps> = ({
  photos,
  selectedPhotoId,
  onSelectPhoto,
  onCleanSingle,
  onDownloadSingle,
  onRemovePhoto,
  onFilesSelected,
  onOpenGuide,
  lang,
}) => {
  const isFa = lang === 'fa';
  const [isDragging, setIsDragging] = React.useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFilesSelected(e.dataTransfer.files);
    }
  };

  if (photos.length === 0) {
    return (
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`flex-1 flex flex-col items-center justify-center p-8 text-center border-2 border-dashed transition-all m-4 rounded-xl ${
          isDragging
            ? 'border-blue-500 bg-blue-500/10'
            : 'border-slate-800 bg-slate-900/30 hover:border-slate-700'
        }`}
      >
        <div className="w-16 h-16 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center justify-center text-blue-400 mb-4 shadow-inner">
          <Upload className="w-8 h-8" />
        </div>
        <h3 className="text-base font-semibold text-slate-100 mb-1">
          {isFa ? 'تصاویر خود را به اینجا بکشید یا انتخاب کنید' : 'Drag and drop photos here'}
        </h3>
        <p className="text-xs text-slate-400 max-w-md mb-6 leading-relaxed">
          {isFa
            ? 'پشتیبانی از فرمت‌های JPEG، PNG، WebP، TIFF. اطلاعات اگزیف، موقعیت مکانی GPS و مشخصات حساس دوربین قبل از اشتراک‌گذاری عمومی بررسی و حذف می‌شوند.'
            : 'Supports JPEG, PNG, WebP, TIFF. EXIF tags, GPS location, and camera serials will be inspected and stripped.'}
        </p>

        <div className="flex items-center gap-3">
          <label className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-medium cursor-pointer shadow-sm shadow-blue-500/20 transition-colors">
            <span>{isFa ? 'انتخاب فایل از ویندوز' : 'Browse Files'}</span>
            <input
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                if (e.target.files) onFilesSelected(e.target.files);
              }}
            />
          </label>

          <button
            onClick={onOpenGuide}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5"
          >
            <span>{isFa ? 'راهنمای کاربری' : 'User Guide'}</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`flex-1 overflow-y-auto divide-y divide-slate-800/60 bg-slate-950/30 ${
        isDragging ? 'ring-2 ring-blue-500/50 bg-blue-500/5' : ''
      }`}
    >
      {photos.map((item) => {
        const isSelected = item.id === selectedPhotoId;
        const hasGps = item.exif.hasGps;
        const isCleaned = item.isCleaned;

        return (
          <div
            key={item.id}
            onClick={() => onSelectPhoto(item.id)}
            className={`flex items-center justify-between p-3 gap-3 transition-colors cursor-pointer group ${
              isSelected
                ? 'bg-blue-950/40 border-r-4 border-r-blue-500 text-slate-100'
                : 'hover:bg-slate-900/50 text-slate-300'
            }`}
          >
            {/* Left: Thumbnail & Info */}
            <div className="flex items-center gap-3 min-w-0 flex-1">
              {/* Thumbnail */}
              <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-slate-900 shrink-0 border border-slate-800 group-hover:border-slate-700">
                <img
                  src={isCleaned && item.cleanedPreviewUrl ? item.cleanedPreviewUrl : item.previewUrl}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
                {isCleaned && (
                  <div className="absolute inset-0 bg-emerald-950/60 backdrop-blur-xs flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-emerald-400 drop-shadow" />
                  </div>
                )}
              </div>

              {/* Text details */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-xs text-slate-200 truncate" title={item.name}>
                    {item.name}
                  </span>
                  {isCleaned ? (
                    <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20 whitespace-nowrap">
                      <ShieldCheck className="w-3 h-3" />
                      {isFa ? 'ایمن و پاکسازی شده' : 'Safe & Cleaned'}
                    </span>
                  ) : hasGps ? (
                    <span className="inline-flex items-center gap-1 text-[10px] text-rose-400 bg-rose-500/10 px-1.5 py-0.5 rounded border border-rose-500/20 whitespace-nowrap font-medium animate-pulse">
                      <MapPin className="w-3 h-3" />
                      {isFa ? 'لوکیشن GPS حساس!' : 'GPS Sensitive!'}
                    </span>
                  ) : item.exif.riskLevel === 'high' ? (
                    <span className="inline-flex items-center gap-1 text-[10px] text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20 whitespace-nowrap">
                      <AlertTriangle className="w-3 h-3" />
                      {isFa ? 'سریال / اطلاعات مالک' : 'Device Serial'}
                    </span>
                  ) : item.exif.rawTagsCount > 0 ? (
                    <span className="inline-flex items-center gap-1 text-[10px] text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded whitespace-nowrap">
                      <Camera className="w-3 h-3 text-blue-400" />
                      {item.exif.make || (isFa ? 'متادیتای دوربین' : 'Camera Meta')}
                    </span>
                  ) : (
                    <span className="text-[10px] text-slate-500">{isFa ? 'بدون اگزیف' : 'No Exif'}</span>
                  )}
                </div>

                <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono tabular-nums">
                  <span>{formatBytes(item.size)}</span>
                  {isCleaned && item.cleanedSize && (
                    <>
                      <span>→</span>
                      <span className="text-emerald-400 font-medium">{formatBytes(item.cleanedSize)}</span>
                    </>
                  )}
                  <span>·</span>
                  <span>
                    {isCleaned
                      ? isFa
                        ? '۰ برچسب متادیتا'
                        : '0 tags remaining'
                      : isFa
                      ? `${item.exif.rawTagsCount} برچسب اگزیف`
                      : `${item.exif.rawTagsCount} EXIF tags`}
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Quick Actions */}
            <div className="flex items-center gap-1.5 shrink-0" onClick={(e) => e.stopPropagation()}>
              {!isCleaned ? (
                <button
                  onClick={() => onCleanSingle(item.id)}
                  disabled={item.isProcessing}
                  className="px-2.5 py-1.5 rounded bg-slate-800 hover:bg-emerald-600 text-slate-300 hover:text-white transition-colors flex items-center gap-1 text-xs border border-slate-700/60"
                  title={isFa ? 'حذف متادیتای این تصویر' : 'Clean metadata'}
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 group-hover:text-white" />
                  <span className="hidden sm:inline">{isFa ? 'ایمن‌سازی' : 'Clean'}</span>
                </button>
              ) : (
                <button
                  onClick={() => onDownloadSingle(item.id)}
                  className="px-2.5 py-1.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white transition-colors flex items-center gap-1 text-xs shadow-xs"
                  title={isFa ? 'دانلود نسخه پاکسازی شده' : 'Download cleaned image'}
                >
                  <Download className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{isFa ? 'دانلود' : 'Download'}</span>
                </button>
              )}

              <button
                onClick={() => onSelectPhoto(item.id)}
                className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-blue-400 transition-colors"
                title={isFa ? 'مشاهده پیش‌نمایش و متادیتا' : 'Inspect Details'}
              >
                <Eye className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => onRemovePhoto(item.id)}
                className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-rose-400 transition-colors"
                title={isFa ? 'حذف از لیست' : 'Remove from list'}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};
