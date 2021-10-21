import PipelineExecutor from '../../src/UseCases/PluginManagementComponent/PluginModule/PipelineExecutor';
import PipelineTypes from '../../src/UseCases/PluginManagementComponent/PluginModule/PipelineTypes';
import Feature from '../../src/UseCases/TokenCallingComponent/Feature';
import TokenCallingState from '../../src/UseCases/TokenCallingComponent/TokenCallingState';
import { audioRinger } from './Helpers/audioRinger';


const audioRing: Feature = {
  runFeature(tokenCallingState: TokenCallingState) {
    audioRinger(tokenCallingState);
  },
  goToNextFeature: true
};

class PipelineExecutorClass implements PipelineExecutor {
  public features: Feature[] = [];
  public pipelineType: PipelineTypes;
  constructor(pipelineType: PipelineTypes) {
    this.pipelineType = pipelineType;
  }

  public addFeature(feature: Feature): void {
    this.features.push(feature);
  }
}

const callNextAudioPipeline = new PipelineExecutorClass(PipelineTypes.CALL_NEXT_TOKEN);

callNextAudioPipeline.addFeature(audioRing);

export { callNextAudioPipeline };