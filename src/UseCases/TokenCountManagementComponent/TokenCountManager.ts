import tokenCountStorageInteractorAdapter from "./TokenCountStorageInteractorAdapter";

export default class TokenCountManager {
  constructor(
    private tokenCountStorageInteractorAdapter: tokenCountStorageInteractorAdapter
  ) {}

  public presetTokenCount(count: number) {
    this.tokenCountStorageInteractorAdapter.updateCurrentTokenCount(count);
  }

  public resetTokenCount() {
    this.tokenCountStorageInteractorAdapter.clearCurrentTokenCount();
  }

  public revcoverTokenCount() {
    return this.tokenCountStorageInteractorAdapter.getCurrentTokenCount();
  }
}