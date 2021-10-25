import { BrowserWindow } from "electron"

export default (properties: any, fileLoadURL: string, show: boolean) => {
  const browserWindow = new BrowserWindow(properties);
  browserWindow.loadFile(fileLoadURL);
  if (show) {
    browserWindow.on('ready-to-show', () => browserWindow.show());
  }
}