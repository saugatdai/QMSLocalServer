import tokenCountStorageInteractorAdapter from "./TokenCountStorageInteractorAdapter";

export default class TokenCountManager {
  constructor(
    private tokenCountStorageInteractorAdapter: tokenCountStorageInteractorAdapter
  ) { }

  public async presetTokenCount(count: number) {
    await this.tokenCountStorageInteractorAdapter.updateCurrentTokenCount(count);
  }

  public async resetTokenCount() {
    await this.tokenCountStorageInteractorAdapter.clearCurrentTokenCount();
  }

  public async revcoverTokenCount() {
    const currentCount = await this.tokenCountStorageInteractorAdapter.getCurrentTokenCount();
    return currentCount;
  }

  public async setLatestCustomerTokenCount(count: number) {
    await this.tokenCountStorageInteractorAdapter.setLatestCustomerTokenCount(count);
  }

  public async getLatestCustomerTokenCount() {
    const latestCount = await this.tokenCountStorageInteractorAdapter.getLatestCustomerTokenCount();
    return latestCount;
  }
}