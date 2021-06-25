import TokenCallingState from './TokenCallingState';
import Token from '../../Entities/TokenCore/Token';

export default class TokenCallingStateManagerSingleton {

  private static instance = new TokenCallingStateManagerSingleton();

  private constructor() { }

  public static getInstance() {
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

  public setNextTokenOfTokenStateForOperatorName(operatorName: string, nextToken: Token) {
    this._tokenCallingStates = this._tokenCallingStates.map(tokenCallingState => {
      if (tokenCallingState.operator.getUserInfo().username === operatorName) {
        tokenCallingState.nextToken = nextToken;
      }
      return tokenCallingState;
    });
  }

  public falsifyChangeablePropertyOfOperatorTokenState(operatorName: string) {
    this._tokenCallingStates = this._tokenCallingStates.map(tokenCallingState => {
      if (tokenCallingState.operator.getUserInfo().username === operatorName) {
        tokenCallingState.canChange = false;
      }
      return tokenCallingState;
    });
  }

  public setEndOfQueuePropertyForOperatorTokenState(operatorName: string) {
    this._tokenCallingStates = this._tokenCallingStates.map(tokenCallingState => {
      if (tokenCallingState.operator.getUserInfo().username === operatorName) {
        tokenCallingState.endOfQueue = true;
      }
      return tokenCallingState;
    });
  }

  public addStateLockerForOperatorCallingState(operatorName: string, stateLockerName: string) {
    this._tokenCallingStates = this._tokenCallingStates.map(tokenCallingState => {
      if (tokenCallingState.operator.getUserInfo().username === operatorName) {
        tokenCallingState.stateLockers.push(stateLockerName);
      }
      return tokenCallingState;
    });
  }

  public removeStateLockerForOperatorCallingState(operatorName: string, stateLockerName: string) {
    this._tokenCallingStates = this.tokenCallingStates.map(tokenCallingState => {
      if (tokenCallingState.operator.getUserInfo().username === operatorName) {
        tokenCallingState.stateLockers = tokenCallingState.stateLockers.filter(loopStateLockerName => loopStateLockerName !== stateLockerName);
      }
      return tokenCallingState;
    });
  }

  public removeATokenCallingStateForAnOperatorIfNotLocked(username: string) {
    const tokenCallingState = this.getATokenCallingStateByOperatorName(username);
    if (tokenCallingState.stateLockers.length === 0) {
      this._tokenCallingStates = this._tokenCallingStates.filter(tokenCallingState => tokenCallingState.operator.getUserInfo().username !== username);
    }
  }

  public removeAllStateUnlockedTokenCallingStateObjects() {
    if (this.tokenCallingStates.length) {
      this._tokenCallingStates = this._tokenCallingStates.filter(tokenCallingState => this.isTokenStateForOperatorLocked(tokenCallingState.operator.getUserInfo().username));
    }
  }

  public isTokenStateForOperatorLocked(operatorName: string): boolean {
    const tokenCallingState = this.getATokenCallingStateByOperatorName(operatorName);
    if (tokenCallingState && tokenCallingState.stateLockers.length) {
      return true;
    } else {
      return false;
    }
  }
}