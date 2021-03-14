import { tokenBaseObject1, tokenBaseObject2, tokenBaseObject3 } from './tokenBaseExporter';
import { TokenBaseObject, TokenStatus } from '../../../src/UseCases/TokenBaseManagementComponent/TokenBaseModule';
import TokenBaseStorageInteractorAdapter from '../../../src/UseCases/TokenBaseManagementComponent/TokenBaseStorageInteractorAdapter';

let allTokenBases = [tokenBaseObject1, tokenBaseObject2, tokenBaseObject3];

const writeATokenBaseMockFunction = jest.fn();
const writeATokenBaseFunction = async () => {
  writeATokenBaseMockFunction();
}

const readAllTokenBases = async () => {
  return allTokenBases;
}

const filterTokenBaseByStatus = async (status: TokenStatus, date?: Date) => {
  if (date) {
    return allTokenBases.filter(tokenBase =>
      tokenBase.currentStatus === status &&
      tokenBase.token.date.getDate() === date.getDate() &&
      tokenBase.token.date.getMonth() === date.getMonth() &&
      tokenBase.token.date.getFullYear() === date.getFullYear()
    );
  } else {
    return allTokenBases.filter(tokenBase => {
      return tokenBase.currentStatus === status;
    });
  }
}

const filterTokenBaseByTokenDate = async (date: string) => {
  const filterDate = new Date(date);
  return allTokenBases.filter(tokenBase => {
    const loopTokenDate = new Date(tokenBase.getBaseObjectDetails().token.date);
    return (loopTokenDate.getDate() === filterDate.getDate() &&
      loopTokenDate.getFullYear() === filterDate.getFullYear() &&
      loopTokenDate.getMonth() === filterDate.getMonth());
  });
}

const resetTokenBaseMockFunction = jest.fn();
const resetTokenBaseFunction = async () => {
  resetTokenBaseMockFunction();
}

const modifyATokenBase = async (tokenBase: TokenBaseObject) => {
  allTokenBases = allTokenBases.map(looptokenBase => {
    if (tokenBase.token.date.getTime() === looptokenBase.token.date.getTime()
      && tokenBase.token.tokenNumber === looptokenBase.token.tokenNumber) {
      return tokenBase;
    }
    return looptokenBase;
  });
}

const getTodaysTokenBaseByNumber = async (tokenNumber: number) => {
  const todaysTokenBase = allTokenBases.find(tokenBase => {
    return tokenBase.token.date.getDate() === new Date().getDate() &&
      tokenBase.token.tokenNumber === tokenNumber;
  });
  return todaysTokenBase;
}

const getNextAvailableTokenNumber = async () => {
  let highestNumber = 0;
  allTokenBases.forEach(tokenBase => {
    highestNumber = tokenBase.token.tokenNumber > highestNumber ? tokenBase.token.tokenNumber : highestNumber;
  });
  return highestNumber + 1;
}

const tokenBaseStorageInteractorAdapter: TokenBaseStorageInteractorAdapter = {
  filterTokenBaseByStatus: filterTokenBaseByStatus,
  filterTokenByTokenDate: filterTokenBaseByTokenDate,
  getNextAvailableTokenNumber: getNextAvailableTokenNumber,
  getTodaysTokenBaseByNumber: getTodaysTokenBaseByNumber,
  modifyATokenBase: modifyATokenBase,
  readAllTokenBases: readAllTokenBases,
  resetTokenBase: resetTokenBaseFunction,
  writeATokenBase: writeATokenBaseFunction
}


describe('testing of TokenBaseManagementInteractorAdapter', () => {
  it('should filterTokenBaseByStatus', async () => {
    const filteredTokenBases = await tokenBaseStorageInteractorAdapter.filterTokenBaseByStatus(TokenStatus.CALLAGAIN);
    expect(filteredTokenBases.length).toBe(1);
  });

  it('Should filter a token by status with date', async () => {
    const date = new Date();
    date.setDate(12);

    const filteredTokenBases = await tokenBaseStorageInteractorAdapter.filterTokenBaseByStatus(TokenStatus.PROCESSED, date);
    expect(filteredTokenBases.length).toBe(1);
  })

  it('Should filter token by Token Date', async () => {
    const date = new Date();
    date.setDate(12);

    const filteredTokenBases = await tokenBaseStorageInteractorAdapter.filterTokenByTokenDate(date.toLocaleDateString());
    expect(filteredTokenBases.length).toBe(1);
  });

});