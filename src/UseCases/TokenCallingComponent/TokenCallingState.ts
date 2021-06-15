import Operator from "../../Entities/UserCore/Operator";
import Token from '../../Entities/TokenCore/Token';

export default class TokenState {
  private _operator: Operator;
  private _currentToken: Token;
  private _nextToken: Token;
  private _endOfQueue: boolean;
  private _canChange: boolean = true;

  public constructor(operator: Operator, currentToken: Token) {
    this._operator = operator;
    this._currentToken = currentToken;
  }

  public get operator() {
    return this._operator;
  }

  public get currentToken() {
    return this._currentToken;
  }

  public set nextToken(token: Token) {
    if (this._canChange) {
      this._nextToken = token;
    }
  }

  public get nextToken() {
    return this._nextToken;
  }

  public get endOfQueue() {
    return this._endOfQueue;
  }

  public set endOfQueue(endOfQueue: boolean) {
    this._endOfQueue = endOfQueue;
  }

  public set canChange(canChange: boolean) {
    if (this._canChange) {
      this._canChange = canChange;
    }
  }

  public get canChange() {
    return this._canChange;
  }

}