import Token from '../../../Entities/TokenCore/Token';
import RandomTokenCallStrategy from './RandomTokenCallStrategy';

export default class RamdomCall {
  private _strategy: RandomTokenCallStrategy;

  public set strategy(strategy: RandomTokenCallStrategy) {
    this._strategy = strategy;
  }

  public get strategy(): RandomTokenCallStrategy {
    return this._strategy;
  }

  public clearPipelines() {
    this._strategy.features = [];
  }

  public async callToken(handledToken: Token): Promise<Token> {
    const nextToken = this._strategy.callRandomToken(handledToken);
    return nextToken;
  }
}
