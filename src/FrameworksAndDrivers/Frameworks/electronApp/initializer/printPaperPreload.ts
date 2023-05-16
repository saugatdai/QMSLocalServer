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
    console.log('Selected Categories : ');
    console.log(selectedCategories);
    try {
        const tokenPromises = selectedCategories.map(selectedCategory => createNewCategoryTokenBaseObject(selectedCategory));
        const allTokenBases = await Promise.all(tokenPromises);
        const token = allTokenBases.reduce((acc, element) => acc + element.token.tokenCategory + element.token.tokenNumber + ' ', '');

        const printSettingsJSON = await readFile(path.join(__dirname, '../../../../../Data/printerSettings.json'));

        const printSettings = JSON.parse(printSettingsJSON) as PrintSettings;
        const firstLine = printSettings.firstLine;
        const secondLine = printSettings.secondLine;

        document.querySelector("#firstLine").innerHTML = firstLine;
        document.querySelector("#secondLine").innerHTML = secondLine;
        document.querySelector('#time').innerHTML = new Date().toLocaleString();
        document.querySelector('#large').innerHTML = token;

        ipcRenderer.send('startPrinting', token);
    }catch(error){
        ipcRenderer.send('showNotification', error.toString());
    }
});