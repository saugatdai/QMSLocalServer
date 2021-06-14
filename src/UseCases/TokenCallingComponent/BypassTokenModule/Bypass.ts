import BypassTokenStrategy from './BypassTokenStrategy';
import Token from "../../../Entities/TokenCore/Token";

export default class Bypass {
  private _strategy: BypassTokenStrategy;

  public set strategy(strategy: BypassTokenStrategy) {
    this._strategy = strategy;
  }

  public get strategy(): BypassTokenStrategy {
    return this._strategy;
  }

  public async callToken(handledToken: Token): Promise<Token> {
    const nextToken = await this._strategy.bypassToken(handledToken);
    return nextToken;
  }
}
