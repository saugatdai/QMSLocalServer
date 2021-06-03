import TokenCategoryCountStorageInteractorAdapter from '../UseCases/TokenCategoryCountManagementComponent/TokenCategoryCountStorageInteractorAdapter';
import Token from '../Entities/TokenCore/Token';

export interface TokenCountStorageAdapter {
  updateCurrentCount: (newCount: number, category: string) => Promise<void>;
  getCurrentCount: (category: string) => Promise<number>;
  resetCount: (category: string) => Promise<void>;
  registerANewCategory: (category: string) => Promise<void>;
}

export default class TokenCountStorageInteractorImplementation implements TokenCategoryCountStorageInteractorAdapter {
  constructor(private tokenCountStorageAdapter: TokenCountStorageAdapter) { }

  public async clearCurrentTokenCount(category: string) {
    await this.tokenCountStorageAdapter.resetCount(category);
  }

  public async getCurrentTokenCount(category: string) {
    const currentCount = await this.tokenCountStorageAdapter.getCurrentCount(category);
    return currentCount;
  }

  public async updateCurrentTokenCount(newCount: number, category: string) {
    await this.tokenCountStorageAdapter.updateCurrentCount(newCount, category);
  }

  public async registerANewCategory(category: string) {
    await this.tokenCountStorageAdapter.registerANewCategory(category);
  }

}