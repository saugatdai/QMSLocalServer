import TokenForwardListManager,
{ TokenForwardListStorageInteractorAdapter } from "../../src/UseCases/TokenForwardListManagement/TokenForwardListManager";

const addTokenForwardObjectMock = jest.fn();
const tokenForwardObjectsMock = jest.fn();
const tokenForwardObjectByOperatorMock = jest.fn();
const deleteATokenForwardObjectMock = jest.fn();
const deleteAllTokenForwardObjectsMock = jest.fn();
const removeAllExceptForTodayMock = jest.fn();

const addTokenForwardObject = async () => {
  addTokenForwardObjectMock();
}
const tokenForwardObjects = async () => {
  tokenForwardObjectsMock();
  return null;
}

const tokenForwardObjectByCounter = async () => {
  tokenForwardObjectByOperatorMock();
  return null;
}

const deleteAForwardedToken = async () => {
  deleteATokenForwardObjectMock();
}

const deleteAllTokenForwardObjects = async () => {
  deleteAllTokenForwardObjectsMock();
}

const removeAllExceptForToday = async () => {
  removeAllExceptForTodayMock();
}

const tokenForwardStorageInteractor: TokenForwardListStorageInteractorAdapter = {
  addTokenForwardObject,
  tokenForwardObjects,
  tokenForwardObjectByCounter,
  deleteAForwardedToken,
  deleteAllTokenForwardObjects,
  removeAllExceptForToday
}

const tokenForwardListManager = new TokenForwardListManager(tokenForwardStorageInteractor);

describe('Testing of TokenForwardListManager', () => {
  it('Should storeTokenForwardObject', async () => {
    await tokenForwardListManager.storeATokenForwardObject(null);
    expect(addTokenForwardObjectMock.mock.calls.length).toBe(1);
  });
  it('should get all token forward objects', async () => {
    await tokenForwardListManager.getAllTokenForwardObjects();
    expect(tokenForwardObjectsMock.mock.calls.length).toBe(1);
  })
  it('Should get tokenForwardObject by operator', async () => {
    await tokenForwardListManager.getTokenForwardObjectByCounter(null);
    expect(tokenForwardObjectByOperatorMock.mock.calls.length).toBe(1);
  });
  it('Should remove a tokenForwardObject by operator', async () => {
    await tokenForwardListManager.removeForwardedToken(null, null);
    expect(deleteATokenForwardObjectMock.mock.calls.length).toBe(1);
  });
  it('Should clear all tokenForwardObject ', async () => {
    await tokenForwardListManager.clearAllTokenForwardObject();
    expect(deleteAllTokenForwardObjectsMock.mock.calls.length).toBe(1);
  });
  it('Should keep only todays tokenForwardObjects', async () => {
    await tokenForwardListManager.keepOnlyTodaysTokenForwardObject();
    expect(removeAllExceptForTodayMock.mock.calls.length).toBe(1);
  });
});