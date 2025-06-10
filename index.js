// electron app entry point
const { app, BrowserWindow } = require('electron');
const path = require('path');
function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1000,
    height: 800,
    icon: path.join(__dirname, 'src/icons/icon.ico'),
    title: 'BlackList Manager',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  mainWindow.menuBarVisible = false;
  mainWindow.resizable = false;

  mainWindow.loadFile('index.html');

  // mainWindow.webContents.openDevTools();
}
app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
