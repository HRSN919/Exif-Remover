import { PhotoItem, ExifDetails } from '../types';

/**
 * Creates high-quality synthetic canvas images for quick demonstration.
 */
export async function createSamplePhotos(): Promise<PhotoItem[]> {
  const samples = [
    {
      name: 'IMG_2026_North_Trip_GPS.jpg',
      type: 'image/jpeg',
      title: 'عکس سفر شمال (حاوی لوکیشن GPS و سریال گوشی)',
      theme: 'landscape',
      exif: {
        hasGps: true,
        gps: {
          latitude: 36.845642,
          longitude: 54.432198,
          altitude: 412,
          latitudeRef: 'N',
          longitudeRef: 'E',
          mapsUrl: 'https://www.google.com/maps?q=36.845642,54.432198',
          formattedLocation: '36.8456° N, 54.4321° E (گرگان - جنگل ناهارخوران)',
        },
        make: 'Apple',
        model: 'iPhone 15 Pro Max',
        lensModel: 'iPhone 15 Pro Max back triple camera 6.86mm f/1.78',
        software: 'iOS 18.2',
        serialNumber: 'DX3J79KL0M',
        ownerName: 'Ali Rezaei (iPhone Owner)',
        iso: 64,
        fNumber: 1.78,
        exposureTime: '1/1250s',
        focalLength: 24,
        flash: 'Flash did not fire',
        whiteBalance: 'Auto',
        meteringMode: 'Multi-segment',
        dateTimeOriginal: '۱۴۰۵/۰۲/۱۵ - ۱۴:۳۲:۱۸',
        modifyDate: '۱۴۰۵/۰۲/۱۵ - ۱۴:۳۲:۱۸',
        createDate: '۱۴۰۵/۰۲/۱۵ - ۱۴:۳۲:۱۸',
        imageWidth: 4032,
        imageHeight: 3024,
        rawTagsCount: 48,
        allTags: {
          Make: 'Apple',
          Model: 'iPhone 15 Pro Max',
          Software: 'iOS 18.2',
          GPSLatitude: 36.845642,
          GPSLongitude: 54.432198,
          GPSAltitude: 412,
          LensModel: 'iPhone 15 Pro Max back triple camera 6.86mm f/1.78',
          HostComputer: "Ali's MacBook Pro",
          Artist: 'Ali Rezaei',
        },
        riskLevel: 'critical' as const,
        riskReasons: [
          'موقعیت مکانی دقیق GPS (شمال ایران، گرگان) ثبت شده است!',
          'نام مالک و شماره سریال اختصاصی دستگاه در متادیتا موجود است.',
          'زمان دقیق و تاریخ عکاسی در فایل ذخیره شده است.',
        ],
      },
    },
    {
      name: 'DSC_Studio_Portrait_85mm.jpg',
      type: 'image/jpeg',
      title: 'پرتره آتلیه (حاوی مدل دوربین سونی و لنز حرفه‌ای)',
      theme: 'portrait',
      exif: {
        hasGps: false,
        make: 'Sony',
        model: 'ILCE-7M4 (A7 IV)',
        lensModel: 'FE 85mm F1.4 GM',
        software: 'Adobe Photoshop Lightroom Classic 14.1 (Windows)',
        serialNumber: 'SN-4819208-SONY',
        ownerName: 'Studio ByHRSN',
        iso: 100,
        fNumber: 1.4,
        exposureTime: '1/250s',
        focalLength: 85,
        flash: 'Off, did not fire',
        whiteBalance: 'Custom (5400K)',
        meteringMode: 'Pattern',
        dateTimeOriginal: '۱۴۰۴/۱۱/۲۰ - ۱۱:۱۵:۰۰',
        imageWidth: 7008,
        imageHeight: 4672,
        rawTagsCount: 34,
        allTags: {
          Make: 'Sony',
          Model: 'ILCE-7M4',
          LensModel: 'FE 85mm F1.4 GM',
          PhotoshopFormat: 'Progressive',
          ProfileName: 'Adobe Color',
        },
        riskLevel: 'medium' as const,
        riskReasons: [
          'مدل دوربین حرفه‌ای و لنز، تنظیمات شات و نسخه نرم‌افزار ویرایش ثبت شده است.',
          'اطلاعات کپی‌رایت استودیو و تاریخ در فایل موجود است.',
        ],
      },
    },
    {
      name: 'Modern_Minimal_Architecture.jpg',
      type: 'image/jpeg',
      title: 'عکس معماری مدرن (حاوی متادیتای لوکیشن شیراز)',
      theme: 'architecture',
      exif: {
        hasGps: true,
        gps: {
          latitude: 29.626888,
          longitude: 52.531278,
          altitude: 1540,
          latitudeRef: 'N',
          longitudeRef: 'E',
          mapsUrl: 'https://www.google.com/maps?q=29.626888,52.531278',
          formattedLocation: '29.6268° N, 52.5312° E (شیراز - باغ ارم)',
        },
        make: 'Samsung',
        model: 'Galaxy S24 Ultra',
        lensModel: '23mm f/1.7',
        software: 'One UI 7.0',
        iso: 50,
        fNumber: 1.7,
        exposureTime: '1/4000s',
        focalLength: 23,
        dateTimeOriginal: '۱۴۰۵/۰۱/۰۸ - ۱۶:۴۵:۳۰',
        imageWidth: 4000,
        imageHeight: 3000,
        rawTagsCount: 41,
        allTags: {
          Make: 'Samsung',
          Model: 'Galaxy S24 Ultra',
          Software: 'S928BXXU1AXB5',
          GPSLatitude: 29.626888,
          GPSLongitude: 52.531278,
        },
        riskLevel: 'critical' as const,
        riskReasons: [
          'لوکیشن دقیق مکانی در شیراز ثبت شده است.',
          'مدل گوشی سامسونگ اس ۲۴ اولترا و نسخه سیستم عامل افشا شده است.',
        ],
      },
    },
  ];

  const result: PhotoItem[] = [];

  for (let i = 0; i < samples.length; i++) {
    const s = samples[i];
    const blob = await generateDecorativeImage(s.theme, s.title);
    const file = new File([blob], s.name, { type: 'image/jpeg' });
    const previewUrl = URL.createObjectURL(blob);

    result.push({
      id: `sample-${i}-${Date.now()}`,
      file,
      name: s.name,
      size: blob.size,
      type: 'image/jpeg',
      previewUrl,
      exif: s.exif,
      isProcessing: false,
      isCleaned: false,
    });
  }

  return result;
}

