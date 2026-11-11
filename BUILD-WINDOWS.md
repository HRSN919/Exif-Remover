# Building the Windows installer

The Windows desktop package is built with Electron and electron-builder.

## Local build (Windows 10/11, x64)

Install Node.js 22.20.0 or a compatible Node.js 22 release, then run:

```powershell
npm install
npm run lint
npm run electron:build
```

The generated files are written to `dist_electron/`:

- NSIS setup executable: interactive installer with installation-directory selection and Start Menu/Desktop shortcuts.
- Portable executable: runs without installing the application.

The packaged application does not require Node.js to be installed on the target computer; Electron supplies its runtime.

## Build through GitHub Actions

Open **Actions → Build Windows installers → Run workflow** to build from the selected branch. To publish a GitHub Release with both EXE files attached, push a version tag such as `v2.5.1`.

## Notes

- Build and test the Windows packages on a Windows runner.
- The current repository does not contain a Windows `.ico` application icon, so electron-builder's default icon is used for the installer/executable until a proper multi-resolution icon is added.
- The workflow runs the TypeScript check before packaging. A pre-existing type-check error will stop the release build and must be fixed first.
- The installer is not code-signed. Windows SmartScreen may display an unknown-publisher warning until a trusted code-signing certificate is configured.
