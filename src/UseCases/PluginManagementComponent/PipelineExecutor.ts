import Feature from '../TokenCallingComponent/Feature';
import PipelineTypes from './PipelineTypes';

export default interface PipelineExecutor {
  features: Feature[];
  pipelineType: PipelineTypes;
  addFeature: (feature: Feature) => void;
}
