import * as path from 'path';

import { ipcRenderer } from "electron";
import { readFile } from "../helpers/storageHandler";
import { createNewCategoryTokenBaseObject, createNewNonCategoryTokenBaseObject } from '../../expressServer/Helpers/tokenBaseRouteHelper';

type PrintSettings = {
    firstLine: string,
    secondLine: string
}

ipcRenderer.on('tokenNumber', async (e: Event, tokenCategory) =>{
    let token:string;

    if(tokenCategory.length) {
        const tokenBaseObject = await createNewCategoryTokenBaseObject(tokenCategory);
        token = `${tokenBaseObject.token.tokenCategory}${tokenBaseObject.token.tokenNumber}`;
    }else {
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