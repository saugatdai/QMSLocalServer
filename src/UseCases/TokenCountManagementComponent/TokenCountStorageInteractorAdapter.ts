import Token from '../../Entities/TokenCore/Token';

export default interface TokenCountStorageInteractorAdapter{
    updateCurrentTokenCount: (count: number) => Promise<void>;
    getCurrentTokenCount: () => Promise<number>;
    clearCurrentTokenCount: () => Promise<void>;
    clearAllTokenStatusData: () => Promise<void>;
    getCurrentCustomerToken: () => Promise<Token>;
    setCurrentCustomerToken: (newCurrenttoken: Token) => Promise<void>;
}