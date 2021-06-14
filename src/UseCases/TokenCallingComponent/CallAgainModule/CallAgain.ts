import Token from '../../../Entities/TokenCore/Token';
import CallAgainStrategy from './CallAgainStrategy';

export default class CallAgain {
  private _strategy: CallAgainStrategy;

  public set strategy(strategy: CallAgainStrategy) {
    this._strategy = strategy;
  }

  public async callToken(handledToken: Token): Promise<Token> {
    const nextToken = this._strategy.callAgainToken(handledToken);
    return nextToken;
  }

  public get strategy(): CallAgainStrategy {
    return this._strategy;
  }
}
