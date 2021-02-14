import EventHandler from './EventHandler';
import PipelineExecutor from './PipelineExecutor';

export default interface Plugin {
  eventHandlers: EventHandler[];
  pipelineExecutors: PipelineExecutor[];
  priority: number;
}
