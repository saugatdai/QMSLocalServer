import * as path from 'path';

import { ipcRenderer } from 'electron';
import { readFile, writeFile } from '../helpers/storageHandler';
import {printSettings} from '../helpers/storageHandler';

document.addEventListener('DOMContentLoaded', async () => {
    fillTextAreas();
    assignCancelButtonEvent();
    assignSaveButtonEvent();
});

const fillTextAreas = async () => {
    const printSettingsJSON = await readFile(path.join(__dirname, '../../../../../Data/printerSettings.json'));
    const printSettings = JSON.parse(printSettingsJSON) as printSettings;

    (<HTMLTextAreaElement>document.querySelector('#firstLine')).value = printSettings.firstLine;
    (<HTMLTextAreaElement>document.querySelector('#secondLine')).value = printSettings.secondLine;
    // @ts-expect-error
    (<HTMLTimeElement>document.querySelector('#printStartTime')).value = printSettings.printStartTime;
    // @ts-expect-error
    (<HTMLTimeElement>document.querySelector('#printStopTime')).value = printSettings.printStopTime;
    (<HTMLInputElement>document.querySelector('#enablePrintTime')).checked = printSettings.enablePrintTime;
    // @ts-expect-error
    (<HTMLTimeElement>document.querySelector('#printHoldTime')).value = printSettings.printHoldTime;
}


const assignCancelButtonEvent = () => {
    document.querySelector('#cancelButton').addEventListener('click', () => {
        ipcRenderer.send('hidePrintSettingsWindow');
    });
}

const assignSaveButtonEvent = () => {
    document.querySelector('#saveButton').addEventListener('click', async () => {
        const firstLineElement = <HTMLTextAreaElement>document.querySelector("#firstLine");
        const secondLineElement = <HTMLTextAreaElement>document.querySelector('#secondLine');
        // @ts-expect-error
        const printStartTime = (<HTMLTimeElement>document.querySelector('#printStartTime')).value;
        // @ts-expect-error
        const printStopTime = (<HTMLTimeElement>document.querySelector('#printStopTime')).value;
        const enablePrintTime = (<HTMLInputElement>document.querySelector('#enablePrintTime')).checked;
        const printHoldTime = parseInt((<HTMLInputElement>document.querySelector('#printHoldTime')).value);

        const firstLineText = firstLineElement.value;
        const secondLineText = secondLineElement.value;

        const printSettings: printSettings = {
            firstLine: firstLineText,
            secondLine: secondLineText,
            enablePrintTime,
            printStartTime,
            printStopTime,
            printHoldTime
        }

        console.log(printSettings);

        await writeFile(path.join(__dirname, '../../../../../Data/printerSettings.json'), JSON.stringify(printSettings))
        document.querySelector('#message').innerHTML = "Settings updated!!";
    });
}