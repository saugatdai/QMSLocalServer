import * as path from 'path';

import { ipcRenderer } from 'electron';

import { Plugin } from './interfaces';

import { callNextDisplayPipeline, tokenForwardPipeline, randomCallPipeline, bypassPipeline, callAgainDisplayPipeline } from './PipelineExecutors';


ipcRenderer.invoke("CreateNewWindow", {
  height: 400,
  width: 600,
  webPreferences: {
    preload: path.join(__dirname, './Helpers/preload.js'),
    nodeIntegration: true
  },
  resizable: false,
  movable: false,
  alwaysOnTop: true,
  fullscreen: true,
  focusable: false
}, path.join(__dirname, './Helpers/display.html'), true, true);

const ExtendedDisplayPlugin: Plugin = {
  eventHandlers: [],
  pipelineExecutors: [callNextDisplayPipeline, tokenForwardPipeline, randomCallPipeline, bypassPipeline, callAgainDisplayPipeline],
  priority: 10000,
};

export default ExtendedDisplayPlugin;