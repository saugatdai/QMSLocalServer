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
    const callNextTokenObject = new CallNext();
    callNextTokenObject.strategy = this._nextTokenStrategy;
    callNextTokenObject.callToken(tokenNumber);
  }
  public callTokenAgain(tokenNumber: number): void {
    const callAgainTokenObject = new CallAgain();
    callAgainTokenObject.strategy = this._callAgainStrategy;
    callAgainTokenObject.callToken(tokenNumber);
  }
  public byPassToken(tokenNumber: number): void {
    const byPassTokenObject = new Bypass();
    byPassTokenObject.strategy = this._byPassStrategy;
    byPassTokenObject.callToken(tokenNumber);
  }
  public callRandomToken(tokenNumber: number): void {
    const callRandomTokenObject = new RandomCall();
    callRandomTokenObject.strategy = this._randomCallStrategy;
    callRandomTokenObject.callToken(tokenNumber);
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
