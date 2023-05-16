import { TokenForwardListStorageInteractorAdapter, TokenForwardObject } from "../UseCases/TokenForwardListManagement/TokenForwardListManager";
import Operator from '../Entities/UserCore/Operator';
import Token from "../Entities/TokenCore/Token";

export interface TokenForwardListStorageAdapter {
  getTokenForwardList(): Promise<TokenForwardObject[]>;
  writeTokenForwardList(tokenForwardObjectList: TokenForwardObject[]): Promise<void>;
}

export default class TokenForwardListStorageInteractorImplementation implements TokenForwardListStorageInteractorAdapter {

  public constructor(private tokenForwardListStorageAdapter: TokenForwardListStorageAdapter) { }

  public async addTokenForwardObject(tokenForwardObject: TokenForwardObject) {
    let tokenForwardList = await this.tokenForwardListStorageAdapter.getTokenForwardList();
    const existingCounterObject = tokenForwardList.find(loopTokenForwardObject => tokenForwardObject.counter === loopTokenForwardObject.counter);

    if (existingCounterObject) {
      tokenForwardList = tokenForwardList.map(loopTokenForwardObject => {
        if (loopTokenForwardObject.counter === tokenForwardObject.counter) {
          loopTokenForwardObject.tokens = [...loopTokenForwardObject.tokens, ...tokenForwardObject.tokens];
        }
        return loopTokenForwardObject;
      });
    } else {
      tokenForwardList = [...tokenForwardList, tokenForwardObject]
    }

    await this.tokenForwardListStorageAdapter.writeTokenForwardList(tokenForwardList);
  }

  public async deleteAForwardedToken(counter: string, token: Token) {
    let tokenForwardList = await this.tokenForwardListStorageAdapter.getTokenForwardList();
    tokenForwardList = tokenForwardList.map(tokenForwardObject => {
      if (tokenForwardObject.counter === counter) {
        tokenForwardObject.tokens = tokenForwardObject.tokens.filter(loopToken => loopToken.tokenId !== token.tokenId)
      }
      return tokenForwardObject;
    }).filter(tokenForwardObject => tokenForwardObject.tokens.length !== 0);

    await this.tokenForwardListStorageAdapter.writeTokenForwardList(tokenForwardList);
  }

  public async deleteAllTokenForwardObjects() {
    await this.tokenForwardListStorageAdapter.writeTokenForwardList([]);
  }

  public async removeAllExceptForToday() {
    let tokenForwardList = await this.tokenForwardListStorageAdapter.getTokenForwardList();
    tokenForwardList = tokenForwardList.map(tokenForwardObject => {
      tokenForwardObject.tokens = tokenForwardObject.tokens.filter(token => {
        const tokenDate = new Date(token.date);
        const todaysDate = new Date();
        return (tokenDate.getDate() === todaysDate.getDate() &&
          tokenDate.getFullYear() === todaysDate.getFullYear() &&
          tokenDate.getMonth() === todaysDate.getMonth())
      });
      return tokenForwardObject;
    }).filter(tokenForwardObject => tokenForwardObject.tokens.length !== 0);

    await this.tokenForwardListStorageAdapter.writeTokenForwardList(tokenForwardList);
  }

  public async tokenForwardObjectByCounter(counter: string) {
    const tokenForwardList = await this.tokenForwardListStorageAdapter.getTokenForwardList();
    return tokenForwardList.find(tokenForwardObject => tokenForwardObject.counter === counter);
  }

  public async tokenForwardObjects() {
    const tokenForwardlist = await this.tokenForwardListStorageAdapter.getTokenForwardList();
    return tokenForwardlist;
  }

}