import Bypass from './BypassTokenModule/Bypass';
import BypassTokenStrategy from './BypassTokenModule/BypassTokenStrategy';
import CallAgain from './CallAgainModule/CallAgain';
import CallAgainStrategy from './CallAgainModule/CallAgainStrategy';
import CallNext from './NextTokenModule/CallNext';
import NextTokenStrategy from './NextTokenModule/NextTokenStrategy';
import RandomCall from './RandomTokenCallModule/RandomCall';
import RandomCallStrategy from './RandomTokenCallModule/RandomTokenCallStrategy';
import Feature from './Feature';

export default class TokenCallingFacade {
  private _byPassStrategy: BypassTokenStrategy;
  private _callAgainStrategy: CallAgainStrategy;
  private _nextTokenStrategy: NextTokenStrategy;
  private _randomCallStrategy: RandomCallStrategy;

  public set byPassStrategy(byPassStrategy: BypassTokenStrategy) {
    this._byPassStrategy = byPassStrategy;
  }
  public set callAgainStrategy(callAgainStrategy: CallAgainStrategy) {
    this._callAgainStrategy = callAgainStrategy;
  }
  public set nextTokenStrategy(nextTokenStrategy: NextTokenStrategy) {
    this._nextTokenStrategy = nextTokenStrategy;
  }
  public set randomCallStrategy(randomCallStrategy: RandomCallStrategy) {
    this._randomCallStrategy = randomCallStrategy;
  }

  public callNextTOken(tokenNumber: number): void {
    this._nextTokenStrategy.callNextToken(tokenNumber);
  }
  public callTokenAgain(tokenNumber: number): void {
    this._callAgainStrategy.callAgainToken(tokenNumber);
  }
  public byPassToken(tokenNumber: number): void {
    this._byPassStrategy.bypassToken(tokenNumber);
  }
  public callRandomToken(tokenNumber: number): void {
    this._randomCallStrategy.callRandomToken(tokenNumber);
  }

  public pipeNextTokenFeature(feature: Feature): void {
    this._nextTokenStrategy.pipeFeature(feature);
  }
  public pipeCallTokenAgainFeature(feature: Feature): void {
    this._callAgainStrategy.pipeFeature(feature);
  }
  public pipeByPassTokenFeature(feature: Feature): void {
    this._byPassStrategy.pipeFeature(feature);
  }
  public pipeRandomTokenFeature(feature: Feature): void {
    this._randomCallStrategy.pipeFeature(feature);
  }
}
