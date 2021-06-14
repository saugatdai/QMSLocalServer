import { TokenBaseObject, TokenStatus } from './TokenBaseModule';

export default interface TokenBaseStorageInteractorAdapter {
    readAllTokenBases: () => Promise<TokenBaseObject[]>;
    writeATokenBase: (TokenBaseObject: TokenBaseObject) => Promise<void>;
    filterTokenBaseByStatus: (status: TokenStatus, date?: Date) => Promise<TokenBaseObject[]>;
    filterTokenBaseByTokenDate: (date: string) => Promise<TokenBaseObject[]>;
    resetTokenBase: () => Promise<void>;
    modifyATokenBase: (token: TokenBaseObject) => Promise<void>;
    getTodaysTokenBaseByTokenNumber: (tokenNumber: number, cateogory?: string) => Promise<TokenBaseObject>;
    getNextAvailableTokenNumberInACategoryForToday: (tokenCategory: string) => Promise<number>;
    getTokenBasesByTokenCategory: (tokenBases: TokenBaseObject[], tokenCategory: string) => TokenBaseObject[];
    getTokenBaseByTokenId: (tokenId: number) => Promise<TokenBaseObject>;
}