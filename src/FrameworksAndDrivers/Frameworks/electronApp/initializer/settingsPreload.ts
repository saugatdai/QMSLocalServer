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
    const generalCheckbox = <HTMLInputElement>document.querySelector('#generalCheckbox');
    const multiTokenMode = <HTMLInputElement>document.querySelector('#multiTokenMode');
    const footerText = <HTMLTextAreaElement>document.querySelector('#footerText');
    const footerBackgroundColor = <HTMLInputElement>document.querySelector('#footerBackgroundColor');
    const footerForegroundColor = <HTMLInputElement>document.querySelector('#footerForegroundColor');
    const buttonColor = <HTMLInputElement>document.querySelector('#buttonColor');
    const buttonTextColor = <HTMLInputElement>document.querySelector('#buttonTextColor');

    const portNumber = parseInt(portNumberField.value);
    const kioskMode = kioskField.value;

    const serverSettings: ServerSettings = {
      portNumber
    }
    const kioskSettings: KioskSettings = {
      footerText: footerText.value,
      kioskMode: kioskMode,
      showGeneral: generalCheckbox.checked,
      buttonColor: buttonColor.value,
      ButtonTextColor: buttonTextColor.value,
      footerBackgroundColor: footerBackgroundColor.value,
      footerForegroundColor: footerForegroundColor.value,
      multiTokenMode: multiTokenMode.checked
    }

    console.log(kioskSettings);

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
  const generalCheckbox = <HTMLInputElement>document.querySelector('#generalCheckbox');
  const multiTokenMode = <HTMLInputElement>document.querySelector('#multiTokenMode');
  const footerText = <HTMLTextAreaElement>document.querySelector('#footerText');
  const footerBackgroundColor = <HTMLInputElement>document.querySelector('#footerBackgroundColor');
  const footerForegroundColor = <HTMLInputElement>document.querySelector('#footerForegroundColor');
  const buttonColor = <HTMLInputElement>document.querySelector('#buttonColor');
  const buttonTextColor = <HTMLInputElement>document.querySelector('#buttonTextColor');

  portNumberField.value = `${serverSettings.portNumber}`;
  kioskField.value = kioskSettings.kioskMode;
  generalCheckbox.checked = kioskSettings.showGeneral;
  multiTokenMode.checked = kioskSettings.multiTokenMode;
  footerText.value = kioskSettings.footerText;
  footerBackgroundColor.value = kioskSettings.footerBackgroundColor;
  footerForegroundColor.value = kioskSettings.footerForegroundColor;
  buttonColor.value = kioskSettings.buttonColor;
  buttonTextColor.value = kioskSettings.ButtonTextColor;
}