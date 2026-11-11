# ByHRSN Exif Cleaner

**Inspect and remove image metadata to help protect your privacy.**

ByHRSN Exif Cleaner is a desktop-oriented image privacy utility built with React, TypeScript, Vite, and Electron. It lets you inspect the metadata embedded in photos, identify potentially sensitive information such as GPS coordinates and device identifiers, and create cleaned copies before sharing images.

The application provides a Persian (RTL) and English interface.

## Features

### Inspect image metadata

- Read available EXIF and related metadata using [ExifR](https://github.com/MikeKovarik/exifr).
- View camera make and model, lens, software, capture date, and image dimensions.
- Inspect photographic settings such as ISO, aperture, shutter speed, focal length, flash, and white balance when those tags are present.
- Detect GPS coordinates and open the location in Google Maps.
- Search and inspect the metadata tags found in a file.
- Display a privacy-risk assessment based on detected metadata.

### Clean images

Two processing engines are available:

- **Lossless (JPEG):** Removes selected JPEG metadata segments (APP1, APP13, and COM) without re-encoding the JPEG image data. This preserves the encoded image data and avoids an additional JPEG compression pass.
- **Deep Canvas:** Draws the image onto an HTML Canvas and exports a new image. This removes metadata that is not carried into the newly encoded image, but it re-encodes the image and may change image quality, file size, color-profile information, or format.

> **Important:** The lossless engine is implemented for JPEG files. Other image types use the Canvas path. Canvas output depends on the image formats supported by the browser/runtime. Canvas processing is not lossless.

### Batch workflow

- Add multiple images at once or select an entire folder.
- Inspect and clean images individually or process the queue in a batch.
- Track batch-processing progress.
- Preview the original and cleaned image.
- Download individual cleaned files or export all cleaned images in a ZIP archive.
- Customize the cleaned filename suffix.

### Desktop and interface

- Windows desktop application powered by Electron.
- Persian and English user interface with RTL/LTR layout.
- Dark and light themes.
- Image preview with zoom controls.
- Built-in usage and privacy guide.

## Privacy

Image inspection and cleaning are performed locally by the application using browser APIs and client-side libraries. The image-processing workflow in this project does not upload selected photos to a remote image-processing server.

For sensitive material, you should still review the application source code and test the packaged build in your own environment before relying on it. Do not treat metadata removal as a guarantee that an image itself contains no identifying visual information.

## Download

Windows x64 builds are configured for two distribution formats:

- **Setup installer:** guided installation, with optional installation-directory selection and Start Menu/Desktop shortcuts.
- **Portable executable:** runs without a conventional installation.

Check the repository's **Releases** page for published builds:

[GitHub Releases](https://github.com/HRSN919/Exif-Remover/releases)

## Run from source

### Requirements

- Windows 10 or Windows 11 for building and testing the Windows desktop package.
- Node.js **22.20.0** (or a compatible Node.js 22 release).
- npm.

### Install dependencies

```bash
git clone https://github.com/HRSN919/Exif-Remover.git
cd Exif-Remover
npm install
```

### Start the development server

```bash
npm run dev
```

Vite starts the development server on port `3000`.

### Run the TypeScript check

```bash
npm run lint
```

### Build the web application

```bash
npm run build
```

The production web assets are generated in `dist/`.

## Build the Windows application

Run these commands in PowerShell from the project directory:

```powershell
npm install
npm run lint
npm run electron:build
```

The build output is written to:

```text
dist_electron/
```

The directory contains the Windows x64 NSIS installer and portable executable.

The packaged application includes the Electron runtime, so end users do not need to install Node.js separately.

For GitHub Actions builds and release-tag publishing, see [BUILD-WINDOWS.md](BUILD-WINDOWS.md).

## Technology stack

- **React 19** and **TypeScript**
- **Vite 8**
- **Electron 45** and **electron-builder**
- **Tailwind CSS 4**
- **ExifR** for metadata parsing
- **JSZip** for batch ZIP exports
- **Lucide React** for interface icons

## Project structure

```text
Exif-Remover/
├── electron/
│   └── main.cjs
├── public/
│   ├── icon.svg
│   └── manifest.json
├── src/
│   ├── components/
│   │   ├── AboutModal.tsx
│   │   ├── GuideModal.tsx
│   │   ├── PhotoInspector.tsx
│   │   ├── PhotoList.tsx
│   │   ├── StatusBar.tsx
│   │   ├── TitleBar.tsx
│   │   └── Toolbar.tsx
│   ├── utils/
│   │   ├── exifCleaner.ts
│   │   ├── exifParser.ts
│   │   └── sampleImages.ts
│   ├── App.tsx
│   ├── index.css
│   ├── main.tsx
│   └── types.ts
├── BUILD-WINDOWS.md
├── package.json
└── vite.config.ts
```

## Notes and limitations

- Metadata availability depends on the source image and the tags written by the camera or editing software.
- The privacy-risk indicator is a heuristic based on detected metadata; it is not a formal security audit.
- The lossless JPEG path removes APP1, APP13, and COM segments. It should not be interpreted as removing every possible metadata-bearing segment from every JPEG variant.
- Canvas re-encoding can change image encoding, quality, file size, and embedded color information. Keep an untouched original if those properties matter.
- Removing metadata does not remove identifying details visible in the pixels of an image.

## License

No repository license file is currently provided. Unless a license is added to the repository, all rights are reserved by the copyright holder and reuse is not automatically permitted.

## Author

**ByHRSN**

- Website: [byhrsn.com](https://byhrsn.com)
- Repository: [HRSN919/Exif-Remover](https://github.com/HRSN919/Exif-Remover)
