import { Plugin } from './interfaces';
import { callNextAudioPipeline } from './PipelineExecutors';

const testPlugin: Plugin = {
  eventHandlers: [],
  pipelineExecutors: [callNextAudioPipeline],
  priority: 1,
};

export default testPlugin;