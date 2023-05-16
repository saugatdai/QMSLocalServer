import TokenBaseStorageInteractorAdapter from './TokenBaseStorageInteractorAdapter';
import { TokenBaseObject } from './TokenBaseModule';

export default class TokenBaseManager {
    private _tokenBase: TokenBaseObject;
    constructor(private tokenBaseStorageInteractorAdapter: TokenBaseStorageInteractorAdapter) { }

    public set tokenBase(tokenBase: TokenBaseObject) {
        this._tokenBase = tokenBase;
    }

    public get tokenBase() {
        return this._tokenBase;
    }

    public async createATokenBase() {
        await this.tokenBaseStorageInteractorAdapter.writeATokenBase(this._tokenBase);
    }

    public async updateTokenBase() {
        await this.tokenBaseStorageInteractorAdapter.modifyATokenBase(this._tokenBase);
    }
}
