import * as path from 'path';

import { ipcRenderer } from "electron";
import { readFile } from "../helpers/storageHandler";
import { createNewCategoryTokenBaseObject, createNewNonCategoryTokenBaseObject } from '../../expressServer/Helpers/tokenBaseRouteHelper';
import { printSettings as PrintSettings } from '../helpers/storageHandler';


ipcRenderer.on('tokenNumber', async (e: Event, tokenCategory) => {
    let token: string;

    if (tokenCategory.length) {
        const tokenBaseObject = await createNewCategoryTokenBaseObject(tokenCategory);
        token = `${tokenBaseObject.token.tokenCategory}${tokenBaseObject.token.tokenNumber}`;
    } else {
        const tokenBaseObject = await createNewNonCategoryTokenBaseObject();
        token = `${tokenBaseObject.token.tokenNumber}`;
    }

    const printSettingsJSON = await readFile(path.join(__dirname, '../../../../../Data/printerSettings.json'));

    const printSettings = JSON.parse(printSettingsJSON) as PrintSettings;
    const firstLine = printSettings.firstLine;
    const secondLine = printSettings.secondLine;


    document.querySelector("#firstLine").innerHTML = firstLine;
    document.querySelector("#secondLine").innerHTML = secondLine;
    document.querySelector('#time').innerHTML = new Date().toLocaleString();
    document.querySelector('#large').innerHTML = token;

    ipcRenderer.send('startPrinting', token);
});

// TODO MultitokenModeprinting Check
ipcRenderer.on('multiTokenNumber', async (e: Event, selectedCategories: string[]) => {

    let tokenString = '';

    const sequentialPromiseResolver = async (index: number) => {
        try {
            if (index < selectedCategories.length) {
                const tokenBase = await createNewCategoryTokenBaseObject(selectedCategories[index]);
                tokenString += tokenBase.token.tokenCategory + tokenBase.token.tokenNumber + ' ';
                await sequentialPromiseResolver(++index);
            } else {
                const printSettingsJSON = await readFile(path.join(__dirname, '../../../../../Data/printerSettings.json'));

                const printSettings = JSON.parse(printSettingsJSON) as PrintSettings;
                const firstLine = printSettings.firstLine;
                const secondLine = printSettings.secondLine;

                document.querySelector("#firstLine").innerHTML = firstLine;
                document.querySelector("#secondLine").innerHTML = secondLine;
                document.querySelector('#time').innerHTML = new Date().toLocaleString();
                document.querySelector('#large').innerHTML = tokenString;

                ipcRenderer.send('startPrinting', tokenString);
            }
        } catch (error) {
            ipcRenderer.send('showNotification', error.toString());
        }

    }
    
    await sequentialPromiseResolver(0);

});