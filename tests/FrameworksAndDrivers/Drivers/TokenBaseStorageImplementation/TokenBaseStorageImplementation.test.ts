import * as path from 'path';
import * as fs from 'fs';
import * as util from 'util';

import TokenBaseStorageImplementation from '../../../../src/FrameworksAndDrivers/Drivers/TokenBaseStorageImplementation';
import { tokenBaseObject1, tokenBaseObject2, tokenBaseObject3 } from './tokenBaseExporter';

const readFile = (filename: string) =>
  util.promisify(fs.readFile)(filename, 'utf-8');
const writeFile = (filename: string, data: string) =>
  util.promisify(fs.writeFile)(filename, data, 'utf-8');

const tokenBaseTestStoragePath = path.join(__dirname, '../../../../Data/tokenBase.json');

describe('Testing of TokenBaseStorageInteractorImplementation', () => {
  const tokenBaseArrays = [tokenBaseObject1, tokenBaseObject2, tokenBaseObject3];

  beforeAll(async () => {
    await writeFile(tokenBaseTestStoragePath, JSON.stringify(tokenBaseArrays));
  });

  afterAll(async () => {
    await writeFile(tokenBaseTestStoragePath, '');
  });

  it('Should get all tokenBases', async () => {
    const allTokenBases = await TokenBaseStorageImplementation.getAllTokenBases();
    expect(allTokenBases.length).toBe(3);
  });

  it('Should get next available tokenId in a category', async () => {
    const tokenId = await TokenBaseStorageImplementation.getNextAvailableTokenId();
    expect(tokenId).toBe(4);
  });

  it('Should reset tokenBasesCollection', async () => {
    await TokenBaseStorageImplementation.resetTokenBase();
    expect(async () => { await TokenBaseStorageImplementation.getAllTokenBases() }).rejects.toThrow();
  });

  it('Should read nextAvailable tokenID', async () => {
    const tokenId = await TokenBaseStorageImplementation.getNextAvailableTokenId();
    expect(tokenId).toBe(1);
  });

  it('Should add a tokenBase in an empty token base', async () => {
    await TokenBaseStorageImplementation.putATokenBase(tokenBaseObject1);
    const allTokenBases = await TokenBaseStorageImplementation.getAllTokenBases();
    expect(allTokenBases[0].getBaseObjectDetails().token.tokenNumber).toBe(1);
  });

  it('Should add a tokenBase in existing token base', async () => {
    await TokenBaseStorageImplementation.putATokenBase(tokenBaseObject2);
    const allTokenBases = await TokenBaseStorageImplementation.getAllTokenBases();
    expect(allTokenBases[1]).toEqual(tokenBaseObject2);
  });

});