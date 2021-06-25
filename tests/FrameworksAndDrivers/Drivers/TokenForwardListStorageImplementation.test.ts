import Token from "../../../src/Entities/TokenCore/Token";
import { TokenForwardObject } from "../../../src/UseCases/TokenForwardListManagement/TokenForwardListManager";
import { tokenForwardListStorageImplementation } from "../../../src/FrameworksAndDrivers/Drivers/TokenForwardListStorageImplementation";
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


token2.date.setMonth(9);
token3.date.setMonth(10);

const tokenForwardObject1 = createTokenForwardObject('1', [token2, token3]);
const tokenForwardObject2 = createTokenForwardObject('2', [token1]);
const tokenForwardObject3 = createTokenForwardObject('3', [token4, token5, token6, token7]);
const tokenForwardObject4 = createTokenForwardObject('3', [token8]);
const tokenForwardObject5 = createTokenForwardObject('4', [token9, token10]);


describe('Testing of TokenForwardListStorageImplementation', () => {
  beforeAll(async () => {
    await tokenForwardListStorageImplementation.writeTokenForwardList([]);
  });

  afterAll(async () => {
    await tokenForwardListStorageImplementation.writeTokenForwardList([]);
  });

  it('Should get empty data for reading empty list', async () => {
    const allTokenForwardObjects = await tokenForwardListStorageImplementation.getTokenForwardList();
    expect(allTokenForwardObjects.length).toBe(0)
  });

  it('Should write data to the list', async () => {
    await tokenForwardListStorageImplementation.writeTokenForwardList([tokenForwardObject1, tokenForwardObject2, tokenForwardObject3, tokenForwardObject4, tokenForwardObject5]);
    const allTokenForwardListObjects = await tokenForwardListStorageImplementation.getTokenForwardList();
    expect(allTokenForwardListObjects.length).toBe(5);
  });
})
