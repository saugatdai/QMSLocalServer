
import TokenBaseStorageInteractorImplementation, { TokenBaseStorageAdapter } from '../../../src/InterfaceAdapters/TokenBaseStorageInteractorImplementation';
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

const tokenBaseStorageInteractorImplementation = new TokenBaseStorageInteractorImplementation(tokenBaseStorageAdapter);
describe('Testing of TokenBaseStorageInteractorImplementation', () => {
    const tokenBaseArrays = [tokenBaseObject1, tokenBaseObject2, tokenBaseObject3];

    beforeAll(async () => {
        await writeFile(tokenBaseTestStoragePath, JSON.stringify(tokenBaseArrays));
    });

    afterAll(async () => {
        await writeFile(tokenBaseTestStoragePath, '');
    });

    it('Should get all tokenBases', async () => {
        const allTokenBases = await tokenBaseStorageInteractorImplementation.readAllTokenBases();
        expect(allTokenBases.length).toBe(3);
    });

    it('Should reset tokenBasesCollection', async () => {
        await tokenBaseStorageInteractorImplementation.resetTokenBase();
        expect(async () => { await tokenBaseStorageInteractorImplementation.readAllTokenBases() }).rejects.toThrow();
    });

    it('Should add a tokenBase in an empty token base', async () => {
        await tokenBaseStorageInteractorImplementation.writeATokenBase(tokenBaseObject1);
        const allTokenBases = await tokenBaseStorageInteractorImplementation.readAllTokenBases();
        expect(allTokenBases[0].getBaseObjectDetails().token.tokenNumber).toBe(1);
    });

    it('Should add a tokenBase in existing token base', async () => {
        await tokenBaseStorageInteractorImplementation.writeATokenBase(tokenBaseObject2);
        const allTokenBases = await tokenBaseStorageInteractorImplementation.readAllTokenBases();
        expect(allTokenBases[1]).toEqual(tokenBaseObject2);
    });
});
