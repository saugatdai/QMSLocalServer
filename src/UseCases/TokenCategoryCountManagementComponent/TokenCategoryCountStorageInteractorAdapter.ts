
export default interface TokenCountStorageInteractorAdapter {
    updateCurrentTokenCount: (count: number, category: string) => Promise<void>;
    getCurrentTokenCount: (category: string) => Promise<number>;
    clearCurrentTokenCount: (category: string) => Promise<void>;
    registerANewCategory: (category: string) => Promise<void>;
}