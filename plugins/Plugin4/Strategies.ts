import NextTokenStrategy from '../../src/UseCases/TokenCallingComponent/NextTokenModule/NextTokenStrategy';
import Feature from '../../src/UseCases/TokenCallingComponent/Feature';
import EventTypes from '../../src/UseCases/EventManagementComponent/EventTypes';
import EventManagerSingleton from '../../src/UseCases/EventManagementComponent/EventManagerSingleton';

class CallNext implements NextTokenStrategy {
  public features: Feature[] = [];
  public callNextToken(tokenNumber: number) {
    EventManagerSingleton.getInstance().emit(EventTypes.PRE_CALL_EVENT);
    this.features.forEach(feature => {
      feature.runFeature();
    })
    console.log("Default caller from Plugin 4");
    EventManagerSingleton.getInstance().emit(EventTypes.POST_CALL_EVENT);
  }

  public pipeFeature(feature: Feature) {
    this.features.push(feature);
  }
}

const callNext = new CallNext();
export { callNext };