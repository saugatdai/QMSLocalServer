import tokenCountStorageInteractorAdapter from "./TokenCountStorageInteractorAdapter";

export default class TokenCountManager {
  constructor(
    private tokenCountStorageInteractorAdapter: tokenCountStorageInteractorAdapter
  ) {}

  public async presetTokenCount(count: number) {
    await this.tokenCountStorageInteractorAdapter.updateCurrentTokenCount(count);
  }

  public async resetTokenCount() {
    this.tokenCountStorageInteractorAdapter.clearCurrentTokenCount();
  }

  public async revcoverTokenCount() {
    const currentCount = await this.tokenCountStorageInteractorAdapter.getCurrentTokenCount();
    return currentCount;
  }

  public async clearTokenData() {
    await this.tokenCountStorageInteractorAdapter.clearAllTokenStatusData();
  }
}