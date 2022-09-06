import TokenCategoryCountStorageImplementation from '../src/FrameworksAndDrivers/Drivers/TokenCategoryCountStorageImplementation';

import * as fs from 'fs';
import * as path from 'path';
import * as util from 'util';
import { PrismaClient } from '@prisma/client';


const writeFile = (filename: string, data: string) =>
  util.promisify(fs.writeFile)(filename, data, 'utf-8');

const tokenCategoryCountStoragePath = path.join(__dirname, '../../../Data/tokenCategoryCount.json');

const prisma = new PrismaClient();

const category = 'C';
const anotherCategory = 'W';

describe('Testing of TokenCategoryCountStorageInteractorImplementation', () => {
  beforeAll(async () => {
    try{
      await prisma.tokenCategoryCount.delete({where: {category: category}});
      await prisma.tokenCategoryCount.delete({where: {category: anotherCategory}});
    }catch(error){

    }
  });

  afterAll(async () => {
    await prisma.tokenCategoryCount.delete({where: {category: category}});
    await prisma.tokenCategoryCount.delete({where: {category: anotherCategory}});
  });

  it('Shuold register a new token category', async () => {
    await TokenCategoryCountStorageImplementation.registerANewCategory(category, "test1");
    const categories = await prisma.tokenCategoryCount.findMany({
      where: {
        category: category
      }
    });

    expect(categories.length).toEqual(1);
  });

  it('Should reject creating existing token Category', async () => {
    expect(async () => { await TokenCategoryCountStorageImplementation.registerANewCategory(category, "test1") }).rejects.toThrow();
  });

  it('Should create a new category in a non-empty collection', async () => {
    await TokenCategoryCountStorageImplementation.registerANewCategory(anotherCategory, "test2");
    const category = await prisma.tokenCategoryCount.findMany({
      where: {
        category: anotherCategory
      }
    });

    expect(category.length).toBe(1);
  })


  it('Should get the current count of existing category', async () => {
    const currentCount = await TokenCategoryCountStorageImplementation.getCurrentCount(category);
    const anotherCurrentCount = await TokenCategoryCountStorageImplementation.getCurrentCount(anotherCategory);
    expect(currentCount).toBe(0);
    expect(anotherCurrentCount).toBe(0);
  });

  it('Should get update the current count of a category', async () => {
    await TokenCategoryCountStorageImplementation.updateCurrentCount(5, category);
    await TokenCategoryCountStorageImplementation.updateCurrentCount(15, anotherCategory);

    const currentCount = await TokenCategoryCountStorageImplementation.getCurrentCount(category);
    const anotherCurrentCount = await TokenCategoryCountStorageImplementation.getCurrentCount(anotherCategory);
    expect(currentCount).toBe(5);
    expect(anotherCurrentCount).toBe(15);
  });

  it('Should reset the current token count of a category', async () => {
    await TokenCategoryCountStorageImplementation.resetCount(category);
    await TokenCategoryCountStorageImplementation.resetCount(anotherCategory);

    const currentCount = await TokenCategoryCountStorageImplementation.getCurrentCount(category);
    const anotherCurrentCount = await TokenCategoryCountStorageImplementation.getCurrentCount(anotherCategory);

    expect(currentCount).toBe(0);
    expect(anotherCurrentCount).toBe(0);
  });

  it('Should set and get the latest customer token count', async () => {
    await TokenCategoryCountStorageImplementation.setLatestCustomerTokenCount(12, category);
    await TokenCategoryCountStorageImplementation.setLatestCustomerTokenCount(120, anotherCategory);

    const latestCustomerToken = await TokenCategoryCountStorageImplementation.getLatestCustomerTokenCount(category);
    const anotherLatestCustomerToken = await TokenCategoryCountStorageImplementation.getLatestCustomerTokenCount(anotherCategory);

    expect(latestCustomerToken).toBe(12);
    expect(anotherLatestCustomerToken).toBe(120);
  });



});