import {
  BypassTokenStrategy,
  CallAgainStrategy,
  NextTokenStrategy,
  Feature,
  RandomTokenCallStrategy,
  TokenForwardStrategy
} from './Interfaces';

import EventManagerSingleton from '../../../../../src/UseCases/EventManagementComponent/EventManagerSingleton';
import EventTypes from '../../../../../src/UseCases/EventManagementComponent/EventTypes';

export const nextTokenStrategyMock = jest.fn();
export const callAgainStrategyMock = jest.fn();
export const bypassTokenStrategyMock = jest.fn();
export const callRandomTokenStrategyMock = jest.fn();
export const tokenFrowardStrategyMock = jest.fn();

class CallNext implements NextTokenStrategy {
  public features: Feature[] = [];
  public callNextToken(tokenNumber: number) {
    EventManagerSingleton.getInstance().emit(EventTypes.PRE_CALL_EVENT);
    this.features.forEach(feature => {
      feature.runFeature();
    })
    nextTokenStrategyMock();
    EventManagerSingleton.getInstance().emit(EventTypes.POST_CALL_EVENT);
  }

  public pipeFeature(feature: Feature) {
    this.features.push(feature);
  }
}

class CallAgain implements CallAgainStrategy {
  features: Feature[] = [];

  pipeFeature(feature: Feature) {
    this.features.push(feature);
  }

  callAgainToken(tokenNumber: number) {
    EventManagerSingleton.getInstance().emit(EventTypes.PRE_CALL_EVENT);
    this.features.forEach(feature => {
      feature.runFeature();
    });
    callAgainStrategyMock();
    EventManagerSingleton.getInstance().emit(EventTypes.POST_CALL_EVENT);
  }
}

class ByPass implements BypassTokenStrategy {
  features: Feature[] = [];

  pipeFeature(feature: Feature) {
    this.features.push(feature);
  }

  bypassToken(tokenNumber: number) {
    EventManagerSingleton.getInstance().emit(EventTypes.PRE_CALL_EVENT);
    this.features.forEach(feature => {
      feature.runFeature();
    });
    bypassTokenStrategyMock();
    EventManagerSingleton.getInstance().emit(EventTypes.POST_CALL_EVENT);
  }
}

class RandomCall implements RandomTokenCallStrategy {
  features: Feature[] = [];

  pipeFeature(feature: Feature) {
    this.features.push(feature);
  }

  callRandomToken(tokenNumber: number) {
    EventManagerSingleton.getInstance().emit(EventTypes.PRE_CALL_EVENT);
    this.features.forEach(feature => {
      feature.runFeature();
    });
    callRandomTokenStrategyMock();
    EventManagerSingleton.getInstance().emit(EventTypes.POST_CALL_EVENT);
  }
}

class ForwardToken implements TokenForwardStrategy {
  features: Feature[] = [];

  pipeFeature(feature: Feature) {
    this.features.push(feature);
  }

  forwardToken(tokenNumber: number) {
    EventManagerSingleton.getInstance().emit(EventTypes.PRE_CALL_EVENT);
    this.features.forEach(feature => {
      feature.runFeature();
    });
    tokenFrowardStrategyMock();
    EventManagerSingleton.getInstance().emit(EventTypes.POST_CALL_EVENT);
  }
}


const callNext = new CallNext();
const callAgain = new CallAgain();
const byPass = new ByPass();
const forwardToken = new ForwardToken();
const randomCall = new RandomCall();

export { callNext, callAgain, byPass, forwardToken, randomCall };