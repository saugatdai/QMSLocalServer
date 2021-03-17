import { TokenBaseObject, TokenStatus } from '../UseCases/TokenBaseManagementComponent/TokenBaseModule';

export interface TokenBaseStorageAdapter {
  getAllTokenBases: () => Promise<TokenBaseObject[]>;
  putATokenBase: (tokenBaseObject: TokenBaseObject) => Promise<void>;
  getTokenBasesByStatus: (status: TokenStatus, date?: Date) => Promise<TokenBaseObject[]>;
  getTokenBaseByTokenDate: (date: Date) => Promise<TokenBaseObject[]>;
  resetTokenBase: () => Promise<void>;
  editATokenBase: (tokenBaseObject: TokenBaseObject) => Promise<void>;
  readTodaysTokenBaseByTokenNumber: (tokenNumber: number) => Promise<TokenBaseObject>;
  readNextAvailableTokenNumberInACategory: (category: string) => Promise<number>;
  readTokenBasesByTokenCategory: (tokenBases: TokenBaseObject[], category: string) => Promise<TokenBaseObject[]>;
  readTokenBaseByTokenId: (tokenId: number) => Promise<TokenBaseObject>;
}

export default class TokenBaseStorageInteractorImplementation {
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

  public async filterTokenBaseByTokenDate(date: Date) {
    const tokenBases = await this.tokenBaseSorageAdapter.getTokenBaseByTokenDate(date);
    return tokenBases;
  }

  public async resetATokenBase() {
    await this.tokenBaseSorageAdapter.resetTokenBase();
  }

  public async modifyATokenBase(tokenBaseObject: TokenBaseObject) {
    await this.tokenBaseSorageAdapter.editATokenBase(tokenBaseObject);
  }

  public async getTodaysTokenBaseByTokenNumber(tokenNumber: number) {
    const tokenBases = await this.tokenBaseSorageAdapter.readTodaysTokenBaseByTokenNumber(tokenNumber);
    return tokenBases;
  }

  public async getNextAvailableTokenNumberInACategory(category: string) {
    const tokenNumber = await this.tokenBaseSorageAdapter.readNextAvailableTokenNumberInACategory(category);
  }

  public getTokenBasesByTokenCategory(tokenBaseObject: TokenBaseObject[], category: string) {
    const tokenBases = this.tokenBaseSorageAdapter.readTokenBasesByTokenCategory(tokenBaseObject, category);
    return tokenBases;
  }

  public async getTokenBasesByTokenId(tokenId: number) {
    const tokenBase = await this.tokenBaseSorageAdapter.readTokenBaseByTokenId(tokenId);
  }

}