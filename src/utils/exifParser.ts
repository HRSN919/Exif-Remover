import exifr from 'exifr';
import { ExifDetails, GpsData } from '../types';

export async function parseExifData(source: File | Blob | ArrayBuffer): Promise<ExifDetails> {
  try {
    // Parse comprehensive tags including GPS, IPTC, XMP
    const tags = await exifr.parse(source, {
      tiff: true,
      xmp: true,
      icc: true,
      iptc: true,
      jfif: true,
      ihdr: true,
      mergeOutput: true,
      reviveValues: true,
      translateKeys: true,
      translateValues: true,
    }) || {};

    // Check GPS specifically using exifr.gps() for high accuracy coordinate translation
    let gpsData: GpsData | undefined = undefined;
    try {
      const gpsRaw = await exifr.gps(source);
      if (gpsRaw && typeof gpsRaw.latitude === 'number' && typeof gpsRaw.longitude === 'number') {
        const lat = Number(gpsRaw.latitude.toFixed(6));
        const lng = Number(gpsRaw.longitude.toFixed(6));
        const mapsUrl = `https://www.google.com/maps?q=${lat},${lng}`;
        gpsData = {
          latitude: lat,
          longitude: lng,
          altitude: tags.GPSAltitude ? Math.round(Number(tags.GPSAltitude)) : undefined,
          latitudeRef: tags.GPSLatitudeRef,
          longitudeRef: tags.GPSLongitudeRef,
          mapsUrl,
          formattedLocation: `${lat > 0 ? `${lat}° N` : `${Math.abs(lat)}° S`}, ${lng > 0 ? `${lng}° E` : `${Math.abs(lng)}° W`}`,
        };
      }
    } catch {
      // Fallback if gps() fails but tags contains latitude
      if (typeof tags.latitude === 'number' && typeof tags.longitude === 'number') {
        const lat = Number(tags.latitude.toFixed(6));
        const lng = Number(tags.longitude.toFixed(6));
        gpsData = {
          latitude: lat,
          longitude: lng,
          altitude: tags.GPSAltitude ? Math.round(Number(tags.GPSAltitude)) : undefined,
          mapsUrl: `https://www.google.com/maps?q=${lat},${lng}`,
          formattedLocation: `${lat}° , ${lng}°`,
        };
      }
    }

    // Capture formatting
    let exposureTimeStr: string | undefined = undefined;
    if (tags.ExposureTime) {
      if (typeof tags.ExposureTime === 'number') {
        if (tags.ExposureTime < 1) {
          exposureTimeStr = `1/${Math.round(1 / tags.ExposureTime)}s`;
        } else {
          exposureTimeStr = `${tags.ExposureTime}s`;
        }
      } else {
        exposureTimeStr = String(tags.ExposureTime);
      }
    }

    const allKeys = Object.keys(tags);
    const hasGps = Boolean(gpsData);

    // Calculate Privacy Risk Level
    const riskReasons: string[] = [];
    let riskLevel: ExifDetails['riskLevel'] = 'safe';

    if (hasGps) {
      riskLevel = 'critical';
      riskReasons.push('مختصات دقیق مکانی (GPS) ثبت شده است؛ مکان زندگی یا حضور شما قابل ردیابی است.');
    }

    if (tags.SerialNumber || tags.BodySerialNumber || tags.LensSerialNumber) {
      if (riskLevel !== 'critical') riskLevel = 'high';
      riskReasons.push('شماره سریال منحصر‌به‌فرد سخت‌افزار ثبت شده که هویت دستگاه را افشا می‌کند.');
    }

    if (tags.OwnerName || tags.Artist || tags.Copyright || tags.CameraOwnerName) {
      if (riskLevel !== 'critical') riskLevel = 'high';
      riskReasons.push('نام عکاس، مالک یا اطلاعات کپی‌رایت شخصی در فایل موجود است.');
    }

    if (tags.Make || tags.Model) {
      if (riskLevel === 'safe') riskLevel = 'medium';
      riskReasons.push(`مدل دقیق دستگاه ضبط‌کننده (${tags.Make || ''} ${tags.Model || ''}) مشخص است.`);
    }

    if (tags.DateTimeOriginal || tags.CreateDate) {
      if (riskLevel === 'safe') riskLevel = 'low';
      riskReasons.push('زمان و تاریخ دقیق ثبت عکس فاش شده است.');
    }

    if (allKeys.length === 0) {
      riskLevel = 'safe';
      riskReasons.push('هیچ برچسب اگزیف یا متادیتایی یافت نشد. تصویر از نظر حریم خصوصی امن است.');
    }

    return {
      gps: gpsData,
      hasGps,
      make: tags.Make ? String(tags.Make).trim() : undefined,
      model: tags.Model ? String(tags.Model).trim() : undefined,
      lensModel: tags.LensModel ? String(tags.LensModel).trim() : undefined,
      software: tags.Software ? String(tags.Software).trim() : undefined,
      serialNumber: tags.SerialNumber || tags.BodySerialNumber,
      ownerName: tags.OwnerName || tags.Artist || tags.CameraOwnerName,

      iso: tags.ISO ? Number(tags.ISO) : undefined,
      fNumber: tags.FNumber ? Number(tags.FNumber) : undefined,
      exposureTime: exposureTimeStr,
      focalLength: tags.FocalLength ? Math.round(Number(tags.FocalLength)) : undefined,
      flash: tags.Flash ? String(tags.Flash) : undefined,
      whiteBalance: tags.WhiteBalance ? String(tags.WhiteBalance) : undefined,
      meteringMode: tags.MeteringMode ? String(tags.MeteringMode) : undefined,

      dateTimeOriginal: tags.DateTimeOriginal ? formatExifDate(tags.DateTimeOriginal) : undefined,
      modifyDate: tags.ModifyDate ? formatExifDate(tags.ModifyDate) : undefined,
      createDate: tags.CreateDate ? formatExifDate(tags.CreateDate) : undefined,

      imageWidth: tags.ImageWidth || tags.ExifImageWidth,
      imageHeight: tags.ImageHeight || tags.ExifImageHeight,
      orientation: tags.Orientation,
      colorSpace: tags.ColorSpace ? String(tags.ColorSpace) : undefined,

      rawTagsCount: allKeys.length,
      allTags: tags,
      riskLevel,
      riskReasons,
    };
  } catch (err) {
    console.warn('Exif parsing error:', err);
    return {
      hasGps: false,
      rawTagsCount: 0,
      allTags: {},
      riskLevel: 'safe',
      riskReasons: ['فایل فاقد اطلاعات متادیتا است یا ساختار متادیتا خوانده نشد.'],
    };
  }
}

function formatExifDate(dateVal: any): string {
  if (!dateVal) return '';
  if (dateVal instanceof Date) {
    return dateVal.toLocaleString('fa-IR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  }
  return String(dateVal);
}
