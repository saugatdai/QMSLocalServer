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
import TokenForwardStrategy from '../UseCases/TokenCallingComponent/TokenForwardModule/TokenForwardStrategy';


class CoreStrategyWithFeature {
  protected continuation = true;
  constructor(private preCallRunner: (tokenCallingState?: TokenCallingState) => Promise<void>,
    private postCallRunner?: (tokenCallingState?: TokenCallingState) => Promise<void>) {
  }


  features: Feature[] = [];

  public pipeFeature(feature: Feature): void {
    this.features.push(feature);
  }

  public async proceedCalling(handledToken: Token) {

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

export class TokenBypassDefault extends CoreStrategyWithFeature implements BypassTokenStrategy {
  public async bypassToken(handledToken: Token): Promise<Token> {
    const nextToken = await this.proceedCalling(handledToken);
    return nextToken;
  }
}

export class CallAgainDefault extends CoreStrategyWithFeature implements CallAgainTokenStrategy {
  public async callAgainToken(handledToken: Token): Promise<Token> {
    const nextToken = await this.proceedCalling(handledToken);
    return nextToken;
  }
}

export class CallNextTokenDefault extends CoreStrategyWithFeature implements NextTokenStrategy {
  public async callNextToken(handledToken: Token): Promise<Token> {
    const nextToken = this.proceedCalling(handledToken);
    return nextToken;
  }
}

export class RandomTokenCallDefault extends CoreStrategyWithFeature implements RandomTokenCallStrategy {
  public async callRandomToken(handledToken: Token): Promise<Token> {
    const nextToken = await this.proceedCalling(handledToken);
    return nextToken;
  }
}

export class TokenForwardDafault extends CoreStrategyWithFeature implements TokenForwardStrategy {
  public async forwardToken(handledToken: Token): Promise<Token> {
    const nextToken = await this.proceedCalling(handledToken);
    return nextToken;
  }
}
