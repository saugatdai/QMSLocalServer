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
    await tokenCategoryCountStorageInteractorImplementation.registerANewCategory(category);
    const currentTokenCount = await tokenCategoryCountStorageInteractorImplementation.getCurrentTokenCount(category);
    expect(currentTokenCount).toBe(0);
  });

  it('Should reject creating existing token Category', async () => {
    expect(async () => { await tokenCategoryCountStorageInteractorImplementation.registerANewCategory(category) }).rejects.toThrow();
  });

  it('Should create a new category in a non-empty collection', async () => {
    await tokenCategoryCountStorageInteractorImplementation.registerANewCategory(anotherCategory);
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



});