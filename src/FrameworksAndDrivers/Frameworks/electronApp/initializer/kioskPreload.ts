import { Server } from 'http';
import { ipcRenderer } from 'electron';

import TokenCategoryCountStorageImplementation from '../../../Drivers/TokenCategoryCountStorageImplementation';
import AppKernelSingleton from '../../../Drivers/AppKernelSingleton';
import expressServer from '../../expressServer/server';
import { readFile, ServerSettings } from '../helpers/storageHandler';
import path from 'path';


let serverStatus: Server;

ipcRenderer.on('stopServer', ()=> {
    serverStatus.close();
    serverStatus = null;
    ipcRenderer.send('showNotification', 'Server stopped...');
});

document.addEventListener('DOMContentLoaded', async () => {

    const serverSettingsJSON = await readFile(path.join(__dirname, '../../../../../Data/serverSettings.json'));
    const serverSettings: ServerSettings = JSON.parse(serverSettingsJSON);
    serverStatus = expressServer.listen(serverSettings.portNumber, async () => {
        const pluginPath = path.join(__dirname, '../../../../../plugins');
        await AppKernelSingleton.getInstance().initializeCoreCallingActivities(pluginPath);
        ipcRenderer.send('showNotification', `Server Started at port : ${serverSettings.portNumber}`);
    });

    createButton('General');
    const allCategories = await TokenCategoryCountStorageImplementation.getAllCategories();
    allCategories.forEach(category => {
        const symbol = category.category;
        const name = category.categoryName;

        createButton(`${name}(${symbol})`);
    })
});


const createButton = (buttonContent: string) => {
    const main = document.querySelector("#main");
    const holder = document.createElement('section');
    const text = document.createTextNode(buttonContent);
    let tokenCategory: string = '';
    holder.appendChild(text);
    holder.addEventListener('click', async () => {
        if (buttonContent.indexOf('(') > 0) {
            tokenCategory = buttonContent.charAt(buttonContent.indexOf('(') + 1);
        }
        await printToken(tokenCategory);
    })
    main.appendChild(holder);
}

const printToken = async (tokenCategory: string) => {
    ipcRenderer.send('beginTokenPrint', tokenCategory);
}