import {TokenbaseObject, TokenStatus} from './TokenBaseModule';

export default interface TokenBaseStorageInteractorAdapter{
    readAllTokenBases : () => Promise<TokenbaseObject[]>;
    writeATokenBase: (tokenBaseObject: TokenbaseObject) => Promise<void>
}