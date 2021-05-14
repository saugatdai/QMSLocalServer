import { preCallEventHandler, postCallEventHandler } from './EventHandlers';
import { pipelineExecutorPlugin4 } from './PipelineExecutors';
import { callNext } from './Strategies';

export default {
  eventHandlers: [preCallEventHandler, postCallEventHandler],
  pipelineExecutors: [pipelineExecutorPlugin4],
  priority: 8,
  nextTokenStrategy: callNext
}
