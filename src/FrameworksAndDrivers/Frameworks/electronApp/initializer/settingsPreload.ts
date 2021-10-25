import * as path from 'path';
import { ipcRenderer } from 'electron';
import { readFile, writeFile, ServerSettings } from '../helpers/storageHandler';

document.addEventListener('DOMContentLoaded', () => {
  initializeEventHandlers();
  loadInitialValue();
});

const initializeEventHandlers = () => {
  document.querySelector("#settingsForm").addEventListener('submit', submitButtonHandler);
  document.querySelector("#cancelButton").addEventListener('click', cancelButtonHandler);
}

const submitButtonHandler = (event: Event) => {
  event.preventDefault();
  if (validatePortNumber()) {
    const portNumberField = <HTMLInputElement>document.querySelector('#portNumber');
    const portNumber = parseInt(portNumberField.value);
    const serverSettings: ServerSettings = {
      portNumber
    }
    writeFile(path.join(__dirname, '../../../../../Data/serverSettings.json'), JSON.stringify(serverSettings));
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
  const serverSettings: ServerSettings = JSON.parse(serverSettingsJson) as ServerSettings;
  const portNumberField = <HTMLInputElement>document.querySelector('#portNumber');
  portNumberField.value = `${serverSettings.portNumber}`;
}