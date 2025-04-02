const { app, BrowserWindow, session } = require('electron');
const path = require('path');

let mainWindow;

app.on('ready', () => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true, // Enable Node.js integration
      contextIsolation: false, // Disable context isolation for development
    },
  });

  if (process.env.NODE_ENV === 'development') {
    // Load React app in development mode
    mainWindow.loadURL('http://localhost:3000');
  } else {
    // Load React app in production mode
    mainWindow.loadURL(`file://${path.join(__dirname, '../build/index.html')}`);
  }

  // Open DevTools for debugging
  mainWindow.webContents.openDevTools();

  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        'Access-Control-Allow-Origin': ['*'],
      },
    });
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});