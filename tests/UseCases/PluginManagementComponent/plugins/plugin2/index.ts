import { plugin2EventHandler1, plugin2EventHandler2 } from './EventHandlers';
import { Pipeline1, Pipeline2 } from './PipelineExecutors';
import { Plugin } from './Interfaces';

const plugin2: Plugin = {
  EventHandlers: [plugin2EventHandler1, plugin2EventHandler2],
  pipelineExecutors: [Pipeline1, Pipeline2],
  priority: 1,
};

export default plugin2;
