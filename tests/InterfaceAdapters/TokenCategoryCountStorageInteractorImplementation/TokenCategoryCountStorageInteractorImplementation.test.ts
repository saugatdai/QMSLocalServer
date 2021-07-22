import * as fs from 'fs';
import * as path from 'path';
import * as util from 'util';

import TokenCategoryCountStorageInteractorImplementation from '../../../src/InterfaceAdapters/TokenCategoryCountStorageInteractorImplementation';

import InteractorHelper from './InteractorHelper';

const writeFile = (filename: string, data: string) =>
  util.promisify(fs.writeFile)(filename, data, 'utf-8');

const tokenCategoryCountStoragePath = path.join(__dirname, '/tokenCategoryCount.json');

const tokenCategoryCountStorageInteractorImplementation = new TokenCategoryCountStorageInteractorImplementation(InteractorHelper);

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
    expect(async () => { await tokenCategoryCountStorageInteractorImplementation.getCurrentTokenCount(category) }).rejects.toThrow();
  });

  it('Shuold register a new token category', async () => {
    await tokenCategoryCountStorageInteractorImplementation.registerANewCategory(category, "test");
    const currentTokenCount = await tokenCategoryCountStorageInteractorImplementation.getCurrentTokenCount(category);
    expect(currentTokenCount).toBe(0);
  });

  it('Should reject creating existing token Category', async () => {
    expect(async () => { await tokenCategoryCountStorageInteractorImplementation.registerANewCategory(category, "test") }).rejects.toThrow();
  });

  it('Should create a new category in a non-empty collection', async () => {
    await tokenCategoryCountStorageInteractorImplementation.registerANewCategory(anotherCategory, "test");
    const currentCount = await tokenCategoryCountStorageInteractorImplementation.getCurrentTokenCount(anotherCategory);
    expect(currentCount).toBe(0);
  })


  it('Should get the current count of existing category', async () => {
    const currentCount = await tokenCategoryCountStorageInteractorImplementation.getCurrentTokenCount(category);
    const anotherCurrentCount = await tokenCategoryCountStorageInteractorImplementation.getCurrentTokenCount(anotherCategory);
    expect(currentCount).toBe(0);
    expect(anotherCurrentCount).toBe(0);
  });

  it('Should get update the current count of a category', async () => {
    await tokenCategoryCountStorageInteractorImplementation.updateCurrentTokenCount(5, category);
    await tokenCategoryCountStorageInteractorImplementation.updateCurrentTokenCount(15, anotherCategory);

    const currentCount = await tokenCategoryCountStorageInteractorImplementation.getCurrentTokenCount(category);
    const anotherCurrentCount = await tokenCategoryCountStorageInteractorImplementation.getCurrentTokenCount(anotherCategory);
    expect(currentCount).toBe(5);
    expect(anotherCurrentCount).toBe(15);
  });

  it('Should reset the current token count of a category', async () => {
    await tokenCategoryCountStorageInteractorImplementation.clearCurrentTokenCount(category);
    await tokenCategoryCountStorageInteractorImplementation.clearCurrentTokenCount(anotherCategory);

    const currentCount = await tokenCategoryCountStorageInteractorImplementation.getCurrentTokenCount(category);
    const anotherCurrentCount = await tokenCategoryCountStorageInteractorImplementation.getCurrentTokenCount(anotherCategory);

    expect(currentCount).toBe(0);
    expect(anotherCurrentCount).toBe(0);
  });

  it('Should set and get the latest customer count of a category', async () => {
    await tokenCategoryCountStorageInteractorImplementation.setLatestCustomerTokenCount(4, category);
    await tokenCategoryCountStorageInteractorImplementation.setLatestCustomerTokenCount(15, anotherCategory);

    const latestCustomerTokeNumber = await tokenCategoryCountStorageInteractorImplementation.getLatestCustomerTokenCount(category);
    const anotherLatestCustomerTokeNumber = await tokenCategoryCountStorageInteractorImplementation.getLatestCustomerTokenCount(anotherCategory);

    expect(latestCustomerTokeNumber).toBe(4);
    expect(anotherLatestCustomerTokeNumber).toBe(15);

  });

  it('Should get all the categories', async () => {
    const tokenCategories = await tokenCategoryCountStorageInteractorImplementation.getAllCategories();
    if (tokenCategories.length) {
      expect(tokenCategories[0]).toHaveProperty('categoryName');
    }
  });

  it('should update a category', async () => {
    await tokenCategoryCountStorageInteractorImplementation.registerANewCategory('L', 'LMAO');
    await tokenCategoryCountStorageInteractorImplementation.updateCategory('L', 'Any Name');
    const allCategories = await tokenCategoryCountStorageInteractorImplementation.getAllCategories();
    const updatedCategory = allCategories.find(category => category.category === 'L');
    expect(updatedCategory.categoryName).toEqual('Any Name');
  });

  it('Should delete a category', async () => {
    await tokenCategoryCountStorageInteractorImplementation.registerANewCategory('O', 'LMAO');
    await tokenCategoryCountStorageInteractorImplementation.deleteCategory('O');
    const allCategories = await tokenCategoryCountStorageInteractorImplementation.getAllCategories();
    const updatedCategory = allCategories.find(category => category.category === 'O');
    expect(updatedCategory).toBeFalsy();
  });


});