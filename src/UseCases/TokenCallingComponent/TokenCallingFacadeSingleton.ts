import Bypass from './BypassTokenModule/Bypass';
import BypassTokenStrategy from './BypassTokenModule/BypassTokenStrategy';
import CallAgain from './CallAgainModule/CallAgain';
import CallAgainStrategy from './CallAgainModule/CallAgainStrategy';
import CallNext from './NextTokenModule/CallNext';
import NextTokenStrategy from './NextTokenModule/NextTokenStrategy';
import RandomCall from './RandomTokenCallModule/RandomCall';
import RandomCallStrategy from './RandomTokenCallModule/RandomTokenCallStrategy';
import Feature from './Feature';
import TokenForwardStrategy from './TokenForwardModule/TokenForwardStrategy';
import TokenForward from './TokenForwardModule/TokenForward';
import TokenCallingState from './TokenCallingState';
import Token from '../../Entities/TokenCore/Token';
import TokenCalingStateManager from './TokenCallingStateManager';
import TokenCallingStateManager from './TokenCallingStateManager';

export default class TokenCallingFacadeSingleton {
  private bypass = new Bypass();
  private callAgain = new CallAgain();
  private callNext = new CallNext();
  private randomCall = new RandomCall();
  private tokenForward = new TokenForward();
  private _tokenCallingStateManager: TokenCalingStateManager = TokenCallingStateManager.getinstance();

  private static instance = new TokenCallingFacadeSingleton();

  private constructor() { }

  public static getInstance() {
    return this.instance;
  }

  public get tokenCallingStateManager() {
    return this._tokenCallingStateManager;
  }

  public set byPassStrategy(byPassStrategy: BypassTokenStrategy) {
    this.bypass.strategy = byPassStrategy;
  }
  public set callAgainStrategy(callAgainStrategy: CallAgainStrategy) {
    this.callAgain.strategy = callAgainStrategy;
  }
  public set nextTokenStrategy(nextTokenStrategy: NextTokenStrategy) {
    this.callNext.strategy = nextTokenStrategy;
  }
  public set randomCallStrategy(randomCallStrategy: RandomCallStrategy) {
    this.randomCall.strategy = randomCallStrategy;
  }
  public set tokenForwardStrategy(tokenForwardStrategy: TokenForwardStrategy) {
    this.tokenForward.strategy = tokenForwardStrategy;
  }

  public async callNextToken(handledToken: Token): Promise<Token> {
    const nextToken = await this.callNext.callToken(handledToken);
    return nextToken;
  }
  public async callTokenAgain(handledToken: Token): Promise<Token> {
    const nextToken = await this.callAgain.callToken(handledToken);
    return nextToken;
  }
  public async byPassToken(handledToken: Token): Promise<Token> {
    const nextToken = await this.bypass.callToken(handledToken);
    return nextToken;
  }

  public async callRandomToken(handledToken: Token): Promise<Token> {
    const nextToken = await this.randomCall.callToken(handledToken);
    return nextToken;
  }

  public async forwardToken(handledToken: Token): Promise<Token> {
    const nextToken = await this.tokenForward.callToken(handledToken);
    return nextToken;
  }

  public pipeNextTokenFeature(feature: Feature): void {
    this.callNext.strategy.pipeFeature(feature);
  }
  public pipeCallTokenAgainFeature(feature: Feature): void {
    this.callAgain.strategy.pipeFeature(feature);
  }
  public pipeByPassTokenFeature(feature: Feature): void {
    this.bypass.strategy.pipeFeature(feature);
  }
  public pipeRandomTokenFeature(feature: Feature): void {
    this.randomCall.strategy.pipeFeature(feature);
  }
  public pipeTokenForwardFeature(feature: Feature): void {
    this.tokenForward.strategy.pipeFeature(feature);
  }
}
