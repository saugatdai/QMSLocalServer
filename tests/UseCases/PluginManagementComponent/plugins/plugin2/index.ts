import { plugin2EventHandler1, plugin2EventHandler2 } from './EventHandlers';
import { pipeline1, pipeline2 } from './PipelineExecutors';
import { Plugin } from './Interfaces';

const plugin2: Plugin = {
  eventHandlers: [plugin2EventHandler1, plugin2EventHandler2],
  pipelineExecutors: [pipeline1, pipeline2],
  priority: 1,
};

export default plugin2;