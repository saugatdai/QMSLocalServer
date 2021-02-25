import TokenCountStorageInteractorAdapter from '../UseCases/TokenCountManagementComponent/TokenCountStorageInteractorAdapter';
import Token from '../Entities/TokenCore/Token';

export interface TokenCountStorageAdapter{
    updateCurrentCount: (newCount: number) => Promise<void>;
    getCurrentCount: () => Promise<number>;
    resetCount: () => Promise<void>;
    clearAllTokenStatusData: () => Promise<void>;
    getCurrentCustoemrTokenNumber: () => Promise<number>;
    setCurrentCustomerTokenNumber: (newTokenNumber: number) => void;  
}

export default class TokenCountStorageInteractorImplementation implements TokenCountStorageInteractorAdapter{
    constructor(private tokenCountStorageAdapter: TokenCountStorageAdapter){}

    public async clearCurrentTokenCount() {
        await this.tokenCountStorageAdapter.resetCount();
    }

    public async getCurrentTokenCount() {
        const currentCount = await this.tokenCountStorageAdapter.getCurrentCount();
        return currentCount;
    }

    public async updateCurrentTokenCount(newCount: number){
        await this.tokenCountStorageAdapter.updateCurrentCount(newCount);
    }

    public async clearAllTokenStatusData() {
        await this.tokenCountStorageAdapter.clearAllTokenStatusData();
    }
    public async getCurrentCustomerToken() {
        await this.tokenCountStorageAdapter.getCurrentCustoemrTokenNumber();
        // TODO interact with token base
        return  null;
    }
}