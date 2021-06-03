import tokenCountStorageInteractorAdapter from "./TokenCategoryCountStorageInteractorAdapter";

export default class TokenCountManager {
  constructor(
    private tokenCountStorageInteractorAdapter: tokenCountStorageInteractorAdapter,
    private category: string
  ) { }

  public async presetTokenCount(count: number) {
    await this.tokenCountStorageInteractorAdapter.updateCurrentTokenCount(count, this.category);
  }

  public async resetTokenCount() {
    this.tokenCountStorageInteractorAdapter.clearCurrentTokenCount(this.category);
  }

  public async revcoverTokenCount() {
    const currentCount = await this.tokenCountStorageInteractorAdapter.getCurrentTokenCount(this.category);
    return currentCount;
  }

  public async createACategory(category: string) {
    await this.tokenCountStorageInteractorAdapter.registerANewCategory(category);
  }
}