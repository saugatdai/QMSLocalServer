import NextTokenStrategy from './NextTokenStrategy';

export default class CallNext {
  private strategy: NextTokenStrategy;

  public setStrategy(strategy: NextTokenStrategy): void {
    this.strategy = strategy;
  }

  public getStrategy(): NextTokenStrategy {
    return this.strategy;
  }

  public callToken(tokenNumber: number): void {
    this.strategy.callNextToken(tokenNumber);
  }
}
