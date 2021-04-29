import TokenCountStorageInteractorAdapter from '../../src/UseCases/TokenCountManagementComponent/TokenCountStorageInteractorAdapter';
import TokenCountManager from '../../src/UseCases/TokenCountManagementComponent/TokenCountManager';
import tokenCountStorageInteractorAdapter from '../../src/UseCases/TokenCountManagementComponent/TokenCountStorageInteractorAdapter';

describe('Testing of token count management component', () => {
    const updateTokenCurrentCountMockFunction = jest.fn();
    const updateTokenCurrentCountFunction = async (count: number) => {
        updateTokenCurrentCountMockFunction();
    }

    const getCurrentTokenCountFunction = async () => {
        return 4;
    }

    const clearCurrentTokenCountMockFunction = jest.fn();
    const clearCurrentTokenCountFunction = async () => {
        clearCurrentTokenCountMockFunction();
    }

    const clearAllTokenStatusDataMockFunction = jest.fn();
    const clearAllTokenStatusDataFunction = async () => {
        clearAllTokenStatusDataMockFunction();
    }

    const getCurrentCustomerTokeNumberFunction = async () => {
        return 5;
    }

    const setCurrentCustomerTokenNumberMockFunction = jest.fn();
    const setCurrentCustomerTokenNumberFunction = async (tokenNumber: number) => {
        setCurrentCustomerTokenNumberMockFunction();
    }

    const tokenCountStorageInteractorAdapter: TokenCountStorageInteractorAdapter = {
        updateCurrentTokenCount: updateTokenCurrentCountFunction,
        getCurrentTokenCount: getCurrentTokenCountFunction,
        clearCurrentTokenCount: clearCurrentTokenCountFunction,
        clearAllTokenStatusData: clearAllTokenStatusDataFunction,
        getCurrentCustomerTokenNumber: getCurrentCustomerTokeNumberFunction,
        setCurrentCustomerTokenNumber: setCurrentCustomerTokenNumberFunction
    }

    const tokenCountManager = new TokenCountManager(tokenCountStorageInteractorAdapter);

    it('Should be able to preset token count', async () => {
        await tokenCountManager.presetTokenCount(5);
        expect(updateTokenCurrentCountMockFunction.mock.calls.length).toBe(1);
    });

    it('Should be able to reset current token count', async () => {
        await tokenCountManager.resetTokenCount();
        expect(clearCurrentTokenCountMockFunction.mock.calls.length).toBe(1);
    });

    it('Should be able to get current token count', async () => {
        const currentToken = await tokenCountManager.revcoverTokenCount();
        expect(currentToken).toBe(4);
    });

    it('should be able to clear all token status data', async () => {
        await tokenCountManager.clearTokenData();
        expect(clearAllTokenStatusDataMockFunction.mock.calls.length).toBe(1);
    });

    it('Should get current customer token number : ', async () => {
        const tokenNumber = await getCurrentCustomerTokeNumberFunction();
        expect(tokenNumber).toBe(5)
    });

    it('Should set current customer token number : ', async () => {
        await setCurrentCustomerTokenNumberFunction(5);
        expect(setCurrentCustomerTokenNumberMockFunction.mock.calls.length).toBe(1);
    })
});