/**
 * Draws a clean, aesthetic graphic canvas representing the photo theme.
 */
function generateDecorativeImage(theme: string, title: string): Promise<Blob> {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 800;
    const ctx = canvas.getContext('2d')!;

    // Background gradient based on theme
    const gradient = ctx.createLinearGradient(0, 0, 1200, 800);
    if (theme === 'landscape') {
      gradient.addColorStop(0, '#064e3b'); // Emerald deep forest
      gradient.addColorStop(0.5, '#0f766e');
      gradient.addColorStop(1, '#022c22');
    } else if (theme === 'portrait') {
      gradient.addColorStop(0, '#1e1b4b'); // Deep indigo studio
      gradient.addColorStop(0.5, '#312e81');
      gradient.addColorStop(1, '#0f172a');
    } else {
      gradient.addColorStop(0, '#7c2d12'); // Warm amber architecture
      gradient.addColorStop(0.5, '#9a3412');
      gradient.addColorStop(1, '#431407');
    }

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 1200, 800);

    // Decorative geometric contours
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 2;
    for (let r = 100; r <= 800; r += 90) {
      ctx.beginPath();
      ctx.arc(600, 400, r, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Grid lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    for (let x = 0; x < 1200; x += 80) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, 800);
      ctx.stroke();
    }

    // Center emblem
    ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.beginPath();
    ctx.roundRect(400, 260, 400, 280, 24);
    ctx.fill();

    // Camera / Lens aperture icon drawing
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(600, 380, 60, 0, Math.PI * 2);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(600, 380, 25, 0, Math.PI * 2);
    ctx.stroke();

    // Text labels
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 32px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('byhrsn.com Sample Photo', 600, 490);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.font = '20px sans-serif';
    ctx.fillText(title, 600, 720);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.font = '16px monospace';
    ctx.fillText('RAW SENSOR PREVIEW • BYHRSN PRIVACY LAB', 600, 755);

    canvas.toBlob((blob) => {
      resolve(blob || new Blob([]));
    }, 'image/jpeg', 0.95);
  });
}
