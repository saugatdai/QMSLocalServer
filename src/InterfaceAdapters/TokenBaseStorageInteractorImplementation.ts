import { TokenBaseObject, TokenStatus } from '../UseCases/TokenBaseManagementComponent/TokenBaseModule';
import TokenBaseStorageInteractorAdapter from '../UseCases/TokenBaseManagementComponent/TokenBaseStorageInteractorAdapter';

export interface TokenBaseStorageAdapter {
  getAllTokenBases: () => Promise<TokenBaseObject[]>;
  putATokenBase: (tokenBaseObject: TokenBaseObject) => Promise<void>;
  getTokenBasesByStatus: (status: TokenStatus, date?: Date) => Promise<TokenBaseObject[]>;
  getTokenBaseByTokenDate: (date: string) => Promise<TokenBaseObject[]>;
  resetTokenBase: () => Promise<void>;
  editATokenBase: (tokenBaseObject: TokenBaseObject) => Promise<void>;
  readTodaysTokenBaseByTokenNumber: (tokenNumber: number, category?: string) => Promise<TokenBaseObject>;
  readNextAvailableTokenNumberInACategoryForToday: (category: string) => Promise<number>;
  readTokenBasesByTokenCategory: (tokenBases: TokenBaseObject[], category: string) => TokenBaseObject[];
  readTokenBaseByTokenId: (tokenId: number) => Promise<TokenBaseObject>;
  getNextAvailableTokenId: () => Promise<number>;
}

export default class TokenBaseStorageInteractorImplementation implements TokenBaseStorageInteractorAdapter {
  constructor(private tokenBaseSorageAdapter: TokenBaseStorageAdapter) { }

  public async readAllTokenBases() {
    const allTokenBases = await this.tokenBaseSorageAdapter.getAllTokenBases();
    return allTokenBases;
  }

  public async writeATokenBase(tokenBaseObject: TokenBaseObject) {
    await this.tokenBaseSorageAdapter.putATokenBase(tokenBaseObject);
  }

  public async filterTokenBaseByStatus(status: TokenStatus, date?: Date) {
    const tokenBases = await this.tokenBaseSorageAdapter.getTokenBasesByStatus(status, date);
    return tokenBases;
  }

  public async filterTokenBaseByTokenDate(date: string) {
    const tokenBases = await this.tokenBaseSorageAdapter.getTokenBaseByTokenDate(date);
    return tokenBases;
  }

  public async resetTokenBase() {
    await this.tokenBaseSorageAdapter.resetTokenBase();
  }

  public async modifyATokenBase(tokenBaseObject: TokenBaseObject) {
    await this.tokenBaseSorageAdapter.editATokenBase(tokenBaseObject);
  }

  public async getTodaysTokenBaseByTokenNumber(tokenNumber: number, category?: string) {
    let tokenBase: TokenBaseObject;
    if (category) {
      tokenBase = await this.tokenBaseSorageAdapter.readTodaysTokenBaseByTokenNumber(tokenNumber, category);
    } else {
      tokenBase = await this.tokenBaseSorageAdapter.readTodaysTokenBaseByTokenNumber(tokenNumber);
    }
    return tokenBase;
  }

  public async getNextAvailableTokenNumberInACategoryForToday(category: string) {
    const tokenNumber = await this.tokenBaseSorageAdapter.readNextAvailableTokenNumberInACategoryForToday(category);
    return tokenNumber;
  }

  public getTokenBasesByTokenCategory(tokenBaseObject: TokenBaseObject[], category: string) {
    const tokenBases = this.tokenBaseSorageAdapter.readTokenBasesByTokenCategory(tokenBaseObject, category);
    return tokenBases;
  }

  public async getTokenBaseByTokenId(tokenId: number) {
    const tokenBase = await this.tokenBaseSorageAdapter.readTokenBaseByTokenId(tokenId);
    return tokenBase;
  }
}