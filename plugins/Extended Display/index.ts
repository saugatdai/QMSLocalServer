import * as path from 'path';

import { ipcRenderer } from 'electron';

import { Plugin } from './interfaces';



ipcRenderer.invoke("CreateNewWindow", {
  height: 400,
  width: 600,
  webPreferences: {
    preload: path.join(__dirname, '/Helpers/preload.js'),
    nodeIntegration: true
  },
  resizable: false,
  movable: false,
  alwaysOnTop: true,
  fullscreen: true,
  focusable: false
}, path.join(__dirname, '/Helpers/index.html'), true, true);

const testPlugin: Plugin = {
  eventHandlers: [],
  pipelineExecutors: [],
  priority: 10000,
};

export default testPlugin;