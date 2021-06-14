import Token from '../../../Entities/TokenCore/Token';
import NextTokenStrategy from './NextTokenStrategy';

export default class CallNext {
  private _strategy: NextTokenStrategy;

  public set strategy(strategy: NextTokenStrategy) {
    this._strategy = strategy;
  }

  public get strategy(): NextTokenStrategy {
    return this._strategy;
  }

  public async callToken(token: Token): Promise<Token> {
    const nextToken = await this._strategy.callNextToken(token);
    return nextToken;
  }
}
