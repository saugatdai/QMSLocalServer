import { Server } from 'http';
import * as path from 'path';
import * as fs from 'fs';

import { ipcRenderer } from 'electron';

import { readFile, ServerSettings } from './helpers/storageHandler';

import AppKernelSingleton from '../../Drivers/AppKernelSingleton';
import expressServer from '../expressServer/server';
import { getIpAddress } from './helpers/network';
import EventManagerSingleton from '../../../UseCases/EventManagementComponent/EventManagerSingleton';
import EventTypes from '../../../UseCases/EventManagementComponent/EventTypes';

let serverStatus: Server;

window.addEventListener('DOMContentLoaded', () => {
  assignEventHandlers();
});

const assignEventHandlers = () => {
  closeButtonEventListener();
  minimizeButtonEventListener();
  serverStartEventListener();
  handleSettingsIconClicked();
}

const closeButtonEventListener = () => {
  document.querySelector("#cross").addEventListener("click", (event) => {
    window.close();
  });
}

const serverStartEventListener = () => {
  document.querySelector("#start").addEventListener("click", async () => {
    if (!serverStatus) {
      serverStatus = expressServer.listen(5000, async () => {
        const pluginPath = path.join(__dirname, '../../../../plugins');
        await AppKernelSingleton.getInstance().initializeCoreCallingActivities(pluginPath);
        setServerStatusText(await getServerParameterString());
        startedButtonSet();
      });
    } else {
      setServerStatusText("Stopped");
      serverStatus.close();
      serverStatus = null;
      stoppedButtonSet();
    }
  });
};

const getServerParameterString = async () => {
  const serverSettingsJSON = await readFile(path.join(__dirname, '../../../../Data/serverSettings.json'));
  const serverSettings: ServerSettings = JSON.parse(serverSettingsJSON);
  const serverURL = getIpAddress();
  const serverString = serverURL + ":" + serverSettings.portNumber;
  return serverString;
}

const setServerStatusText = (text: string) => {
  document.querySelector("#serverStatus").innerHTML = text;
}

const startedButtonSet = () => {
  const buttonElement = document.querySelector("#start");
  buttonElement.classList.add("started");
  buttonElement.innerHTML = "Stop";
}

const minimizeButtonEventListener = () => {
  document.querySelector("#dash").addEventListener('click', () => {
    ipcRenderer.send('minimizeClicked');
  });
}

const stoppedButtonSet = () => {
  const buttonElement = document.querySelector("#start");
  buttonElement.classList.remove("started");
  buttonElement.innerHTML = "Start";
}

const handleSettingsIconClicked = () => {
  document.querySelector("#settings").addEventListener('click', () => {
    ipcRenderer.send('SettingsClicked');
  });
}