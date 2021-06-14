import Token from '../../../Entities/TokenCore/Token';
import TokenForwardStrategy from './TokenForwardStrategy';

export default class TokenForward {
  private _strategy: TokenForwardStrategy;

  public set strategy(strategy: TokenForwardStrategy) {
    this._strategy = strategy;
  }

  public get strategy(): TokenForwardStrategy {
    return this._strategy;
  }

  public async callToken(handledToken: Token): Promise<Token> {
    const nextToken = await this._strategy.forwardToken(handledToken);
    return nextToken;
  }
}
