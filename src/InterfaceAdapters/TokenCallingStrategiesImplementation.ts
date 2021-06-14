import Feature from '../UseCases/TokenCallingComponent/Feature';
import BypassTokenStrategy from '../UseCases/TokenCallingComponent/BypassTokenModule/BypassTokenStrategy';
import CallAgainTokenStrategy from '../UseCases/TokenCallingComponent/CallAgainModule/CallAgainStrategy';
import NextTokenStrategy from '../UseCases/TokenCallingComponent/NextTokenModule/NextTokenStrategy';
import RandomTokenCallStrategy from '../UseCases/TokenCallingComponent/RandomTokenCallModule/RandomTokenCallStrategy';
import EventTypes from '../UseCases/EventManagementComponent/EventTypes';
import EventManagerSingleton from '../UseCases/EventManagementComponent/EventManagerSingleton';
import Token from '../Entities/TokenCore/Token';


class FeaturesHandler {
  features: Feature[] = [];

  public pipeFeature(feature: Feature): void {
    this.features.push(feature);
  }
}

export class TokenBypassDefault extends FeaturesHandler implements BypassTokenStrategy {
  private continuation = true;

  constructor(private precallRunner: () => Promise<void>,
    private postCallRunner?: () => Promise<void>) {
    super();
  }

  public async bypassToken(handledToken: Token): Promise<Token> {
    await this.precallRunner();

    EventManagerSingleton.getInstance().emit(EventTypes.PRE_CALL_EVENT);
    this.features.every(feature => {
      feature.runFeature();
      this.continuation = (feature.goToNextFeature);
      return this.continuation;
    });
    if (this.continuation && this.postCallRunner) {
      await this.postCallRunner();
    }
    EventManagerSingleton.getInstance().emit(EventTypes.POST_CALL_EVENT);
    const dummyToken: Token = {
      date: new Date(),
      tokenCategory: '',
      tokenId: 123,
      tokenNumber: 1
    }
    return dummyToken;
  }
}

export class CallAgainDefault extends FeaturesHandler implements CallAgainTokenStrategy {
  private continuation = true;

  constructor(private precallRunner: () => Promise<void>,
    private postCallRunner?: () => Promise<void>) {
    super();
  }


  public async callAgainToken(handledToken: Token): Promise<Token> {
    await this.precallRunner();
    EventManagerSingleton.getInstance().emit(EventTypes.PRE_CALL_EVENT);
    this.features.every(feature => {
      feature.runFeature();
      this.continuation = (feature.goToNextFeature) ? true : false;
      return this.continuation;
    });
    if (this.continuation && this.postCallRunner) {
      await this.postCallRunner();
    }
    EventManagerSingleton.getInstance().emit(EventTypes.POST_CALL_EVENT);
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


  constructor(private preCallRunner: () => Promise<void>,
    private postCallRunner?: () => Promise<void>) {
    super();
  }

  public async callNextToken(handledToken: Token): Promise<Token> {
    await this.preCallRunner();
    EventManagerSingleton.getInstance().emit(EventTypes.PRE_CALL_EVENT);
    this.features.every(feature => {
      feature.runFeature();
      this.continuation = (feature.goToNextFeature);
      return this.continuation;
    });
    if (this.continuation && this.postCallRunner) {
      await this.postCallRunner();
    }
    EventManagerSingleton.getInstance().emit(EventTypes.POST_CALL_EVENT);
    const dummyToken: Token = {
      date: new Date(),
      tokenId: 1,
      tokenNumber: 123,
      tokenCategory: ''
    }
    return dummyToken;
  }
}

export class RandomTokenCallDefault extends FeaturesHandler implements RandomTokenCallStrategy {
  private continuation = true;

  constructor(private precallRunner: () => Promise<void>,
    private postCallRunner?: () => Promise<void>) {
    super();
  }

  public async callRandomToken(handledToken: Token): Promise<Token> {
    await this.precallRunner();
    EventManagerSingleton.getInstance().emit(EventTypes.PRE_CALL_EVENT);
    this.features.every(feature => {
      feature.runFeature();
      this.continuation = (feature.goToNextFeature) ? true : false;
      return this.continuation;
    });
    if (this.continuation && this.postCallRunner) {
      await this.postCallRunner();
    }
    EventManagerSingleton.getInstance().emit(EventTypes.PRE_CALL_EVENT);
    const dummyToken: Token = {
      date: new Date(),
      tokenId: 1,
      tokenNumber: 1
    }
    return dummyToken;
  }
}
