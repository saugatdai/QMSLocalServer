import EventHandler from './EventHandler';
import PipelineExecutor from './PipelineExecutor';
import PluginInfo from '../PluginInfo';

export default interface Plugin {
  eventHandlers: EventHandler[];
  pipelineExecutors: PipelineExecutor[];
  priority: number;
  pluginInfo: PluginInfo;
}
