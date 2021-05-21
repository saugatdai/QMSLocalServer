import BypassTokenStrategy from './BypassTokenStrategy';

export default class Bypass {
  private _strategy: BypassTokenStrategy;

  public set strategy(strategy: BypassTokenStrategy) {
    this._strategy = strategy;
  }

  public get strategy(): BypassTokenStrategy {
    return this._strategy;
  }

  public callToken(tokenNumber: number): void {
    this._strategy.bypassToken(tokenNumber);
  }
}
