import * as path from 'path';
import * as fs from 'fs';
import * as util from 'util';
import { TokenCountStorageAdapter } from '../../../src/InterfaceAdapters/TokenCategoryCountStorageInteractorImplementation';

export const readFile = (filename: string) =>
  util.promisify(fs.readFile)(filename, 'utf-8');
export const writeFile = (filename: string, data: string) =>
  util.promisify(fs.writeFile)(filename, data, 'utf-8');

type TokenStatusObject = {
  currentTokenCount: number;
  latestCustomerTokenCount: number;
  category: string
}
const tokenCountStatusStoragePath = path.join(__dirname, '/tokenCategoryCount.json');



const getTokenStatusObjectsCollection = async () => {
  const tokenStatusJSON = await readFile(tokenCountStatusStoragePath);
  if (!tokenStatusJSON) {
    return [];
  } else {
    const tokenStatusObjectsCollection = JSON.parse(tokenStatusJSON) as TokenStatusObject[];
    return tokenStatusObjectsCollection;
  }
}

const registerANewCategory = async (category: string) => {
  const tokenStatusObjectsCollection = await getTokenStatusObjectsCollection();
  const tokenStatusObject = tokenStatusObjectsCollection.find(tokenStatusObject => tokenStatusObject.category === category);
  if (!tokenStatusObject) {
    const newTokenStatusObject: TokenStatusObject = {
      category,
      currentTokenCount: 0,
      latestCustomerTokenCount: 0
    }
    tokenStatusObjectsCollection.push(newTokenStatusObject);
    await writeFile(tokenCountStatusStoragePath, JSON.stringify(tokenStatusObjectsCollection));
  } else {
    throw new Error('Category Already Exists');
  }


}

const getUpdatedTokenStatusObjectCollection = async (tokenStatusObject: TokenStatusObject) => {
  const tokenStatusObjectCollection = await getTokenStatusObjectsCollection();
  const updatedTokenStatusObjectCollection = tokenStatusObjectCollection.map(loopTokenStatusObject => {
    if (loopTokenStatusObject.category === tokenStatusObject.category) {
      return tokenStatusObject;
    }
    return loopTokenStatusObject;
  });
  return updatedTokenStatusObjectCollection;
}



const getCurrentCount = async (category: string) => {
  const tokenStatusObject = await getTokenStatusObject(category);
  if (!tokenStatusObject) {
    throw new Error("Category Doesn't exists");
  } else {
    return tokenStatusObject.currentTokenCount;
  }
}

const resetCount = async (category: string) => {
  const tokenStatusObject = await getTokenStatusObject(category);
  if (!tokenStatusObject) {
    throw new Error("Category Doesn't exists");
  } else {
    tokenStatusObject.currentTokenCount = 0;
    const updatedTokenStatusObjectCollection = await getUpdatedTokenStatusObjectCollection(tokenStatusObject);
    await writeFile(tokenCountStatusStoragePath, JSON.stringify(updatedTokenStatusObjectCollection));
  }
}

const updateCurrentCount = async (newCount: number, category: string) => {
  const tokenStatusObject = await getTokenStatusObject(category);
  if (!tokenStatusObject) {
    throw new Error("Category Doesn't Exists");
  } else {
    tokenStatusObject.currentTokenCount = newCount;
    const updatedTokenStatusObjectCollection = await getUpdatedTokenStatusObjectCollection(tokenStatusObject);
    await writeFile(tokenCountStatusStoragePath, JSON.stringify(updatedTokenStatusObjectCollection));
  }
}

const setLatestCustomerTokenCount = async (count: number, category: string) => {
  const tokenStatusObject = await getTokenStatusObject(category);
  tokenStatusObject.latestCustomerTokenCount = count;
  const updatedCollection = await getUpdatedTokenStatusObjectCollection(tokenStatusObject);
  await writeFile(tokenCountStatusStoragePath, JSON.stringify(updatedCollection));
}

const getLatestCustomerTokenCount = async (category: string) => {
  const tokenStatusObject = await getTokenStatusObject(category);
  return tokenStatusObject.latestCustomerTokenCount;
}

const getTokenStatusObject = async (category: string) => {
  const tokenStatusObjectsCollection = await getTokenStatusObjectsCollection();
  const tokenStatusObject = tokenStatusObjectsCollection.find(tokenStatusObject => tokenStatusObject.category === category);
  return tokenStatusObject;
}

const tokenCategoryCountStorageImplementation: TokenCountStorageAdapter = {
  updateCurrentCount,
  getCurrentCount,
  resetCount,
  registerANewCategory,
  setLatestCustomerTokenCount,
  getLatestCustomerTokenCount
}

export default tokenCategoryCountStorageImplementation;