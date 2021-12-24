import * as path from 'path';
import { ipcRenderer } from 'electron';
import { readFile, writeFile, ServerSettings, KioskSettings } from '../helpers/storageHandler';

document.addEventListener('DOMContentLoaded', () => {
  initializeEventHandlers();
  loadInitialValue();
});

const initializeEventHandlers = () => {
  document.querySelector("#settingsForm").addEventListener('submit', submitButtonHandler);
  document.querySelector("#cancelButton").addEventListener('click', cancelButtonHandler);
}

const submitButtonHandler = async (event: Event) => {
  event.preventDefault();
  if (validatePortNumber()) {
    const portNumberField = <HTMLInputElement>document.querySelector('#portNumber');
    const kioskField = <HTMLSelectElement>document.querySelector('#kioskMode');

    const portNumber = parseInt(portNumberField.value);
    const kioskMode = kioskField.value;
    
    const serverSettings: ServerSettings = {
      portNumber
    }
    const kioskSettings: KioskSettings = {
      kioskMode: kioskMode
    }

    await writeFile(path.join(__dirname, '../../../../../Data/serverSettings.json'), JSON.stringify(serverSettings));
    await writeFile(path.join(__dirname, '../../../../../Data/kioskSettings.json'), JSON.stringify(kioskSettings));
    
    
    ipcRenderer.send('hideSettingsWindow');
  }
}

const validatePortNumber = () => {
  const portNumberField = <HTMLInputElement>document.querySelector("#portNumber");
  const portNumber = <string>portNumberField.value;
  if (portNumber.length === 0) {
    setMessage("Invalid Port Number");
    return false;
  }
  setMessage("");
  return true;
}

const setMessage = (message: string) => {
  document.querySelector("#message").innerHTML = message;
}

const cancelButtonHandler = () => {
  ipcRenderer.send('hideSettingsWindow');
}

const loadInitialValue = async () => {
  const serverSettingsJson = await readFile(path.join(__dirname, '../../../../../Data/serverSettings.json'));
  const kioskSettingsJson = await readFile(path.join(__dirname, '../../../../../Data/kioskSettings.json'));

  const serverSettings: ServerSettings = JSON.parse(serverSettingsJson) as ServerSettings;
  const kioskSettings: KioskSettings = JSON.parse(kioskSettingsJson) as KioskSettings;

  const portNumberField = <HTMLInputElement>document.querySelector('#portNumber');
  const kioskField = <HTMLInputElement>document.querySelector('#kioskMode');

  portNumberField.value = `${serverSettings.portNumber}`;
  kioskField.value = kioskSettings.kioskMode;
}