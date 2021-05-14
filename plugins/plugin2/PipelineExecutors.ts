import { PipelineExecutor } from './Interfaces';
import { Feature } from './Interfaces';

const pipeline1Feature1: Feature = {
  runFeature() {
    console.log('Running Piepline1Feature1');
  },
  goToNextFeature: true
};

const pipeline1Feature2: Feature = {
  runFeature() {
    console.log('RUnning Pipeline1Feature2');
  },
  goToNextFeature: true
};

const pipeline2Feature1: Feature = {
  runFeature() {
    console.log('Running Pipeline2Feature1');
  },
  goToNextFeature: true
};

const pipeline2Feature2: Feature = {
  runFeature() {
    console.log('Running pipeline2Feature2');
  },
  goToNextFeature: true
};

class PipelineExecutorClass implements PipelineExecutor {
  public features: Feature[] = [];
  public pipelineType: string;
  constructor(pipelineType: string) {
    this.pipelineType = pipelineType;
  }

  public addFeature(feature: Feature): void {
    this.features.push(feature);
  }
}

const pipeline1 = new PipelineExecutorClass("CallAgainToken");
const pipeline2 = new PipelineExecutorClass("CallNextToken");

pipeline1.addFeature(pipeline1Feature1);
pipeline1.addFeature(pipeline1Feature2);
pipeline2.addFeature(pipeline2Feature1);
pipeline2.addFeature(pipeline2Feature2);

export { pipeline1, pipeline2 };