import RandomTokenCallStrategy from './RandomTokenCallStrategy';

export default class RamdomCall {
  private _strategy: RandomTokenCallStrategy;

  public set strategy(strategy: RandomTokenCallStrategy) {
    this._strategy = strategy;
  }

  public get strategy(): RandomTokenCallStrategy {
    return this._strategy;
  }

  public callToken(tokenNumber: number) {
    this._strategy.callRandomToken(tokenNumber);
  }
}
