import Token from '../../Entities/TokenCore/Token';

export default interface TokenCountStorageInteractorAdapter {
    updateCurrentTokenCount: (count: number) => Promise<void>;
    getCurrentTokenCount: () => Promise<number>;
    clearCurrentTokenCount: () => Promise<void>;
}