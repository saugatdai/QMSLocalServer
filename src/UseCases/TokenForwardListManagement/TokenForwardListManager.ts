import Token from "../../Entities/TokenCore/Token";

export interface TokenForwardObject {
  counter: string;
  tokens: Token[]
}

export interface TokenForwardListStorageInteractorAdapter {
  addTokenForwardObject(tokenForwardObject: TokenForwardObject): Promise<void>;
  tokenForwardObjects(): Promise<TokenForwardObject[]>;
  tokenForwardObjectByCounter(counter: string): Promise<TokenForwardObject>;
  deleteAForwardedToken(counter: string, token: Token): Promise<void>;
  deleteAllTokenForwardObjects(): Promise<void>;
  removeAllExceptForToday(): Promise<void>;
}

export default class TokenForwardListManager {
  constructor(private tokenForwardStorageInteractor: TokenForwardListStorageInteractorAdapter) { }

  public async storeATokenForwardObject(tokenForwardObject: TokenForwardObject) {
    await this.tokenForwardStorageInteractor.addTokenForwardObject(tokenForwardObject);
  }

  public async getAllTokenForwardObjects() {
    const tokenForwardObjects = await this.tokenForwardStorageInteractor.tokenForwardObjects();
    return tokenForwardObjects;
  }

  public async getTokenForwardObjectByCounter(counter: string) {
    const tokenForwardObect = await this.tokenForwardStorageInteractor.tokenForwardObjectByCounter(counter);
  }

  public async removeForwardedToken(counter: string, token: Token) {
    await this.tokenForwardStorageInteractor.deleteAForwardedToken(counter, token);
  }

  public async clearAllTokenForwardObject() {
    await this.tokenForwardStorageInteractor.deleteAllTokenForwardObjects();
  }

  public async keepOnlyTodaysTokenForwardObject() {
    await this.tokenForwardStorageInteractor.removeAllExceptForToday();
  }
}