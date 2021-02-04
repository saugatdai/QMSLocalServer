import CallAgainStrategy from './CallAgainStrategy';

export default class CallAgain {
  private strategy: CallAgainStrategy;

  public setStrategy(strategy: CallAgainStrategy) {
    this.strategy = strategy;
  }

  public callToken(tokenNumber: number): void {
    this.strategy.callAgainToken(tokenNumber);
  }

  public getStrategy(): CallAgainStrategy {
    return this.strategy;
  }
}
