import { app, BrowserWindow, Tray, nativeImage, ipcMain } from 'electron';
import * as path from 'path';

let tray: Tray;
let mainWindow: BrowserWindow;
let settingsWindow: BrowserWindow;

const createWindow = () => {
  mainWindow = new BrowserWindow({
    height: 300,
    width: 200,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    },
    show: false,
    maximizable: false,
    resizable: false,
    frame: false,
    icon: path.join(__dirname, '../../../../../../views/icons/ShivolatechLogo.png')
  });
  mainWindow.loadFile('./views/index.html');
  mainWindow.on("ready-to-show", () => mainWindow.show());
  mainWindow.on('closed', () => {
    const allBrowserWindows = BrowserWindow.getAllWindows();
    allBrowserWindows.forEach(borwserWindow => {
      borwserWindow.close();
    })
  });
}

app.whenReady().then(() => {
  const iconPath = path.join(__dirname, '../../../../../../views/icons/stechLogo@2x.png');
  const icon = nativeImage.createFromPath(iconPath);
  createWindow();
  tray = new Tray(icon);
  tray.setToolTip("Shivolatech Queue");
  tray.addListener("click", () => {
    mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show();
  });
  tray.setTitle("ST");
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  })
});

ipcMain.on('minimizeClicked', () => {
  mainWindow.hide();
});

ipcMain.on('SettingsClicked', () => {
  settingsWindow = new BrowserWindow({
    height: 110,
    width: 200,
    show: false,
    maximizable: false,
    webPreferences: {
      preload: path.join(__dirname, 'settingsPreload.js')
    },
    resizable: false,
    frame: false,
    modal: true,
    parent: mainWindow,
    backgroundColor: "#001a33"
  });
  settingsWindow.loadFile('./views/settings.html');
  settingsWindow.on('ready-to-show', () => settingsWindow.show());
});

ipcMain.on('hideSettingsWindow', () => {
  settingsWindow.close();
  settingsWindow = null;
});

app.on('window-all-closed', () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

export default mainWindow;