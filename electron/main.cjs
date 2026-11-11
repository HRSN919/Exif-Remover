/**
 * ByHRSN Exif Cleaner v2.5
 * Electron Main Process for Windows Native Application
 * https://byhrsn.com
 */

const { app, BrowserWindow, shell, Menu } = require('electron');
const path = require('path');

// Disable hardware acceleration issues on older GPUs if any
app.commandLine.appendSwitch('disable-color-correct-rendering');

let mainWindow = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1240,
    height: 820,
    minWidth: 920,
    minHeight: 640,
    backgroundColor: '#020617', // Slate 950 Windows background
    show: false,
    autoHideMenuBar: true,
    title: 'ByHRSN Exif Cleaner v2.5 - Windows Privacy App',
    icon: path.join(__dirname, '../public/favicon.ico'),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true,
      webSecurity: true,
    },
  });

  // Remove default menu bar for clean Windows 11 desktop feel
  Menu.setApplicationMenu(null);

  // Load the production build
  const indexPath = path.join(__dirname, '../dist/index.html');
  mainWindow.loadFile(indexPath);

  // Show window smoothly once ready
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // Open external links (e.g. byhrsn.com, Google Maps) in user's default browser
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https:') || url.startsWith('http:')) {
      shell.openExternal(url);
    }
    return { action: 'deny' };
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// App lifecycle
app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
