import * as path from 'path';

import { ipcRenderer } from 'electron';
import { readFile, writeFile } from '../helpers/storageHandler';

type printSettings = {
    firstLine: string,
    secondLine: string
}

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

        const firstLineText = firstLineElement.value;
        const secondLineText = secondLineElement.value;

        const printSettings: printSettings = {
            firstLine: firstLineText,
            secondLine: secondLineText
        }

        await writeFile(path.join(__dirname, '../../../../../Data/printerSettings.json'), JSON.stringify(printSettings))
        document.querySelector('#message').innerHTML = "Settings updated!!";
    });
}