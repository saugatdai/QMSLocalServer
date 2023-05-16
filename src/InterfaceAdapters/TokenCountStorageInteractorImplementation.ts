import TokenCountStorageInteractorAdapter from '../UseCases/TokenCountManagementComponent/TokenCountStorageInteractorAdapter';
import Token from '../Entities/TokenCore/Token';

export interface TokenCountStorageAdapter {
    updateCurrentCount: (newCount: number) => Promise<void>;
    getCurrentCount: () => Promise<number>;
    resetCount: () => Promise<void>;
    setLatestCustomerTokenCount: (count: number) => Promise<void>;
    getLatestCustomerTokenCount: () => Promise<number>;
}

export default class TokenCountStorageInteractorImplementation implements TokenCountStorageInteractorAdapter {
    constructor(private tokenCountStorageAdapter: TokenCountStorageAdapter) { }

    public async clearCurrentTokenCount() {
        await this.tokenCountStorageAdapter.resetCount();
    }

    public async getCurrentTokenCount() {
        const currentCount = await this.tokenCountStorageAdapter.getCurrentCount();
        return currentCount;
    }

    public async updateCurrentTokenCount(newCount: number) {
        await this.tokenCountStorageAdapter.updateCurrentCount(newCount);
    }

    public async setLatestCustomerTokenCount(count: number) {
        await this.tokenCountStorageAdapter.setLatestCustomerTokenCount(count);
    }

    public async getLatestCustomerTokenCount() {
        const latestCount = await this.tokenCountStorageAdapter.getLatestCustomerTokenCount();
        return latestCount;
    }

}