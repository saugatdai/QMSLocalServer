import TokenCategoryCountStorageImplementation from '../../../src/FrameworksAndDrivers/Drivers/TokenCategoryCountStorageImplementation';

import * as fs from 'fs';
import * as path from 'path';
import * as util from 'util';



const writeFile = (filename: string, data: string) =>
  util.promisify(fs.writeFile)(filename, data, 'utf-8');

const tokenCategoryCountStoragePath = path.join(__dirname, '../../../Data/tokenCategoryCount.json');


const category = 'C';
const anotherCategory = 'R';

describe('Testing of TokenCategoryCountStorageInteractorImplementation', () => {
  beforeAll(async () => {
    writeFile(tokenCategoryCountStoragePath, '');
  });

  afterAll(async () => {
    writeFile(tokenCategoryCountStoragePath, '');
  });

  it('Should throw an error for getting a current count from non-existing category', async () => {
    expect(async () => { await TokenCategoryCountStorageImplementation.getCurrentCount(category) }).rejects.toThrow();
  });

  it('Shuold register a new token category', async () => {
    await TokenCategoryCountStorageImplementation.registerANewCategory(category);
    const currentTokenCount = await TokenCategoryCountStorageImplementation.getCurrentCount(category);
    expect(currentTokenCount).toBe(0);
  });

  it('Should reject creating existing token Category', async () => {
    expect(async () => { await TokenCategoryCountStorageImplementation.registerANewCategory(category) }).rejects.toThrow();
  });

  it('Should create a new category in a non-empty collection', async () => {
    await TokenCategoryCountStorageImplementation.registerANewCategory(anotherCategory);
    const currentCount = await TokenCategoryCountStorageImplementation.getCurrentCount(anotherCategory);
    expect(currentCount).toBe(0);
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