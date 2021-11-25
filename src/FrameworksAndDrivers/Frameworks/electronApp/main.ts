import './initializer/initializer';
import BrowserWindowCreator from './helpers/BrowserWindowCreator';
import { BrowserWindow, ipcMain, screen } from 'electron';

ipcMain.handle('CreateNewWindow', (event, properties: any, fileLoadURL: string, show: boolean, secondaryDisplay?: boolean) => {
  properties.show = show;
  if (secondaryDisplay) {
    const allDisplays = screen.getAllDisplays();
    if (allDisplays.length > 1) {
      const secondaryDisplay = allDisplays.find(display => {
        return display.bounds.x !== 0 || display.bounds.y !== 0;
      });

      properties.x = secondaryDisplay.bounds.x;
      properties.y = secondaryDisplay.bounds.y;
      const { width, height } = secondaryDisplay.workAreaSize;
      properties.height = height;
      properties.width = width;
    }
  }
  BrowserWindowCreator(properties, fileLoadURL, show);
});

ipcMain.handle('sendMessageToRenderer', (e, arg: {fileName: string, message: any}) => {
  const browserWindows = BrowserWindow.getAllWindows();
  const targetWindow = browserWindows.find(browserWindow => browserWindow.webContents.getURL().includes(arg.fileName));
  targetWindow.webContents.send('messageFromMain', arg.message);
});