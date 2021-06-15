import TokenCallingState from './TokenCallingState';
import Token from '../../Entities/TokenCore/Token';

export default class TokenCallingStateManager {

  private static instance = new TokenCallingStateManager();

  private constructor() { }

  public static getinstance() {
    return this.instance;
  }

  private _tokenCallingStates: TokenCallingState[] = [];

  public addTokenCallingState(tokenCallingState: TokenCallingState) {
    const existingState = this.getATokenCallingStateByOperatorName(tokenCallingState.operator.getUserInfo().username);
    if (existingState) {
      this._tokenCallingStates = this._tokenCallingStates.map(loopTokenCallingState => {
        if (loopTokenCallingState.operator.getUserInfo().username === tokenCallingState.operator.getUserInfo().username) {
          return tokenCallingState;
        }
        return loopTokenCallingState;
      });
    } else {
      this._tokenCallingStates.push(tokenCallingState);
    }
  }

  public get tokenCallingStates() {
    return this._tokenCallingStates;
  }

  public getATokenCallingStateByOperatorName(username: string) {
    return this._tokenCallingStates.find(tokenCallingState => tokenCallingState.operator.getUserInfo().username === username);
  }

  public getATokenCallingStateByCurrentToken(token: Token) {
    return this._tokenCallingStates.find(tokenCallingState =>
      tokenCallingState.currentToken.tokenNumber === token.tokenNumber &&
      tokenCallingState.currentToken.tokenCategory === token.tokenCategory);
  }

  public removeATokenCallingStateForAUser(username: string) {
    this._tokenCallingStates = this._tokenCallingStates.filter(tokenCallingState => tokenCallingState.operator.getUserInfo().username !== username);
  }
}