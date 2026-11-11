export interface GpsData {
  latitude: number;
  longitude: number;
  altitude?: number;
  latitudeRef?: string;
  longitudeRef?: string;
  mapsUrl: string;
  formattedLocation?: string;
}

export interface ExifDetails {
  // GPS & Location
  gps?: GpsData;
  hasGps: boolean;
  
  // Camera & Device
  make?: string;
  model?: string;
  lensModel?: string;
  software?: string;
  serialNumber?: string;
  ownerName?: string;

  // Capture specs
  iso?: number;
  fNumber?: number;
  exposureTime?: number | string;
  focalLength?: number;
  flash?: string | boolean;
  whiteBalance?: string;
  meteringMode?: string;

  // Timestamps
  dateTimeOriginal?: string;
  modifyDate?: string;
  createDate?: string;

  // Technical
  imageWidth?: number;
  imageHeight?: number;
  orientation?: number;
  colorSpace?: string;
  format?: string;

  // Raw tag count and dictionary
  rawTagsCount: number;
  allTags: Record<string, any>;

  // Privacy assessment
  riskLevel: 'critical' | 'high' | 'medium' | 'low' | 'safe';
  riskReasons: string[];
}

export interface PhotoItem {
  id: string;
  file: File;
  name: string;
  size: number;
  type: string;
  previewUrl: string;
  exif: ExifDetails;
  isProcessing: boolean;
  isCleaned: boolean;
  cleanedBlob?: Blob;
  cleanedPreviewUrl?: string;
  cleanedSize?: number;
  cleanedExif?: ExifDetails;
  error?: string;
}

export type CleanMode = 'strip_all' | 'strip_gps_only' | 'strip_sensitive';
export type CleanEngine = 'lossless' | 'canvas';

export interface CleanSettings {
  mode: CleanMode;
  engine: CleanEngine;
  fileSuffix: string; // e.g. "_clean"
  quality: number; // 0.8 - 1.0 (for canvas engine)
  preserveName: boolean;
}
