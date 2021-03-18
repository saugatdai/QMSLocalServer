
import { TokenBaseStorageAdapter } from '../../../src/InterfaceAdapters/TokenBaseStorageInteractorImplementation';
import {
    readFile,
    writeFile,
    tokenBaseTestStoragePath,
    getAllTokenBases,
    putATokenBase,
    getTokenBasesByStatus,
    getTokenBaseByTokenDate,
    resetTokenBase,
    editATokenBase,
    readTodaysTokenBaseByTokenNumber,
    readNextAvailableTokenNumberInACategory,
    readTokenBasesByTokenCategory,
    readTokenBaseByTokenId
} from './InteractorHelper';

import { tokenBaseObject1, tokenBaseObject2, tokenBaseObject3 } from './tokenBaseExporter';


const tokenBaseStorageAdapter: TokenBaseStorageAdapter = {
    getAllTokenBases,
    putATokenBase,
    getTokenBasesByStatus,
    getTokenBaseByTokenDate,
    resetTokenBase,
    editATokenBase,
    readTodaysTokenBaseByTokenNumber,
    readNextAvailableTokenNumberInACategory,  
    readTokenBasesByTokenCategory, 
    readTokenBaseByTokenId
}

describe('Testing of TokenBaseStorageInteractorImplementation', () => {
    it('Should always return true', () => {
        expect(true).toBeTruthy();
    });
});
