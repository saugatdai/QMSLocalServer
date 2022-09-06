import { PrismaClient } from '@prisma/client';

import { TokenCountStorageAdapter } from '../../../src/InterfaceAdapters/TokenCountStorageInteractorImplementation';

const prisma = new PrismaClient();

type TokenStatusObject = {
  currentTokenCount: number;
  latestCustomerTokenCount: number;
}
const getCurrentCount = async () => {
  let categoryObject = await prisma.tokenCategoryCount.findFirst({
    where: {
      category: '!'
    }
  });

  if(!categoryObject){
    categoryObject = await prisma.tokenCategoryCount.create({
      data: {
        category: '!',
        categoryName: 'General',
        currentTokenCount: 0,
        latestCustomerTokenCount: 0
      }
    })
  }

  return categoryObject.currentTokenCount;
}

const resetCount = async () => {
  await prisma.tokenCategoryCount.update({
    where: {
      category: '!'
    },
    data: {
      currentTokenCount: 0
    }
  });
}

const updateCurrentCount = async (newCount: number) => {
  await prisma.tokenCategoryCount.update({
    data: {
      currentTokenCount: newCount
    },
    where: {
      category: '!'
    }
  });
}

const setLatestCustomerTokenCount = async (count: number) => {
  await prisma.tokenCategoryCount.update({
    where: {
      category: '!'
    },
    data: {
      latestCustomerTokenCount: count
    }
  });
}

const getLatestCustomerTokenCount = async () => {
  const customerCountObject = await prisma.tokenCategoryCount.findFirst({
    where: {
      category: '!'
    },
    select: {
      latestCustomerTokenCount: true
    }
  });

  return customerCountObject.latestCustomerTokenCount;
}

const TokenCountStorageImplementation: TokenCountStorageAdapter = {
  updateCurrentCount,
  getCurrentCount,
  resetCount,
  setLatestCustomerTokenCount,
  getLatestCustomerTokenCount
};

export default TokenCountStorageImplementation;