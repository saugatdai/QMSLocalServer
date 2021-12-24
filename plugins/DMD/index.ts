import './Helpers/mqttInit';
import { Plugin } from './interfaces';
import * as PipelineExecutors from './PipelineExecutors';
const DMDPlugin: Plugin = {
  eventHandlers: [],
  pipelineExecutors: [PipelineExecutors.bypassDmdPipeline, PipelineExecutors.callAgainDmdPipeline,
                      PipelineExecutors.callNextDmdPipeline, PipelineExecutors.randomCallDmdPipeline, 
                      PipelineExecutors.tokenForwardDmdPipeline],
  priority: 10000
}

export default DMDPlugin;