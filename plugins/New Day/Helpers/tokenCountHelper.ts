import * as util from 'util';
import * as fs from 'fs';
import * as path from 'path';

import PluginConfigElement from '../../../src/UseCases/PluginManagementComponent/PluginModule/PluginConfigElement';
import TokenBaseStorageInteractorImplementation from '../../../src/InterfaceAdapters/TokenBaseStorageInteractorImplementation';
import TokenBaseStorageImplementation from '../../../src/FrameworksAndDrivers/Drivers/TokenBaseStorageImplementation';
import { TokenStatusObject as CategoryTokenStatusObject } from '../../../src/FrameworksAndDrivers/Drivers/TokenCategoryCountStorageImplementation';

type UncategorizedTokenStatusObject = {
    currentTokenCount: number;
    latestCustomerTokenCount: number;
}

const readFile = (filename: string) =>
    util.promisify(fs.readFile)(filename, 'utf-8');
const writeFile = (filename: string, data: string) =>
    util.promisify(fs.writeFile)(filename, data, 'utf-8');

const clearCategoriesCount = async () => {
    const categoriesFilePath = path.join(__dirname, '../../../Data/tokenCategoryCount.json');
    const tokenStatusObjectsJSON = await readFile(categoriesFilePath);

    let tokenStatusObjects: CategoryTokenStatusObject[] = JSON.parse(tokenStatusObjectsJSON);
    tokenStatusObjects = tokenStatusObjects.map(tokenStatusObject => {
        tokenStatusObject.currentTokenCount = 0;
        tokenStatusObject.latestCustomerTokenCount = 0;
        return tokenStatusObject;
    });

    await writeFile(categoriesFilePath, JSON.stringify(tokenStatusObjects));
    console.log('Categories Count set to zero....');
}

const clearUncategorizedCount = async () => {
    const uncategorizedFilePath = path.join(__dirname, '../../../Data/tokenCount.json');
    const uncategorizedTokenStatusObjectsJSON = await readFile(uncategorizedFilePath);
    const uncategorizedTokenStatusObjects: UncategorizedTokenStatusObject = JSON.parse(uncategorizedTokenStatusObjectsJSON);

    uncategorizedTokenStatusObjects.currentTokenCount = 0;
    uncategorizedTokenStatusObjects.latestCustomerTokenCount = 0;

    await writeFile(uncategorizedFilePath, JSON.stringify(uncategorizedTokenStatusObjects));
    console.log('Uncategorized Count Set to zero...');
}

export const clearAction = async () => {
    const configsJSON = await readFile(path.join(__dirname, '../pluginConfig.json'));

    const configs: PluginConfigElement[] = JSON.parse(configsJSON);
    const resetType = configs[0].value;

    const tokenBaseInteractorAdapter = new TokenBaseStorageInteractorImplementation(TokenBaseStorageImplementation);
    const todaysTokenBases = await tokenBaseInteractorAdapter.filterTokenBaseByTokenDate(new Date().toDateString());

    if (todaysTokenBases.length === 0) {
        await clearCategoriesCount();
        await clearUncategorizedCount();

        if(resetType === "Clear"){
            await tokenBaseInteractorAdapter.resetTokenBase();
            console.log('Token Bases cleared.....');
        }
    }
}


