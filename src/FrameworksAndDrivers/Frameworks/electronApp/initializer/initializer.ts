import { app, BrowserWindow, Tray, nativeImage, ipcMain, globalShortcut, Notification, screen } from 'electron';
import * as path from 'path';
import { KioskSettings, readFile } from '../helpers/storageHandler';

let tray: Tray;
let mainWindow: BrowserWindow;
let settingsWindow: BrowserWindow;
let kioskSettingsWindow: BrowserWindow;
let printSettingsWindow: BrowserWindow;
let printPaper: BrowserWindow;

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
  mainWindow.on("ready-to-show", async () => {
    if (!kioskSettingsWindow) {
      const kioskSettingsJson = await readFile(path.join(__dirname, '../../../../../Data/kioskSettings.json'));
      const kioskSettings: KioskSettings = JSON.parse(kioskSettingsJson) as KioskSettings;
      if (kioskSettings.kioskMode === "auto") {
        showKioskWindow();
      }
    }
    mainWindow.show();
  });
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
  });

  globalShortcut.register('CommandOrControl+k', () => {
    processKioskShortcut();
  });

});

const processKioskShortcut = async () => {
  if (!kioskSettingsWindow) {
    const kioskSettingsJson = await readFile(path.join(__dirname, '../../../../../Data/kioskSettings.json'));
    const kioskSettings: KioskSettings = JSON.parse(kioskSettingsJson) as KioskSettings;
    if (kioskSettings.kioskMode === "manual") {
      showKioskWindow();
    } else {
      new Notification({ title: 'Error', body: "Please Select Kiosk Mode to manual for using shortcut" }).show();
    }
  }
}

const showKioskWindow = () => {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;
  kioskSettingsWindow = new BrowserWindow({
    height,
    width,
    fullscreen: true,
    kiosk: true,
    show: false,
    alwaysOnTop: true,
    resizable: false,
    frame: false,
    webPreferences: {
      preload: path.join(__dirname, 'kioskPreload.js')
    }
  });
  kioskSettingsWindow.loadFile('./views/kiosk.html');
  kioskSettingsWindow.on('ready-to-show', () => {
    kioskSettingsWindow.maximize();
    kioskSettingsWindow.show();
    globalShortcut.register('CommandOrControl+d', () => {
      if (kioskSettingsWindow) {
        kioskSettingsWindow.webContents.send('stopServer');
        kioskSettingsWindow.close();
        kioskSettingsWindow = null;
      }
    });
  });
}

ipcMain.on('minimizeClicked', () => {
  mainWindow.hide();
});

ipcMain.on('SettingsClicked', () => {
  settingsWindow = new BrowserWindow({
    height: 210,
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

ipcMain.on('printSettingsIconClicked', () => {
  printSettingsWindow = new BrowserWindow({
    height: 400,
    width: 200,
    show: false,
    maximizable: false,
    webPreferences: {
      preload: path.join(__dirname, 'printSettingsPreload.js')
    },
    resizable: false,
    frame: false,
    modal: true,
    parent: mainWindow,
    backgroundColor: '#001a33'
  });
  printSettingsWindow.loadFile('./views/printSettings.html');
  printSettingsWindow.on('ready-to-show', () => printSettingsWindow.show());
});

ipcMain.on('hidePrintSettingsWindow', () => {
  printSettingsWindow.close();
  printSettingsWindow = null;
});

ipcMain.on('beginTokenPrint', async (event: Event, tokenCategory) => {
  printPaper = new BrowserWindow({
    height: 250,
    width: 250,
    show: false,
    maximizable: false,
    webPreferences: {
      preload: path.join(__dirname, 'printPaperPreload.js')
    },
    resizable: false,
    frame: true,
    focusable: true
  });
  printPaper.loadFile('./views/printPaper.html');
  printPaper.webContents.on('did-finish-load', () => {
    printPaper.webContents.send('tokenNumber', tokenCategory);
  })
});

ipcMain.on('startPrinting', (e: Event, tokenString) => {
  console.log('Starting to print...');
  printPaper.webContents.print({
    silent: true,
    printBackground: true,
    copies: 1,
    pageSize: {
      height: 1000,
      width: 1000
    }
  }, (success, error) => {
    if (success) {
      console.log(`${tokenString} Printed`);
    } else {
      console.log(error);
    }

    printPaper.close();
    printPaper = null;

  });
});

app.on('window-all-closed', () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

ipcMain.on('showNotification', (e: Event, message) => {
  new Notification({ title: 'Message', body: `${message}` }).show();
})

export default mainWindow;