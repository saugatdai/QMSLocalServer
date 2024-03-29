import { Server } from 'http';
import { ipcRenderer } from 'electron';

import TokenCategoryCountStorageImplementation from '../../../Drivers/TokenCategoryCountStorageImplementation';
import AppKernelSingleton from '../../../Drivers/AppKernelSingleton';
import expressServer from '../../expressServer/server';
import { KioskSettings, printSettings, readFile, ServerSettings } from '../helpers/storageHandler';
import path from 'path';


let serverStatus: Server;
let printSettings: printSettings;

ipcRenderer.on('stopServer', () => {
    serverStatus.close();
    serverStatus = null;
    ipcRenderer.send('showNotification', 'Server stopped...');
});

document.addEventListener('DOMContentLoaded', async () => {

    const serverSettingsJSON = await readFile(path.join(__dirname, '../../../../../Data/serverSettings.json'));
    const kioskSettingsJson = await readFile(path.join(__dirname, '../../../../../Data/kioskSettings.json'));
    const printSettingsJSON = await readFile(path.join(__dirname, '../../../../../Data/printerSettings.json'));

    const kioskSettings: KioskSettings = JSON.parse(kioskSettingsJson);
    const serverSettings: ServerSettings = JSON.parse(serverSettingsJSON);
    printSettings = JSON.parse(printSettingsJSON);

    serverStatus = expressServer.listen(serverSettings.portNumber, async () => {
        const pluginPath = path.join(__dirname, '../../../../../plugins');
        await AppKernelSingleton.getInstance().initializeCoreCallingActivities(pluginPath);
        ipcRenderer.send('showNotification', `Server Started at port : ${serverSettings.portNumber}`);
    });

    if (kioskSettings.showGeneral) {
        createButton('Token');
    }

    const allCategories = await TokenCategoryCountStorageImplementation.getAllCategories();
    allCategories.forEach(category => {
        const symbol = category.category;
        const name = category.categoryName;

        createButton(`${name}(${symbol})`);
    });

    const footerText = <HTMLElement>document.querySelector('#footerTxt');
    const footer = <HTMLElement>document.querySelector('#footer');

    footerText.innerHTML = kioskSettings.footerText;
    footer.style.backgroundColor = kioskSettings.footerBackgroundColor;
    footer.style.color = kioskSettings.footerForegroundColor;
});


const createButton = async (buttonContent: string) => {
    const kioskSettingsJson = await readFile(path.join(__dirname, '../../../../../Data/kioskSettings.json'));
    const kioskSettings: KioskSettings = JSON.parse(kioskSettingsJson);

    const main = document.querySelector("#main");
    const holder = document.createElement('section');
    holder.style.backgroundColor = kioskSettings.buttonColor;
    holder.style.color = kioskSettings.ButtonTextColor;
    const text = document.createTextNode(buttonContent);
    let tokenCategory: string = '';
    holder.appendChild(text);
    holder.addEventListener('click', async (event: MouseEvent) => {

        const startHour = parseInt(printSettings.printStartTime.substring(0, 2));
        const startMinute = parseInt(printSettings.printStartTime.substring(3));
        const startTimeStamp = new Date();
        startTimeStamp.setHours(startHour);
        startTimeStamp.setMinutes(startMinute);
        startTimeStamp.setSeconds(0);

        const endHour = parseInt(printSettings.printStopTime.substring(0, 2));
        const endMinute = parseInt(printSettings.printStopTime.substring(3));
        const endTimeStamp = new Date();
        endTimeStamp.setHours(endHour);
        endTimeStamp.setMinutes(endMinute);
        endTimeStamp.setSeconds(0);

        const eventElement = <HTMLElement>event.currentTarget;
        const originalText: string = eventElement.innerHTML;

        const changeTextAndEnable = (text: string) => {
            eventElement.innerHTML = text;
            eventElement.style.pointerEvents = "auto";
            document.querySelectorAll("section").forEach(section => {
                section.style.pointerEvents = "auto";
            })
        }

        const printFunction = async () => {
            eventElement.innerHTML = "Printing";
            eventElement.style.pointerEvents = "none";
            document.querySelectorAll('section').forEach(section => {
                section.style.pointerEvents = "none";
            });

            setTimeout(() => {
                changeTextAndEnable(originalText);
            }, printSettings.printHoldTime)


            if (buttonContent.indexOf('(') > 0) {
                tokenCategory = buttonContent.charAt(buttonContent.indexOf('(') + 1);
            }
            await printToken(tokenCategory);
        }

        if (printSettings.enablePrintTime) {

            const currentDate = new Date();
            const currentTimeStamp = currentDate.getTime();
            const canPrint: boolean = (currentTimeStamp > startTimeStamp.getTime()) &&
                (currentTimeStamp < endTimeStamp.getTime());

            if (canPrint) {
                printFunction();
            } else {
                eventElement.innerHTML = 'No-Print Time';
                setTimeout(() => {
                    changeTextAndEnable(originalText);
                }, 2000)
            }
        }else{
            printFunction();
        }


    })
    main.appendChild(holder);
}

const printToken = async (tokenCategory: string) => {
    ipcRenderer.send('beginTokenPrint', tokenCategory);
}