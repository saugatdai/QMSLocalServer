import TokenCategoryCountStorageImplementation from '../../src/FrameworksAndDrivers/Drivers/TokenCategoryCountStorageImplementation';
import TokenCountStorageImplementation from '../../src/FrameworksAndDrivers/Drivers/TokenCountStorageImplementation';
import TokenCountStorageInteractorImplementation from '../../src/InterfaceAdapters/TokenCountStorageInteractorImplementation';
import TokenCategoryCountStorageInteractorImplementation from '../../src/InterfaceAdapters/TokenCategoryCountStorageInteractorImplementation';
import TokenCountManager from '../../src/UseCases/TokenCountManagementComponent/TokenCountManager';
import TokenCategoryCountMangaer from "../../src/UseCases/TokenCategoryCountManagementComponent/TokenCategoryCountManager";
import { Plugin } from './interfaces';
import { readFile } from "../../src/FrameworksAndDrivers/Frameworks/electronApp/helpers/storageHandler";
import { createNewCategoryTokenBaseObject, createNewNonCategoryTokenBaseObject } from './helpers/helper';
import path from 'path';
import PluginConfigElement from '../../src/UseCases/PluginManagementComponent/PluginModule/PluginConfigElement';

const tokenCutterRunner = async () => {

    const configsJSON = await readFile(path.join(__dirname, './pluginConfig.json'));
    const configs: PluginConfigElement[] = JSON.parse(configsJSON);
    let tokenCountConfig: PluginConfigElement;

    tokenCountConfig = configs.find(config => config.name === "TokenCuttingCount");
    let upperTokenCount: number;

    const value = tokenCountConfig.value;

    if (typeof value === "string") {
        upperTokenCount = parseInt(value);
    }


    console.log('Token Cutting started for Non-Category');

    const tokenCountIntervalVariable = setInterval(async () => {
        const tokenCountStorageInteractorImplementation = new TokenCountStorageInteractorImplementation(TokenCountStorageImplementation);
        const tokenCountManager = new TokenCountManager(tokenCountStorageInteractorImplementation);
        const nonCategoryUpperCount = await tokenCountManager.getLatestCustomerTokenCount();

        if (nonCategoryUpperCount < upperTokenCount) {
            await createNewNonCategoryTokenBaseObject();
        } else {
            clearInterval(tokenCountIntervalVariable);
            console.log(`Token cutter : ${upperTokenCount} non category tokens generated successfully`);
        }
    }, 1000);

    const allCategories = await TokenCategoryCountStorageImplementation.getAllCategories();
    const categoryTimerMaps: { category: string, timerValue: NodeJS.Timer }[] = [];

    allCategories.forEach(categoryObject => {

        console.log(`Token Cutting started for Category ${categoryObject.category}`);

        categoryTimerMaps[categoryObject.category] = setInterval(async () => {
            const tokenCategoryCountStorageInteractorImplementation = new TokenCategoryCountStorageInteractorImplementation(TokenCategoryCountStorageImplementation);
            const tokenCategoryCountManager = new TokenCategoryCountMangaer(tokenCategoryCountStorageInteractorImplementation, categoryObject.category);
            const upperCount = await tokenCategoryCountManager.getLatestCustomerTokenCount();

            if (upperCount < upperTokenCount) {
                await createNewCategoryTokenBaseObject(categoryObject.category);
            } else {
                clearInterval(categoryTimerMaps[categoryObject.category]);
                console.log(`Token cutter : ${upperTokenCount} category : ${categoryObject.category} tokens generated Successfully`);
            }
        }, 1000);
    });
}

tokenCutterRunner().then(() => {
    console.log('Token Cutter plugin started...');
}).catch(error => {
    console.log(error.toString());
});


const plugin: Plugin = {
    eventHandlers: [],
    pipelineExecutors: [],
    priority: 1000,
}

export default plugin;