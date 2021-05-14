import EventHandler from './EventHandler';
import PipelineExecutor from './PipelineExecutor';
import PluginInfo from '../PluginInfo';
import CallAgainStrategy from '../../TokenCallingComponent/CallAgainModule/CallAgainStrategy';
import BypassTokenStrategy from '../../TokenCallingComponent/BypassTokenModule/BypassTokenStrategy';
import NextTokenStrategy from '../../TokenCallingComponent/NextTokenModule/NextTokenStrategy';
import RandomTokenCallStrategy from '../../TokenCallingComponent/RandomTokenCallModule/RandomTokenCallStrategy';
import TokenForwardStrategy from '../../TokenCallingComponent/TokenForwardModule/TokenForwardStrategy';

export default interface Plugin {
  eventHandlers?: EventHandler[];
  pipelineExecutors?: PipelineExecutor[];
  priority: number;
  pluginInfo: PluginInfo;
  callAgainStrategy?: CallAgainStrategy;
  bypassStrategy?: BypassTokenStrategy;
  nextTokenStrategy?: NextTokenStrategy;
  randomCallStrategy?: RandomTokenCallStrategy;
  tokenForwardStrategy?: TokenForwardStrategy;
}