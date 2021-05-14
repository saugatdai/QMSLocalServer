import Feature from '../../src/UseCases/TokenCallingComponent/Feature';
import PipelineExecutor from '../../src/UseCases/PluginManagementComponent/PluginModule/PipelineExecutor';
import PipelineTypes from '../../src/UseCases/PluginManagementComponent/PluginModule/PipelineTypes';

const pipelineExecutor1Feature1: Feature = {
  runFeature() {
    console.log('Plugin4 PipelineExecutor1 Feature 1');
  },
  goToNextFeature: true
}

const pipelineExecutor1Feature2: Feature = {
  runFeature() {
    console.log('Plugin4 PipelineExecutor1 Feature 2');
  },
  goToNextFeature: true
}

export class PipelineExecutorPlugin4 implements PipelineExecutor {
  pipelineType: PipelineTypes;
  features: Feature[] = [];

  public addFeature(feature: Feature) {
    this.features.push(feature);
  }
}

const pipelineExecutorPlugin4 = new PipelineExecutorPlugin4();
pipelineExecutorPlugin4.pipelineType = PipelineTypes.CALL_NEXT_TOKEN;
pipelineExecutorPlugin4.addFeature(pipelineExecutor1Feature1);
pipelineExecutorPlugin4.addFeature(pipelineExecutor1Feature2);

export { pipelineExecutorPlugin4 };