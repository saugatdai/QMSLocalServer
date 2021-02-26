import TokenBaseStorageInteractorAdapter from './TokenBaseStorageInteractorAdapter';
import {TokenbaseObject, TokenStatus} from './TokenBaseModule';

export default class TokenBaseManager{
    private tokenBase:TokenbaseObject;
    constructor(private tokenBaseStorageInteractorAdapter: TokenBaseStorageInteractorAdapter){}

    public async createATokenBase() {
        await this.tokenBaseStorageInteractorAdapter.writeATokenBase(this.tokenBase);
    }

    public async updateTokenBase(){
        await this.tokenBaseStorageInteractorAdapter.modifyATokenBase(this.tokenBase);
    }

    
 
}
