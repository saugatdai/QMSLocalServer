import TokenCountStorageInteractorAdapter from '../../src/UseCases/TokenCountManagementComponent/TokenCountStorageInteractorAdapter';
import TokenCountManager from '../../src/UseCases/TokenCountManagementComponent/TokenCountManager';
import tokenCountStorageInteractorAdapter from '../../src/UseCases/TokenCountManagementComponent/TokenCountStorageInteractorAdapter';

describe('Testing of token count management component', () => {
    const updateTokenCurrentCountMockFunction = jest.fn();
    const updateTokenCurrentCountFunction = (count: number) => {
        updateTokenCurrentCountMockFunction();
    }

    const getCurrentTokenCountFunction = () => {
        return 4;
    }

    const clearCurrentTokenCountMockFunction = jest.fn();
    const clearCurrentTokenCountFunction = () => {
        clearCurrentTokenCountMockFunction();
    }

    const tokenCountStorageInteractorAdapter: TokenCountStorageInteractorAdapter = {
        updateCurrentTokenCount: updateTokenCurrentCountFunction,
        getCurrentTokenCount: getCurrentTokenCountFunction,
        clearCurrentTokenCount: clearCurrentTokenCountFunction
    }

    const tokenCountManager = new TokenCountManager(tokenCountStorageInteractorAdapter);

    it('Should be able to preset token count', () => {
        tokenCountManager.presetTokenCount(5);
        expect(updateTokenCurrentCountMockFunction.mock.calls.length).toBe(1);
    });

    it('Should be able to reset current token count', () => {
        tokenCountManager.resetTokenCount();
        expect(clearCurrentTokenCountMockFunction.mock.calls.length).toBe(1);
    });

    it('Should be able to get current token count', () => {
        const currentToken = tokenCountManager.revcoverTokenCount();
        expect(currentToken).toBe(4);
    });
});
