import TokenBaseStorageImplementation from '../../src/FrameworksAndDrivers/Drivers/TokenBaseStorageImplementation';
import { tokenBaseObject1, tokenBaseObject2, tokenBaseObject3 } from './tokenBaseExporter';

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

describe('Testing of TokenBaseStorageInteractorImplementation', () => {

  beforeAll(async () => {
    await TokenBaseStorageImplementation.putATokenBase(tokenBaseObject1);
    await TokenBaseStorageImplementation.putATokenBase(tokenBaseObject2);
    await TokenBaseStorageImplementation.putATokenBase(tokenBaseObject3);
  });

  afterAll(async () => {
    await TokenBaseStorageImplementation.resetTokenBase();
    await prisma.tokenCategoryCount.delete({
      where: {
        category: 'A'
      }
    })
  });

  it('Should get all tokenBases', async () => {
    const allTokenBases = await TokenBaseStorageImplementation.getAllTokenBases();
    expect(allTokenBases.length).toBe(3);
  });

  it('Should get next available tokenId in a category', async () => {
    const greatestToken = await prisma.tokenBaseObject.findFirst({
      orderBy: {
        tokenId: 'desc'
      }
    });

    const tokenId = await TokenBaseStorageImplementation.getNextAvailableTokenId();
    expect(tokenId).toBe(greatestToken.tokenId + 1);
  });

  it('Should reset tokenBasesCollection', async () => {
    await TokenBaseStorageImplementation.resetTokenBase();
    expect(async () => { await TokenBaseStorageImplementation.getAllTokenBases() }).rejects.toThrow();
  });

  it('Should add a tokenBase in an empty token base', async () => {
    await TokenBaseStorageImplementation.putATokenBase(tokenBaseObject1);
    const allTokenBases = await TokenBaseStorageImplementation.getAllTokenBases();
    expect(allTokenBases.length).toBe(1);
  });

});