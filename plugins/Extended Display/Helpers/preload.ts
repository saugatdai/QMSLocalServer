import * as fs from 'fs';
import * as util from 'util';
import * as path from 'path';

import { ipcRenderer } from "electron";

const readFile = util.promisify(fs.readFile);
export interface RowInfo {
    tokenNo: string,
    counter: string
}

export const updateScreen = (rowInfo: RowInfo) => {
    ipcRenderer.invoke('sendMessageToRenderer', { fileName: 'display.html', message: rowInfo });
}

ipcRenderer.on('messageFromMain', async (e, message) => {
    if (document.querySelector('#main').children.length < 4) {
        const displayElement = await getDisplayElement(message);
        document.querySelector('#main').appendChild(displayElement);
    } else {
        const displayElement = await getDisplayElement(message);
        const main = document.querySelector('#main');
        const children = main.children;
        main.removeChild(children[0]);
        main.appendChild(displayElement);
    }
});

const getDisplayElement = async (rowInfo: RowInfo) => {
    const article = document.createElement('section');

    const tokenHolder = document.createElement('div');
    tokenHolder.setAttribute('class','token')
    const tokenNo = document.createTextNode(rowInfo.tokenNo);
    tokenHolder.appendChild(tokenNo);

    const configJSON = await readFile(path.join(__dirname, '../pluginConfig.json'), "binary");
    const config = JSON.parse(configJSON);

    const counterHolder = document.createElement('div');
    counterHolder.setAttribute('class','counter')
    const counterText = document.createTextNode(`${config[0].value}: ${rowInfo.counter}`);

    counterHolder.appendChild(counterText);

    article.appendChild(tokenHolder);
    article.appendChild(counterHolder);

    return article;
}
