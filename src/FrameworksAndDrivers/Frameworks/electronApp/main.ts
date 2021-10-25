import './initializer/initializer';
import BrowserWindowCreator from './helpers/BrowserWindowCreator';
import { ipcMain } from 'electron';

ipcMain.handle('CreateNewWindow', (event, properties: any, fileLoadURL: string, show: boolean) => {
  properties.show = show;
  BrowserWindowCreator(properties, fileLoadURL, show);
})