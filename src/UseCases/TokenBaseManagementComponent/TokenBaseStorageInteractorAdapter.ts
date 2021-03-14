import { TokenBaseObject, TokenStatus } from './TokenBaseModule';

export default interface TokenBaseStorageInteractorAdapter {
    readAllTokenBases: () => Promise<TokenBaseObject[]>;
    writeATokenBase: (TokenBaseObject: TokenBaseObject) => Promise<void>;
    filterTokenBaseByStatus: (status: TokenStatus, date?: Date) => Promise<TokenBaseObject[]>;
    filterTokenByTokenDate: (date: string) => Promise<TokenBaseObject[]>;
    resetTokenBase: () => Promise<void>;
    modifyATokenBase: (token: TokenBaseObject) => Promise<void>;
    getTodaysTokenBaseByNumber: (tokenNumber: number) => Promise<TokenBaseObject>;
    getNextAvailableTokenNumber: () => Promise<number>;
}