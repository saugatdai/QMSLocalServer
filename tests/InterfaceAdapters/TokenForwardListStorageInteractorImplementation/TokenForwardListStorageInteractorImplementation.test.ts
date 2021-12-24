import Token from "../../../src/Entities/TokenCore/Token";
import TokenForwardListStorageInteractorImplementation from "../../../src/InterfaceAdapters/TokenForwardListStorageInteractorImplementation";
import { tokenForwardListStorageImplementation } from "./InteractorHelper";
import { TokenForwardObject } from "../../../src/UseCases/TokenForwardListManagement/TokenForwardListManager";

const createTokens = (tokenId: number, tokenNumber: number) => {
  const token: Token = {
    tokenId: tokenId,
    tokenNumber: tokenNumber,
    date: new Date()
  }

  return token;
}

const createTokenForwardObject = (counter: string, tokens: Token[]) => {
  const tokenForwardObject: TokenForwardObject = { counter, tokens };
  return tokenForwardObject;
}

const token1 = createTokens(1, 1);
const token2 = createTokens(2, 2);
const token3 = createTokens(3, 3);
const token4 = createTokens(4, 4);
const token5 = createTokens(5, 5);
const token6 = createTokens(6, 6);
const token7 = createTokens(7, 7);
const token8 = createTokens(8, 8);
const token9 = createTokens(9, 9);
const token10 = createTokens(10, 10);


token2.date.setMonth(11);
token3.date.setMonth(12);

const tokenForwardObject1 = createTokenForwardObject('1', [token2, token3]);
const tokenForwardObject2 = createTokenForwardObject('2', [token1]);
const tokenForwardObject3 = createTokenForwardObject('3', [token4, token5, token6, token7]);
const tokenForwardObject4 = createTokenForwardObject('3', [token8]);
const tokenForwardObject5 = createTokenForwardObject('4', [token9, token10]);

describe('Testing of tokenForwardListStorageInteractorImplementation', () => {
  beforeAll(async () => {
    tokenForwardListStorageImplementation.writeTokenForwardList([]);
  });

  afterAll(async () => {
    tokenForwardListStorageImplementation.writeTokenForwardList([]);
  });
  const tokenForwardListStorageInteractorImplementation = new TokenForwardListStorageInteractorImplementation(tokenForwardListStorageImplementation);

  it('Should insert tokenForwardObject in list', async () => {
    await tokenForwardListStorageInteractorImplementation.addTokenForwardObject(tokenForwardObject1);
    await tokenForwardListStorageInteractorImplementation.addTokenForwardObject(tokenForwardObject2);
    await tokenForwardListStorageInteractorImplementation.addTokenForwardObject(tokenForwardObject3);

    const allTokens = await tokenForwardListStorageInteractorImplementation.tokenForwardObjects();
    expect(allTokens.length).toBe(3);
  });

  it('Should remove a token from a tokenForwardObject', async () => {
    await tokenForwardListStorageInteractorImplementation.deleteAForwardedToken('3', token5);
    const tokenBaseObject = await tokenForwardListStorageInteractorImplementation.tokenForwardObjectByCounter('3');
    expect(tokenBaseObject.tokens.length).toBe(3);
  });

  it('Should remove a token from a tokenForwardObject and delete the object as well if it has no token', async () => {
    await tokenForwardListStorageInteractorImplementation.deleteAForwardedToken('2', token1);
    const tokenForwardObject = await tokenForwardListStorageInteractorImplementation.tokenForwardObjectByCounter('2');
    expect(tokenForwardObject).toBeUndefined();
  });

  it('Should add a forward token to a counter', async () => {
    await tokenForwardListStorageInteractorImplementation.addTokenForwardObject(tokenForwardObject4);
    const tokenForwardObject = await tokenForwardListStorageInteractorImplementation.tokenForwardObjectByCounter('3');
    expect(tokenForwardObject.tokens.length).toBe(4);
  });

  it('Should remove all tokenForwardObjects of otherdays except for today', async () => {
    await tokenForwardListStorageInteractorImplementation.addTokenForwardObject(tokenForwardObject5);
    await tokenForwardListStorageInteractorImplementation.removeAllExceptForToday();
    const tokenForwardObjects = await tokenForwardListStorageInteractorImplementation.tokenForwardObjects();
    expect(tokenForwardObjects.length).toBe(3);
  });

});