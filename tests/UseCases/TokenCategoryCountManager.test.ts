import TokenCategoryCountStorageInteractorAdapter from '../../src/UseCases/TokenCategoryCountManagementComponent/TokenCategoryCountStorageInteractorAdapter';
import TokenCategoryCountManager from '../../src/UseCases/TokenCategoryCountManagementComponent/TokenCategoryCountManager';

const updateCurrentTokenCount = jest.fn();
const getCurrentTokenCount = jest.fn();
const clearCurrentTokenCount = jest.fn();
const registerANewCategory = jest.fn();

const interactorAdapter: TokenCategoryCountStorageInteractorAdapter = {
  updateCurrentTokenCount,
  getCurrentTokenCount,
  clearCurrentTokenCount,
  registerANewCategory
}

const category = 'A';

describe('Testing of tokenCategoryCountManager', () => {
  const tokenCategoryCountManager = new TokenCategoryCountManager(interactorAdapter, category);

  it('Should update current token count', () => {
    tokenCategoryCountManager.presetTokenCount(123);
    expect(updateCurrentTokenCount.mock.calls.length).toBe(1);
  });

  it('Should get current token count', () => {
    tokenCategoryCountManager.revcoverTokenCount();
    expect(getCurrentTokenCount.mock.calls.length).toBe(1);
  });

  it('Should clear current token count', () => {
    tokenCategoryCountManager.resetTokenCount();
    expect(clearCurrentTokenCount.mock.calls.length).toBe(1);
  });

  it('Should create a new category', () => {
    tokenCategoryCountManager.createACategory('A');
    expect(registerANewCategory.mock.calls.length).toBe(1);
  });
})