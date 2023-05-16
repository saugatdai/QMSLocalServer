import { PrismaClient } from "@prisma/client";
import { TokenCountStorageAdapter } from "../../InterfaceAdapters/TokenCategoryCountStorageInteractorImplementation";


const prisma = new PrismaClient();

export type TokenStatusObject = {
  currentTokenCount: number;
  latestCustomerTokenCount: number;
  category: string,
  categoryName: string
}

const registerANewCategory = async (category: string, categoryName: string) => {
  const categories = await prisma.tokenCategoryCount.findMany({
    where: {
      category: category
    }
  });

  if(categories.length > 0){
    throw new Error('Category already exists...');
  }
  
  await prisma.tokenCategoryCount.create({
    data: {
      categoryName: categoryName,
      currentTokenCount: 0,
      latestCustomerTokenCount: 0,
      category: category
    }
  });
}

const getCurrentCount = async (category: string) => {
  const currentCount = await prisma.tokenCategoryCount.findFirst({
    where: {
      category: category
    },
    select: {
      currentTokenCount: true
    }
  });
  
  if(!currentCount){
    throw new Error('Failed to Get Category Count..');
  }
  return currentCount.currentTokenCount;
}

const resetCount = async (category: string) => {
  await prisma.tokenCategoryCount.update({
    where: {
      category: category
    },
    data: {
      currentTokenCount: 0
    }
  });
}

const updateCurrentCount = async (newCount: number, category: string) => {
  await prisma.tokenCategoryCount.update({
    where: {
      category: category
    },
    data: {
      currentTokenCount: newCount
    }
  });
}


const setLatestCustomerTokenCount = async (count: number, category: string) => {
  await prisma.tokenCategoryCount.update({
    data: {
      latestCustomerTokenCount: count
    },
    where: {
      category: category
    }
  });
}

const getLatestCustomerTokenCount = async (category: string) => {
  const latestCountData = await prisma.tokenCategoryCount.findFirst({
    where: {
      category: category
    },
    select: {
      latestCustomerTokenCount: true
    }
  })
  return latestCountData.latestCustomerTokenCount;
}

const getAllCategories = async () => {
  const allPrismaCategories = await prisma.tokenCategoryCount.findMany({});
  
  let tokenStatusCollection: TokenStatusObject[] = allPrismaCategories.map(prismaCategory => {
    const tokenStatus: TokenStatusObject = {
      category: prismaCategory.category,
      categoryName: prismaCategory.categoryName,
      currentTokenCount: prismaCategory.currentTokenCount,
      latestCustomerTokenCount: prismaCategory.latestCustomerTokenCount
    }

    return tokenStatus;
  });

  tokenStatusCollection = tokenStatusCollection.filter(tokenStatus => tokenStatus.category !== '!');

  return tokenStatusCollection;
}

const updateCategory = async (category: string, categoryName: string) => {
  await prisma.tokenCategoryCount.update({
    where: {
      category: category
    },
    data: {
      categoryName: categoryName
    }
  });
}

const deleteCategory = async (category: string) => {
  await prisma.tokenCategoryCount.delete({
    where: {
      category: category
    }
  });
}


const TokenCategoryCountStorageImplementation: TokenCountStorageAdapter = {
  updateCurrentCount,
  getCurrentCount,
  resetCount,
  registerANewCategory,
  setLatestCustomerTokenCount,
  getLatestCustomerTokenCount,
  getAllCategories,
  deleteCategory,
  updateCategory
}

export default TokenCategoryCountStorageImplementation;
