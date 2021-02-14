import { PipelineExecutor } from './Interfaces';
import { Feature } from './Interfaces';

const pipeline1Feature1: Feature = {
  runFeature() {
    console.log('Running Piepline1Feature1');
  },
};

const pipeline1Feature2: Feature = {
  runFeature() {
    console.log('RUnning Pipeline1Feature2');
  },
};

const pipeline2Feature1: Feature = {
  runFeature() {
    console.log('Running Pipeline2Feature1');
  },
};

const pipeline2Feature2: Feature = {
  runFeature() {
    console.log('Running pipeline2Feature2');
  },
};

export const Pipeline1: PipelineExecutor = {
  features: [pipeline1Feature1, pipeline1Feature2],
  pipelineType: 'CallAgainToken',
};

export const Pipeline2: PipelineExecutor = {
  features: [pipeline2Feature1, pipeline2Feature2],
  pipelineType: 'CallNextToken',
};
