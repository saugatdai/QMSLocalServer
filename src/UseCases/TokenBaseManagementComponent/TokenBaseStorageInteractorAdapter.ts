import {TokenbaseObject, TokenStatus} from './TokenBaseModule';

export default interface TokenBaseStorageInteractorAdapter{
    readAllTokenBases : () => Promise<TokenbaseObject[]>;
    writeATokenBase: (tokenBaseObject: TokenbaseObject) => Promise<void>;
    filterTokenBaseByStatus : (status: TokenStatus, date?: Date) => Promise<TokenbaseObject[]>;
    filterTokenByTokenDate: (date: Date) => Promise<TokenbaseObject[]>;
    resetTokenBase: () => Promise<void>;
    modifyATokenBase: (token: TokenbaseObject) => Promise<void>;
}