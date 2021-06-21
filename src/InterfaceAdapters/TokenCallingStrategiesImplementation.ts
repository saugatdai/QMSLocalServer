import Feature from '../UseCases/TokenCallingComponent/Feature';
import BypassTokenStrategy from '../UseCases/TokenCallingComponent/BypassTokenModule/BypassTokenStrategy';
import CallAgainTokenStrategy from '../UseCases/TokenCallingComponent/CallAgainModule/CallAgainStrategy';
import NextTokenStrategy from '../UseCases/TokenCallingComponent/NextTokenModule/NextTokenStrategy';
import RandomTokenCallStrategy from '../UseCases/TokenCallingComponent/RandomTokenCallModule/RandomTokenCallStrategy';
import EventTypes from '../UseCases/EventManagementComponent/EventTypes';
import EventManagerSingleton from '../UseCases/EventManagementComponent/EventManagerSingleton';
import Token from '../Entities/TokenCore/Token';
import TokenCallingState from '../UseCases/TokenCallingComponent/TokenCallingState';
import TokenCallingStateManagerSingleton from '../UseCases/TokenCallingComponent/TokenCallingStateManagerSingleton';


class FeaturesHandler {
  features: Feature[] = [];

  public pipeFeature(feature: Feature): void {
    this.features.push(feature);
  }
}

export class TokenBypassDefault extends FeaturesHandler implements BypassTokenStrategy {
  private continuation = true;


  constructor(private preCallRunner: (tokenCallingState?: TokenCallingState) => Promise<void>,
    private postCallRunner?: (tokenCallingState?: TokenCallingState) => Promise<void>) {
    super();
  }

  public async bypassToken(handledToken: Token): Promise<Token> {
    const tokenCallingState = TokenCallingStateManagerSingleton.getInstance().getATokenCallingStateByCurrentToken(handledToken);
    await this.preCallRunner(tokenCallingState);
    EventManagerSingleton.getInstance().emit(EventTypes.PRE_CALL_EVENT, tokenCallingState);
    this.features.every(feature => {
      feature.runFeature(tokenCallingState);
      this.continuation = (feature.goToNextFeature);
      return this.continuation;
    });
    if (this.continuation && this.postCallRunner) {
      await this.postCallRunner(tokenCallingState);
    }
    EventManagerSingleton.getInstance().emit(EventTypes.POST_CALL_EVENT, tokenCallingState);
    if (TokenCallingStateManagerSingleton.getInstance().getATokenCallingStateByCurrentToken(handledToken)) {
      const nextToken = TokenCallingStateManagerSingleton.getInstance().getATokenCallingStateByCurrentToken(handledToken).nextToken;
      return nextToken;
    } else {
      return null;
    }
  }
}

export class CallAgainDefault extends FeaturesHandler implements CallAgainTokenStrategy {
  private continuation = true;

  constructor(private precallRunner: (tokenCallingState?: TokenCallingState) => Promise<void>,
    private postCallRunner?: (tokenCallingState?: TokenCallingState) => Promise<void>) {
    super();
  }


  public async callAgainToken(handledToken: Token): Promise<Token> {
    const tokenCallingState = TokenCallingStateManagerSingleton.getInstance().getATokenCallingStateByCurrentToken(handledToken);
    await this.precallRunner(tokenCallingState);
    EventManagerSingleton.getInstance().emit(EventTypes.PRE_CALL_EVENT, tokenCallingState);
    this.features.every(feature => {
      feature.runFeature(tokenCallingState);
      this.continuation = (feature.goToNextFeature) ? true : false;
      return this.continuation;
    });
    if (this.continuation && this.postCallRunner) {
      await this.postCallRunner(tokenCallingState);
    }
    EventManagerSingleton.getInstance().emit(EventTypes.POST_CALL_EVENT), tokenCallingState;
    const dummyToken: Token = {
      date: new Date(),
      tokenId: 1,
      tokenNumber: 1
    }
    return dummyToken;
  }
}

export class CallNextTokenDefault extends FeaturesHandler implements NextTokenStrategy {
  private continuation = true;


  constructor(private preCallRunner: (tokenCallingState?: TokenCallingState) => Promise<void>,
    private postCallRunner?: (tokenCallingState?: TokenCallingState) => Promise<void>) {
    super();
  }

  public async callNextToken(handledToken: Token): Promise<Token> {
    const tokenCallingState = TokenCallingStateManagerSingleton.getInstance().getATokenCallingStateByCurrentToken(handledToken);
    await this.preCallRunner(tokenCallingState);
    EventManagerSingleton.getInstance().emit(EventTypes.PRE_CALL_EVENT, tokenCallingState);
    this.features.every(feature => {
      feature.runFeature(tokenCallingState);
      this.continuation = (feature.goToNextFeature);
      return this.continuation;
    });
    if (this.continuation && this.postCallRunner) {
      await this.postCallRunner(tokenCallingState);
    }
    EventManagerSingleton.getInstance().emit(EventTypes.POST_CALL_EVENT, tokenCallingState);
    if (TokenCallingStateManagerSingleton.getInstance().getATokenCallingStateByCurrentToken(handledToken)) {
      const nextToken = TokenCallingStateManagerSingleton.getInstance().getATokenCallingStateByCurrentToken(handledToken).nextToken;
      return nextToken;
    } else {
      return null;
    }
  }
}

export class RandomTokenCallDefault extends FeaturesHandler implements RandomTokenCallStrategy {
  private continuation = true;

  constructor(private precallRunner: (tokenCallingState?: TokenCallingState) => Promise<void>,
    private postCallRunner?: (tokenCallingState?: TokenCallingState) => Promise<void>) {
    super();
  }

  public async callRandomToken(handledToken: Token): Promise<Token> {
    const tokenCallingState = TokenCallingStateManagerSingleton.getInstance().getATokenCallingStateByCurrentToken(handledToken);
    await this.precallRunner(tokenCallingState);
    EventManagerSingleton.getInstance().emit(EventTypes.PRE_CALL_EVENT, tokenCallingState);
    this.features.every(feature => {
      feature.runFeature(tokenCallingState);
      this.continuation = (feature.goToNextFeature) ? true : false;
      return this.continuation;
    });
    if (this.continuation && this.postCallRunner) {
      await this.postCallRunner(tokenCallingState);
    }
    EventManagerSingleton.getInstance().emit(EventTypes.PRE_CALL_EVENT, tokenCallingState);
    const dummyToken: Token = {
      date: new Date(),
      tokenId: 1,
      tokenNumber: 1
    }
    return dummyToken;
  }
}
