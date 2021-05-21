import CallAgainStrategy from './CallAgainStrategy';

export default class CallAgain {
  private _strategy: CallAgainStrategy;

  public set strategy(strategy: CallAgainStrategy) {
    this._strategy = strategy;
  }

  public callToken(tokenNumber: number): void {
    this._strategy.callAgainToken(tokenNumber);
  }

  public get strategy(): CallAgainStrategy {
    return this._strategy;
  }
}
