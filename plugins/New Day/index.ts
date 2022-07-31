import { Plugin } from "./interfaces";

import { clearAction } from './Helpers/tokenCountHelper';

clearAction();

const NewDayPlugin: Plugin = {
    eventHandlers: [],
    pipelineExecutors: [],
    priority: 1000,
}

export default NewDayPlugin;