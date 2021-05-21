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

export default class TokenCallingFacadeSingleton {
  private bypass = new Bypass();
  private callAgain = new CallAgain();
  private callNext = new CallNext();
  private randomCall = new RandomCall();
  private tokenForward = new TokenForward();

  private _currentlyProcessingNumber: number;

  private static instance = new TokenCallingFacadeSingleton();

  private constructor() { }

  public static getInstance() {
    return this.instance;
  }



  public get currentlyProcessingNumber(): number {
    return this._currentlyProcessingNumber;
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

  public callNextToken(tokenNumber: number): void {
    this._currentlyProcessingNumber = tokenNumber;
    this.callNext.callToken(tokenNumber);
  }
  public callTokenAgain(tokenNumber: number): void {
    this._currentlyProcessingNumber = tokenNumber;
    this.callAgain.callToken(tokenNumber);
  }
  public byPassToken(tokenNumber: number): void {
    this._currentlyProcessingNumber = tokenNumber;
    this.bypass.callToken(tokenNumber);
  }

  public callRandomToken(tokenNumber: number): void {
    this._currentlyProcessingNumber = tokenNumber;
    this.randomCall.callToken(tokenNumber);
  }

  public forwardToken(tokenNumber: number): void {
    this._currentlyProcessingNumber = tokenNumber;
    this.tokenForward.callToken(tokenNumber);
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
