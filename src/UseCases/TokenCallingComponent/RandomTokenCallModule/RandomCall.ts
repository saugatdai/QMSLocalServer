import RandomTokenCallStrategy from './RandomTokenCallStrategy';

export default class RamdomCall {
  private strategy: RandomTokenCallStrategy;

  public setStrategy(strategy: RandomTokenCallStrategy): void {
    this.strategy = strategy;
  }

  public getStrategy(): RandomTokenCallStrategy {
    return this.strategy;
  }

  public callToken(tokenNumber: number) {
    this.strategy.callRandomToken(tokenNumber);
  }
}
