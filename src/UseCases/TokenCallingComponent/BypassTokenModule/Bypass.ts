import BypassTokenStrategy from './BypassTokenStrategy';

export default class Bypass {
  private strategy: BypassTokenStrategy;

  public setStrategy(strategy: BypassTokenStrategy) {
    this.strategy = strategy;
  }

  public getStrategy(): BypassTokenStrategy {
    return this.strategy;
  }

  public callToken(tokenNumber: number): void {
    this.strategy.bypassToken(tokenNumber);
  }
}
