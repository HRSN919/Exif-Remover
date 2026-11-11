import React, { useState } from 'react';
import {
  X,
  BookOpen,
  ShieldCheck,
  CheckCircle2,
  MapPin,
  Camera,
  ExternalLink,
  Sliders,
  Layers,
  Sparkles,
} from 'lucide-react';

interface GuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: 'fa' | 'en';
}

export const GuideModal: React.FC<GuideModalProps> = ({ isOpen, onClose, lang }) => {
  if (!isOpen) return null;
  const isFa = lang === 'fa';
  const [activeTab, setActiveTab] = useState<'how_to_use' | 'privacy_exif'>('how_to_use');

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-5">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-2xl max-h-[85vh] shadow-2xl flex flex-col text-slate-200 overflow-hidden">
        {/* Titlebar */}
        <div className="px-5 py-3.5 bg-slate-950/90 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-md bg-blue-600 flex items-center justify-center text-white shadow-sm">
              <BookOpen className="w-3.5 h-3.5" />
            </div>
            <h3 className="font-bold text-sm text-slate-100">
              {isFa ? 'راهنمای کاربری و حفظ حریم خصوصی تصاویر' : 'User Guide & Photo Privacy Manual'}
            </h3>
            <span className="text-[11px] text-slate-500 font-mono">byhrsn.com</span>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-rose-600 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-2 px-5 bg-slate-950/50 border-b border-slate-800 text-xs shrink-0">
          <button
            onClick={() => setActiveTab('how_to_use')}
            className={`px-4 py-3 border-b-2 font-medium flex items-center gap-2 transition-colors ${
              activeTab === 'how_to_use'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>{isFa ? 'نحوه استفاده از نرم‌افزار' : 'How to Use'}</span>
          </button>

          <button
            onClick={() => setActiveTab('privacy_exif')}
            className={`px-4 py-3 border-b-2 font-medium flex items-center gap-2 transition-colors ${
              activeTab === 'privacy_exif'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span>{isFa ? 'خطرات اگزیف و حریم خصوصی' : 'EXIF Privacy Risks'}</span>
          </button>
        </div>

        {/* Content body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs leading-relaxed">
          {/* TAB 1: HOW TO USE */}
          {activeTab === 'how_to_use' && (
            <div className="space-y-5">
              <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-3">
                <h4 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-400" />
                  <span>{isFa ? 'مراحل پاکسازی سریع تصاویر:' : 'Quick Steps to Clean Photos:'}</span>
                </h4>
                <ol className="space-y-3 list-decimal list-inside text-slate-300">
                  <li className="pl-1">
                    <strong className="text-slate-100">
                      {isFa ? 'انتخاب تصاویر یا پوشه:' : 'Select Photos or Folder:'}
                    </strong>{' '}
                    {isFa
                      ? 'روی دکمه «انتخاب تصاویر» یا «انتخاب پوشه» کلیک کنید یا عکس‌های مد نظر را مستقیماً از ویندوز به داخل پنجره برنامه بکشید (Drag & Drop).'
                      : 'Click "Select Photos" or "Select Folder", or drag files directly into the window.'}
                  </li>
                  <li className="pl-1">
                    <strong className="text-slate-100">
                      {isFa ? 'بررسی اگزیف و موقعیت مکانی:' : 'Inspect EXIF & Location:'}
                    </strong>{' '}
                    {isFa
                      ? 'با کلیک روی هر عکس در لیست سمت چپ، تب‌های پیش‌نمایش، اگزیف و موقعیت جغرافیایی فعال می‌شوند. در صورت وجود مختصات GPS، هشدار قرمز با دکمه نقشه گوگل و کپی مختصات نمایش داده می‌شود.'
                      : 'Click any photo to view its GPS location, camera model, shutter settings, and full metadata table.'}
                  </li>
                  <li className="pl-1">
                    <strong className="text-slate-100">
                      {isFa ? 'انتخاب روش پاکسازی:' : 'Choose Engine:'}
                    </strong>{' '}
                    {isFa
                      ? 'از بالای صفحه می‌توانید روش «سریع (بدون افت کیفیت)» را برای پردازش آنی بایت‌های JPEG با کیفیت ۱۰۰٪ یا روش «عمیق (بوم تصویر)» را برای رندر دوباره پیکسل‌ها انتخاب نمایید.'
                      : 'Choose "Lossless (Fast)" for 100% original pixel quality or "Deep Canvas" for full reconstruction.'}
                  </li>
                  <li className="pl-1">
                    <strong className="text-slate-100">
                      {isFa ? 'حذف اگزیف و ایمن‌سازی:' : 'Strip & Secure:'}
                    </strong>{' '}
                    {isFa
                      ? 'با زدن دکمه سبز «حذف اگزیف و ایمن‌سازی»، تمام تصاویر موجود در صف به سرعت پردازش می‌شوند.'
                      : 'Click "Strip Exif & Secure" to process all images in the queue simultaneously.'}
                  </li>
                  <li className="pl-1">
                    <strong className="text-slate-100">
                      {isFa ? 'دانلود تکی یا خروجی ZIP یکجا:' : 'Download Clean Files or ZIP:'}
                    </strong>{' '}
                    {isFa
                      ? 'می‌توانید هر تصویر را تکی دانلود کنید یا با کلیک بر روی دکمه بنفش «دانلود ZIP»، تمام عکس‌های پاکسازی شده را در یک فایل فشرده دریافت نمایید.'
                      : 'Download photos individually or click "Download ZIP" for a single archive.'}
                  </li>
                </ol>
              </div>

              {/* Zero Server Notice */}
              <div className="bg-emerald-950/30 p-4 rounded-xl border border-emerald-500/30 text-emerald-200">
                <div className="flex items-center gap-2 font-bold mb-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>{isFa ? 'امنیت ۱۰۰٪ آفلاین و محلی:' : '100% Offline & Private:'}</span>
                </div>
                <p className="text-[11px] leading-relaxed text-emerald-300">
                  {isFa
                    ? 'عکس‌های شما به هیچ سروری آپلود نمی‌شوند. تمام فرآیندهای خواندن متادیتا و حذف بایت‌های اگزیف درون حافظه رم کامپیوتر شما انجام می‌گیرد.'
                    : 'Zero photos leave your computer. Everything runs in local memory with zero tracking or telemetry.'}
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: EXIF PRIVACY EXPLANATION */}
          {activeTab === 'privacy_exif' && (
            <div className="space-y-4">
              <div className="bg-rose-950/30 p-4 rounded-xl border border-rose-500/30 space-y-2">
                <h4 className="text-sm font-bold text-rose-200 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-rose-400" />
                  <span>{isFa ? 'چرا حذف اگزیف لوکیشن برای همه کاربران حیاتی است؟' : 'Why Stripping GPS Location is Critical:'}</span>
                </h4>
                <p className="text-xs text-rose-200 leading-relaxed">
                  {isFa
                    ? 'دوربین گوشی‌های آیفون و اندروید موقع عکاسی به طور خودکار مختصات ماهواره‌ای GPS شامل طول و عرض جغرافیایی با دقت چند متری را در هدر فایل ذخیره می‌کنند. اگر عکسی در منزل، محل کار یا سفر خصوصی گرفته باشید، با ارسال فایل اصلی در تلگرام، واتس‌اپ (به عنوان File)، وبلاگ‌ها و فروم‌ها، آدرس دقیق فیزیکی شما در دسترس عموم قرار می‌گیرد!'
                    : 'Smartphones embed high-precision GPS coordinates into every photo. Sharing original files can expose your home or work address.'}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 bg-slate-950/60 rounded-xl border border-slate-800 space-y-1.5">
                  <div className="font-bold text-slate-100 flex items-center gap-1.5">
                    <Camera className="w-3.5 h-3.5 text-blue-400" />
                    <span>{isFa ? 'شناسه و شماره سریال دستگاه' : 'Hardware & Serial Identifiers'}</span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    {isFa
                      ? 'بسیاری از دوربین‌ها شماره سریال یکتای بدنه و لنز را در اگزیف ثبت می‌کنند که امکان رهگیری تمام عکس‌های گرفته شده توسط یک شخص را فراهم می‌سازد.'
                      : 'Camera serial numbers link disparate photos taken by the same photographer together.'}
                  </p>
                </div>

                <div className="p-3.5 bg-slate-950/60 rounded-xl border border-slate-800 space-y-1.5">
                  <div className="font-bold text-slate-100 flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5 text-amber-400" />
                    <span>{isFa ? 'مهرهای زمانی و اطلاعات ویرایشگر' : 'Timestamps & Software Trace'}</span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    {isFa
                      ? 'تاریخ و ساعت دقیق عکاسی، نسخه‌های لایتروم یا فتوشاپ، و حتی نام اکانت کامپیوتر در متادیتای XMP پنهان می‌شوند.'
                      : 'Exact timestamps, operating system user names, and editing software logs are hidden in XMP.'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-950/90 border-t border-slate-800 flex items-center justify-between shrink-0">
          <a
            href="https://byhrsn.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-blue-400 hover:underline flex items-center gap-1 font-mono"
          >
            <span>byhrsn.com</span>
            <ExternalLink className="w-3 h-3" />
          </a>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs transition-colors shadow-sm shadow-blue-600/30"
          >
            {isFa ? 'متوجه شدم و بستن' : 'Close Guide'}
          </button>
        </div>
      </div>
    </div>
  );
};
