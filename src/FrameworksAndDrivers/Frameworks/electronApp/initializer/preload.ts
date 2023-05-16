import { Server } from 'http';
import * as path from 'path';

import { ipcRenderer } from 'electron';
import { PrismaClient } from '@prisma/client';

import { readFile, ServerSettings } from '../helpers/storageHandler';

import AppKernelSingleton from '../../../Drivers/AppKernelSingleton';
import expressServer from '../../expressServer/server';
import { getIpAddress } from '../helpers/network';

let serverStatus: Server;

const prisma = new PrismaClient();


// The general category create if not exists must run only once not repeatedly 
// only at the beginning during the software runtime. Therefore this is placed here
const createGeneralCategoryIfNotExists = async () => {
  const generalCategory = await prisma.tokenCategoryCount.findFirst({
    where : {
      category: '!'
    }
  });

  if(!generalCategory){
    console.log('General Category Does not exists..');
    await prisma.tokenCategoryCount.create({
      data: {
        categoryName: 'General',
        currentTokenCount: 0,
        latestCustomerTokenCount: 0,
        category: '!'
      }
    });
  }

}

createGeneralCategoryIfNotExists().then(() => {
  console.log('General Category Created...');
}).catch((error) => {
  console.log('Can not create the category');
  console.log(error.toString());
});

  window.addEventListener('DOMContentLoaded', () => {
    assignEventHandlers();
  });

const assignEventHandlers = () => {
  closeButtonEventListener();
  minimizeButtonEventListener();
  serverStartEventListener();
  handleSettingsIconClicked();
  handlePrintSettingsIconClicked();
}

const closeButtonEventListener = () => {
  document.querySelector("#cross").addEventListener("click", (event) => {
    window.close();
  });
}

const serverStartEventListener = () => {
  document.querySelector("#start").addEventListener("click", async () => {
    if (!serverStatus) {
      const serverSettingsJSON = await readFile(path.join(__dirname, '../../../../../Data/serverSettings.json'));
      const serverSettings: ServerSettings = JSON.parse(serverSettingsJSON);
      serverStatus = expressServer.listen(serverSettings.portNumber, async () => {
        const pluginPath = path.join(__dirname, '../../../../../plugins');
        await AppKernelSingleton.getInstance().initializeCoreCallingActivities(pluginPath);
        setServerStatusText(await getServerParameterString());
        startedButtonSet();
      });
    } else {
      setServerStatusText("Stopped");
      serverStatus.close();
      serverStatus = null;
      stoppedButtonSet();
      ipcRenderer.send("ServerStop");
    }
  });
};

const getServerParameterString = async () => {
  const serverSettingsJSON = await readFile(path.join(__dirname, '../../../../../Data/serverSettings.json'));
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

const handlePrintSettingsIconClicked = () => {
  document.querySelector('#printSettings').addEventListener('click', () => {
    ipcRenderer.send('printSettingsIconClicked');
  });
}