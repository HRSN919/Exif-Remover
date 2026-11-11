import React from 'react';
import { X, ShieldCheck, ExternalLink, Lock, CheckCircle2, Heart, Award } from 'lucide-react';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: 'fa' | 'en';
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose, lang }) => {
  if (!isOpen) return null;
  const isFa = lang === 'fa';

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col text-slate-200">
        {/* Windows Dialog Titlebar */}
        <div className="px-4 py-3 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-blue-600 flex items-center justify-center text-white">
              <ShieldCheck className="w-3.5 h-3.5" />
            </div>
            <span className="font-semibold text-xs text-slate-100">
              {isFa ? 'درباره نرم‌افزار ByHRSN Exif Privacy' : 'About ByHRSN Exif Privacy App'}
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-6 h-6 rounded flex items-center justify-center hover:bg-rose-600 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Dialog Body */}
        <div className="p-6 space-y-5 text-xs">
          {/* Brand Presentation */}
          <div className="flex items-center gap-4 bg-slate-950/50 p-4 rounded-xl border border-slate-800">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/20 shrink-0 font-bold text-lg font-mono">
              BH
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <span>ByHRSN Exif Cleaner</span>
                <span className="text-[10px] bg-blue-500/10 text-blue-400 px-1.5 py-0.5 rounded border border-blue-500/20 font-mono">
                  v2.5 Final
                </span>
              </h3>
              <p className="text-slate-400 text-[11px] mt-0.5">
                {isFa
                  ? 'محصول رسمی حریم خصوصی متعلق به وب‌سایت byhrsn.com'
                  : 'Official privacy utility by byhrsn.com'}
              </p>
              <a
                href="https://byhrsn.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:underline font-mono text-[11px] inline-flex items-center gap-1 mt-1 font-medium"
              >
                https://byhrsn.com
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Privacy Guarantee Statement */}
          <div className="space-y-2">
            <h4 className="font-bold text-slate-200 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-emerald-400" />
              <span>{isFa ? 'تعهد ۱۰۰٪ امنیت و حریم خصوصی:' : '100% Security & Privacy Guarantee:'}</span>
            </h4>
            <div className="space-y-1.5 text-slate-300 leading-relaxed bg-slate-950/40 p-3 rounded-lg border border-slate-800/80">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  {isFa
                    ? 'تمام فرآیند پردازش تصویر، استخراج و پاکسازی اگزیف به صورت کاملاً محلی در حافظه رم مرورگر/سیستم شما انجام می‌شود.'
                    : 'All image processing and EXIF stripping runs 100% locally inside your system memory.'}
                </span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  {isFa
                    ? 'هیچ عکسی به هیچ سرور خارجی آپلود نمی‌شود؛ بنابراین عکس‌های خصوصی و خانوادگی شما در امن‌ترین حالت ممکن باقی می‌مانند.'
                    : 'Zero images are uploaded to any server. Your personal and private photos never leave your device.'}
                </span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  {isFa
                    ? 'پشتیبانی از پردازش دسته‌ای نامحدود با دو موتور: حذف بدون افت کیفیت بایت‌های JPEG و بازسازی بوم پیکسل‌ها.'
                    : 'Supports unlimited batch processing with both Lossless JPEG byte stripping and Canvas re-encoding.'}
                </span>
              </div>
            </div>
          </div>

          {/* Why strip EXIF advice */}
          <div className="text-[11px] text-slate-400 bg-blue-950/20 p-3 rounded-lg border border-blue-500/20 leading-relaxed">
            <strong className="text-blue-300 block mb-1">
              {isFa ? '💡 چرا باید اگزیف را قبل از انتشار حذف کنیم؟' : '💡 Why strip EXIF before sharing?'}
            </strong>
            {isFa
              ? 'تصاویری که با گوشی‌های هوشمند ثبت می‌شوند، اغلب دارای موقعیت دقیق جغرافیایی (عرض و طول جغرافیایی خانه یا محل کار)، نام مالک، و شماره سریال سخت‌افزاری هستند. با حذف این اطلاعات، امنیت هویت و موقعیت مکانی شما در شبکه‌های اجتماعی تضمین می‌شود.'
              : 'Smartphone photos frequently embed exact GPS coordinates of your residence or workplace, owner identity, and serial numbers. Stripping this data protects your physical safety and anonymity online.'}
          </div>
        </div>

        {/* Dialog Footer */}
        <div className="px-6 py-3 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between">
          <span className="text-[11px] text-slate-500 font-mono">© ByHRSN · All rights reserved</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs transition-colors"
          >
            {isFa ? 'بستن' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
