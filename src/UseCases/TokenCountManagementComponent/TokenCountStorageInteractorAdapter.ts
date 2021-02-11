export default interface tokenCountStorageInteractorAdapter{
    updateCurrentTokenCount: (count: number) => void;
    getCurrentTokenCount: () => number;
    clearCurrentTokenCount: () => void;
}