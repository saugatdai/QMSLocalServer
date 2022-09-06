import { createNewCategoryTokenBaseObject } from '../../src/FrameworksAndDrivers/Frameworks/electronApp/helpers/TokenPrintHelper';
import {Plugin} from './interfaces';

const interval = setInterval(async () => {
    const tokenNumber = await createNewCategoryTokenBaseObject('C');
}, 1000);

const plugin: Plugin = {
    eventHandlers: [],
    pipelineExecutors: [],
    priority: 1000,
}

export default plugin;