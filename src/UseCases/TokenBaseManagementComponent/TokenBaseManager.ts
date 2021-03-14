import TokenBaseStorageInteractorAdapter from './TokenBaseStorageInteractorAdapter';
import { TokenBaseObject, TokenStatus } from './TokenBaseModule';

export default class TokenBaseManager {
    private tokenBase: TokenBaseObject;
    constructor(private tokenBaseStorageInteractorAdapter: TokenBaseStorageInteractorAdapter) { }

    public async createATokenBase() {
        await this.tokenBaseStorageInteractorAdapter.writeATokenBase(this.tokenBase);
    }

    public async updateTokenBase() {
        await this.tokenBaseStorageInteractorAdapter.modifyATokenBase(this.tokenBase);
    }
}
