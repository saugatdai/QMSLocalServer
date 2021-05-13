import { tokenBaseObject1, tokenBaseObject2, tokenBaseObject3 } from './tokenBaseExporter';
import { TokenBaseObject, TokenStatus } from '../../../src/UseCases/TokenBaseManagementComponent/TokenBaseModule';
import TokenBaseStorageInteractorAdapter from '../../../src/UseCases/TokenBaseManagementComponent/TokenBaseStorageInteractorAdapter';
import TokenBaseManager from '../../../src/UseCases/TokenBaseManagementComponent/TokenBaseManager';

let allTokenBases = [tokenBaseObject1, tokenBaseObject2, tokenBaseObject3];

const writeATokenBaseMockFunction = jest.fn();
const writeATokenBaseFunction = async (tokenBase: TokenBaseObject) => {
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

const getTodaysTokenBaseByTokenNumber = async (tokenNumber: number, category?: string) => {
  let todaysTokenBase: TokenBaseObject;
  if (category) {
    todaysTokenBase = allTokenBases.find(tokenBase => {
      return tokenBase.token.date.getDate() === new Date().getDate() &&
        tokenBase.token.tokenNumber === tokenNumber && tokenBase.token.tokenCategory === category;
    });
  } else {
    todaysTokenBase = allTokenBases.find(tokenBase => {
      return tokenBase.token.date.getDate() === new Date().getDate() &&
        tokenBase.token.tokenNumber === tokenNumber;
    });
  }
  return todaysTokenBase;
}

const getNextAvailableTokenNumberInACategory = async (tokenCateogry: String) => {
  let highestNumber = 0;
  if (tokenCateogry) {
    allTokenBases.forEach(tokenBase => {
      if (tokenBase.token.tokenCategory === tokenCateogry) {
        highestNumber = tokenBase.token.tokenNumber > highestNumber ? tokenBase.token.tokenNumber : highestNumber;
      }
    });
  } else {
    allTokenBases.forEach(tokenBase => {
      highestNumber = tokenBase.token.tokenNumber > highestNumber ? tokenBase.token.tokenNumber : highestNumber
    });
  }
  return highestNumber + 1;
}

const getTokenBasesByTokenCategory = (tokenBases: TokenBaseObject[], tokenCategory: string) => {
  return tokenBases.filter(tokenBase => tokenBase.token.tokenCategory === tokenCategory);
}

const getTokenBaseByTokenId = async (tokenId: number) => {
  return allTokenBases.find(tokenBase => tokenBase.token.tokenId === tokenId);
}

const tokenBaseStorageInteractorAdapter: TokenBaseStorageInteractorAdapter = {
  filterTokenBaseByStatus: filterTokenBaseByStatus,
  filterTokenBaseByTokenDate: filterTokenBaseByTokenDate,
  getNextAvailableTokenNumberInACategory: getNextAvailableTokenNumberInACategory,
  getTodaysTokenBaseByTokenNumber: getTodaysTokenBaseByTokenNumber,
  modifyATokenBase: modifyATokenBase,
  readAllTokenBases: readAllTokenBases,
  resetTokenBase: resetTokenBaseFunction,
  writeATokenBase: writeATokenBaseFunction,
  getTokenBasesByTokenCategory: getTokenBasesByTokenCategory,
  getTokenBaseByTokenId: getTokenBaseByTokenId
}


describe('Testing of TokenBaseModule', () => {
  describe('testing of TokenBaseManagementInteractorAdapter', () => {
    it('should filterTokenBaseByStatus', async () => {
      const filteredTokenBases = await tokenBaseStorageInteractorAdapter.filterTokenBaseByStatus(TokenStatus.CALLAGAIN);
      expect(filteredTokenBases.length).toBe(1);
    });

    it('Should filter a token by status with date', async () => {
      const date = new Date();
      date.setDate(12);

      const filteredTokenBases = await tokenBaseStorageInteractorAdapter.filterTokenBaseByStatus(TokenStatus.PROCESSED, date);
      filteredTokenBases.forEach(tokenBase => {
        expect(tokenBase.token.date.getDate()).toBe(12);
      });
    })

    it('Should filter token by Token Date', async () => {
      const date = new Date();
      date.setDate(12);

      const filteredTokenBases = await tokenBaseStorageInteractorAdapter.filterTokenBaseByTokenDate(date.toLocaleDateString());
      filteredTokenBases.forEach(tokenBase => {
        expect(tokenBase.token.date.getDate()).toBe(12);
      });
    });

    it('Should get next available token number', async () => {
      const nextAvailableTokenNumberInCateogoryA = await tokenBaseStorageInteractorAdapter.getNextAvailableTokenNumberInACategory('A');
      expect(nextAvailableTokenNumberInCateogoryA).toBe(3);
    });

    it('Should get Todays token base by token number', async () => {
      const tokenBase = await tokenBaseStorageInteractorAdapter.getTodaysTokenBaseByTokenNumber(3);
      expect(tokenBase.token.tokenNumber).toBe(3);
    });

    it('Should get Todays token base by token number and token category', async () => {
      const tokenBase = await tokenBaseStorageInteractorAdapter.getTodaysTokenBaseByTokenNumber(1, 'A');
      expect(tokenBase.token.tokenCategory).toBe('A');
      expect(tokenBase.token.tokenNumber).toBe(1);
    });

    it('Should modify an existing token base', async () => {
      const tokenBaseToBeModified = allTokenBases[0];
      tokenBaseToBeModified.currentStatus = TokenStatus.UNPROCESSED;
      await tokenBaseStorageInteractorAdapter.modifyATokenBase(tokenBaseToBeModified);
      expect(allTokenBases[0].currentStatus).toBe(TokenStatus.UNPROCESSED);
    });

    it('Should read all token bases', async () => {
      const tokenBases = await tokenBaseStorageInteractorAdapter.readAllTokenBases();
      expect(tokenBases.length).toBe(3);
    });

    it('Should write a token base', async () => {
      const tokenBase = allTokenBases[2];
      await tokenBaseStorageInteractorAdapter.writeATokenBase(tokenBase);
      expect(writeATokenBaseMockFunction.mock.calls.length).toBe(1);
    });

    it('Should get token base by category', () => {
      const tokenBasesOfCategoryA = tokenBaseStorageInteractorAdapter.getTokenBasesByTokenCategory(allTokenBases, 'C');
      expect(tokenBasesOfCategoryA.length).toBe(1);
    });

    it('Should get token by tokenId', async () => {
      const tokenBase = await tokenBaseStorageInteractorAdapter.getTokenBaseByTokenId(1);
      expect(tokenBase.token.tokenId).toBe(1);
    });

  });

  describe('Testing of TokenBaseManager', () => {
    const tokenBase = allTokenBases[0];
    const tokenBaseManager = new TokenBaseManager(tokenBaseStorageInteractorAdapter);
    tokenBaseManager.tokenBase = tokenBase;

    it('Should create a new tokenBase', async () => {
      await tokenBaseManager.createATokenBase();
      expect(writeATokenBaseMockFunction.mock.calls.length).toBe(2);
    });

    it('Should update an existing token', async () => {
      tokenBaseManager.tokenBase.currentStatus = TokenStatus.BYPASS;
      tokenBaseManager.updateTokenBase();
      expect(allTokenBases[0].currentStatus).toBe(TokenStatus.BYPASS);
    });
  });
});