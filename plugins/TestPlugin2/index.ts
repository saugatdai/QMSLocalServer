import { eventHandler1, eventHandler2 } from './EventHandlers';
import { pipeline1, pipeline2 } from './PipelineExecutors';
import { Plugin } from './Interfaces';
import { byPass, callAgain, callNext, forwardToken, randomCall } from './Strategies';

const testPlugin: Plugin = {
  eventHandlers: [eventHandler1, eventHandler2],
  pipelineExecutors: [pipeline1, pipeline2],
  priority: 1,
  // callAgainStrategy: callAgain,
  // bypassStrategy: byPass,
  // nextTokenStrategy: callNext,
  // randomCallStrategy: randomCall,
  // tokenForwardStrategy: forwardToken
};

export default testPlugin;