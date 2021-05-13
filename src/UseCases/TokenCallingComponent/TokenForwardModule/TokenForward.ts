import TokenForwardStrategy from './TokenForwardStrategy';

export default class TokenForward {
  private _strategy: TokenForwardStrategy;

  public set strategy(strategy: TokenForwardStrategy) {
    this._strategy = strategy;
  }

  public get strategy(): TokenForwardStrategy {
    return this._strategy;
  }

  public callToken(tokenNumber: number): void {
    this._strategy.forwardToken(tokenNumber);
  }
}
