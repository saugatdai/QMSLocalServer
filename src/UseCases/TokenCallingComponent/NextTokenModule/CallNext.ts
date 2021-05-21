import NextTokenStrategy from './NextTokenStrategy';

export default class CallNext {
  private _strategy: NextTokenStrategy;

  public set strategy(strategy: NextTokenStrategy) {
    this._strategy = strategy;
  }

  public get strategy(): NextTokenStrategy {
    return this._strategy;
  }

  public callToken(tokenNumber: number): void {
    this._strategy.callNextToken(tokenNumber);
  }
}
