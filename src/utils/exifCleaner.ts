import { CleanSettings } from '../types';

/**
 * Strips metadata from image file based on selected engine and mode
 */
export async function cleanImageMetadata(
  file: File | Blob,
  settings: CleanSettings
): Promise<{ blob: Blob; cleanedSize: number }> {
  // If user selected lossless engine and file is JPEG, attempt binary marker strip
  if (settings.engine === 'lossless' && (file.type === 'image/jpeg' || file.type === 'image/jpg')) {
    try {
      const buffer = await file.arrayBuffer();
      const strippedBuffer = stripJpegMetadataBinary(buffer);
      if (strippedBuffer) {
        const cleanBlob = new Blob([strippedBuffer.buffer as ArrayBuffer], { type: 'image/jpeg' });
        return {
          blob: cleanBlob,
          cleanedSize: cleanBlob.size,
        };
      }
    } catch (e) {
      console.warn('Binary lossless stripping failed, falling back to Canvas:', e);
    }
  }

  // Universal Canvas Sanitization
  return sanitizeViaCanvas(file, settings);
}

/**
 * Lossless JPEG APP marker stripper.
 * Strips APP1 (Exif/XMP), APP13 (IPTC/Photoshop), and COM (Comments)
 * without re-encoding pixels.
 */
function stripJpegMetadataBinary(buffer: ArrayBuffer): Uint8Array | null {
  const view = new DataView(buffer);

  // Check JPEG SOI marker (0xFFD8)
  if (view.byteLength < 4 || view.getUint16(0) !== 0xffd8) {
    return null; // Not a valid JPEG
  }

  const pieces: Uint8Array[] = [];
  // Add SOI (0xFF, 0xD8)
  pieces.push(new Uint8Array(buffer, 0, 2));

  let offset = 2;
  const length = view.byteLength;

  while (offset < length) {
    if (view.getUint8(offset) !== 0xff) {
      // Corrupt marker stream, fall back
      return null;
    }

    const marker = view.getUint8(offset + 1);

    // SOS (Start of Scan 0xFFDA) - Rest of file is image entropy data until EOI (0xFFD9)
    if (marker === 0xda) {
      pieces.push(new Uint8Array(buffer, offset));
      break;
    }

    // Markers without payload length
    if (marker === 0xd8 || marker === 0xd9 || (marker >= 0xd0 && marker <= 0xd7)) {
      pieces.push(new Uint8Array(buffer, offset, 2));
      offset += 2;
      continue;
    }

    // Markers with payload length
    if (offset + 4 > length) break;
    const segmentLength = view.getUint16(offset + 2);

    // Markers to strip:
    // 0xE1 = APP1 (EXIF and XMP)
    // 0xED = APP13 (Photoshop IRB / IPTC)
    // 0xFE = COM (Comments)
    // 0xE2 = APP2 (if unwanted, or keep ICC profile)
    const isTargetToStrip = marker === 0xe1 || marker === 0xed || marker === 0xfe;

    if (!isTargetToStrip) {
      // Keep segment (e.g. APP0 JFIF, DQT, DHT, SOF)
      pieces.push(new Uint8Array(buffer, offset, segmentLength + 2));
    }

    offset += 2 + segmentLength;
  }

  // Combine pieces into clean Uint8Array
  const totalLength = pieces.reduce((sum, p) => sum + p.byteLength, 0);
  const result = new Uint8Array(totalLength);
  let pos = 0;
  for (const piece of pieces) {
    result.set(piece, pos);
    pos += piece.byteLength;
  }

  return result;
}

/**
 * Universal Canvas sanitization:
 * Draws image onto a clean Canvas context and exports as pure image pixels.
 * Strips 100% of EXIF, GPS, IPTC, XMP and container metadata.
 */
async function sanitizeViaCanvas(
  file: File | Blob,
  settings: CleanSettings
): Promise<{ blob: Blob; cleanedSize: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      try {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth || img.width;
        canvas.height = img.naturalHeight || img.height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          throw new Error('Canvas 2D context not available');
        }

        // Draw image onto clean canvas
        ctx.drawImage(img, 0, 0);

        // Determine output MIME type
        let mimeType = 'image/jpeg';
        if (file.type === 'image/png') {
          mimeType = 'image/png';
        } else if (file.type === 'image/webp') {
          mimeType = 'image/webp';
        }

        const quality = settings.quality || 0.95;

        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve({
                blob,
                cleanedSize: blob.size,
              });
            } else {
              reject(new Error('Canvas blob generation failed'));
            }
          },
          mimeType,
          quality
        );
      } catch (err) {
        reject(err);
      }
    };

    img.onerror = (e) => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error(`Failed to load image for canvas sanitization: ${e}`));
    };

    img.src = objectUrl;
  });
}

/**
 * Generates cleaned filename with prefix or suffix
 */
export function generateCleanFileName(originalName: string, suffix: string = '_clean'): string {
  const lastDot = originalName.lastIndexOf('.');
  if (lastDot === -1) {
    return `${originalName}${suffix}`;
  }
  const name = originalName.substring(0, lastDot);
  const ext = originalName.substring(lastDot);
  return `${name}${suffix}${ext}`;
}

/**
 * Formats file size in bytes to human-readable string (KB, MB)
 */
export function formatBytes(bytes: number, decimals: number = 2): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}
