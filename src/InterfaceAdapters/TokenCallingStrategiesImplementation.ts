import Feature from '../UseCases/TokenCallingComponent/Feature';
import BypassTokenStrategy from '../UseCases/TokenCallingComponent/BypassTokenModule/BypassTokenStrategy';
import CallAgainTokenStrategy from '../UseCases/TokenCallingComponent/CallAgainModule/CallAgainStrategy';
import NextTokenStrategy from '../UseCases/TokenCallingComponent/NextTokenModule/NextTokenStrategy';
import RandomTokenCallStrategy from '../UseCases/TokenCallingComponent/RandomTokenCallModule/RandomTokenCallStrategy';
import EventTypes from '../UseCases/EventManagementComponent/EventTypes';
import EventManagerSingleton from '../UseCases/EventManagementComponent/EventManagerSingleton';


class FeaturesHandler {
  features: Feature[] = [];

  public pipeFeature(feature: Feature): void {
    this.features.push(feature);
  }
}

export class TokenBypassDefault extends FeaturesHandler implements BypassTokenStrategy {
  constructor(private byPassToken: (tokenNumber: number) => Promise<void>) {
    super();
  }
  public bypassToken(tokenNumber: number): void {
    EventManagerSingleton.getInstance().emit(EventTypes.PRE_CALL_EVENT);
    this.features.every(feature => {
      feature.runFeature();
      return (feature.goToNextFeature) ? true : false;
    });
    this.byPassToken(tokenNumber).then().catch(error => {
      console.log(error);
    });
    EventManagerSingleton.getInstance().emit(EventTypes.POST_CALL_EVENT);
  }
}

export class CallAgainDefault extends FeaturesHandler implements CallAgainTokenStrategy {
  constructor(private callTokenAgain: (tokenNumber: number) => Promise<void>) {
    super();
  }
  public callAgainToken(tokenNumber: number): void {
    EventManagerSingleton.getInstance().emit(EventTypes.PRE_CALL_EVENT);
    this.features.every(feature => {
      feature.runFeature();
      return (feature.goToNextFeature) ? true : false;
    });
    this.callTokenAgain(tokenNumber).then().catch(error => {
      console.log(error);
    });
    EventManagerSingleton.getInstance().emit(EventTypes.POST_CALL_EVENT);
  }
}

export class CallNextTokenDefault extends FeaturesHandler implements NextTokenStrategy {
  constructor(private nextTokenCaller: (tokenNumber: number) => Promise<void>) {
    super();
  }
  public callNextToken(tokenNumber: number) {
    EventManagerSingleton.getInstance().emit(EventTypes.PRE_CALL_EVENT);
    this.features.every(feature => {
      feature.runFeature();
      return (feature.goToNextFeature) ? true : false;
    });
    this.nextTokenCaller(tokenNumber).then().catch(error => {
      console.log(error);
    });
    EventManagerSingleton.getInstance().emit(EventTypes.POST_CALL_EVENT);
  }
}

export class RandomTokenCallDefault extends FeaturesHandler implements RandomTokenCallStrategy {
  constructor(private randomTokenCaller: (tokenNumber: number) => Promise<void>) {
    super();
  }
  public callRandomToken(tokenNumber: number) {
    EventManagerSingleton.getInstance().emit(EventTypes.PRE_CALL_EVENT);
    this.features.every(feature => {
      feature.runFeature();
      return (feature.goToNextFeature) ? true : false;
    });
    this.randomTokenCaller(tokenNumber).then().catch(error => {
      console.log(error);
    });
    EventManagerSingleton.getInstance().emit(EventTypes.PRE_CALL_EVENT);
  }
}

// TODO TokenCallingStrategies testing for usecase remaining