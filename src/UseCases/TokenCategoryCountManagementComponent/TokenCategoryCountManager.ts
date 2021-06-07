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

  public async recoverTokenCount() {
    const currentCount = await this.tokenCountStorageInteractorAdapter.getCurrentTokenCount(this.category);
    return currentCount;
  }

  public async createACategory(category: string) {
    await this.tokenCountStorageInteractorAdapter.registerANewCategory(category);
  }

  public async setLatestCustomerTokenCount(count: number) {
    await this.tokenCountStorageInteractorAdapter.setLatestCustomerTokenCount(count, this.category);
  }

  public async getLatestCustomerTokenCount() {
    const latestCount = await this.tokenCountStorageInteractorAdapter.getLatestCustomerTokenCount(this.category);
    return latestCount;
  }
}