import {
  TokenBypassDefault,
  CallAgainDefault,
  CallNextTokenDefault,
  RandomTokenCallDefault
} from '../../src/InterfaceAdapters/TokenCallingStrategiesImplementation';
import EventManagerSingleton from '../../src/UseCases/EventManagementComponent/EventManagerSingleton';
import EventTypes from '../../src/UseCases/EventManagementComponent/EventTypes';
import Feature from '../../src/UseCases/TokenCallingComponent/Feature';

describe('Testing of TokenCallingStrategiesImplementation.test.ts', () => {

  const nextTokenCallerMockFunction = jest.fn();
  const callAgainTokenMockFunction = jest.fn();
  const bypassTokenMockFunction = jest.fn();
  const callRandomTokenMockFunction = jest.fn();

  const nextTokenCallerFunction = async (tokenNumber: number) => {
    await nextTokenCallerMockFunction(tokenNumber);
  }

  const callAgaintokenFunction = async (tokenNumber: number) => {
    await callAgainTokenMockFunction(tokenNumber);
  }

  const bypassTokenFunction = async (tokenNumber: number) => {
    await bypassTokenMockFunction(tokenNumber);
  }

  const callRamdomTokenFunction = async (tokenNumber: number) => {
    await callRandomTokenMockFunction(tokenNumber);
  }


  const tokenBypassDefaultObject = new TokenBypassDefault(bypassTokenFunction);
  const callAgainDefaultObject = new CallAgainDefault(callAgaintokenFunction);
  const callNextTokenDefaultObject = new CallNextTokenDefault(nextTokenCallerFunction);
  const randomTokenCallDefaultObject = new RandomTokenCallDefault(callRamdomTokenFunction);

  describe('Testing of TokenBypassDefault class', () => {
    const feature1Mock = jest.fn();
    const feature2Mock = jest.fn();
    const feature3Mock = jest.fn();
    const feature4Mock = jest.fn();

    const feature1: Feature = {
      goToNextFeature: true,
      runFeature: feature1Mock
    }

    const feature2: Feature = {
      goToNextFeature: true,
      runFeature: feature2Mock
    }

    const feature3: Feature = {
      goToNextFeature: false,
      runFeature: feature3Mock
    }

    const feature4: Feature = {
      goToNextFeature: true,
      runFeature: feature4Mock
    }

    tokenBypassDefaultObject.pipeFeature(feature1);
    tokenBypassDefaultObject.pipeFeature(feature2);
    tokenBypassDefaultObject.pipeFeature(feature3);
    tokenBypassDefaultObject.pipeFeature(feature4);

    tokenBypassDefaultObject.bypassToken(2);

    it('Should execute bypass Function', async () => {
      expect(bypassTokenMockFunction.mock.calls.length).toBe(1);
    });
    it('should call features appropriately with chain of responsibility principle', () => {
      expect(feature1Mock.mock.calls.length).toBe(1);
      expect(feature2Mock.mock.calls.length).toBe(1);
      expect(feature3Mock.mock.calls.length).toBe(1);
      expect(feature4Mock.mock.calls.length).toBe(0);
    });
  });

  describe('Testing of CallAgainDefault class', () => {
    const feature1Mock = jest.fn();
    const feature2Mock = jest.fn();
    const feature3Mock = jest.fn();
    const feature4Mock = jest.fn();

    const feature1: Feature = {
      goToNextFeature: true,
      runFeature: feature1Mock
    }

    const feature2: Feature = {
      goToNextFeature: true,
      runFeature: feature2Mock
    }

    const feature3: Feature = {
      goToNextFeature: false,
      runFeature: feature3Mock
    }

    const feature4: Feature = {
      goToNextFeature: true,
      runFeature: feature4Mock
    }

    callAgainDefaultObject.pipeFeature(feature1);
    callAgainDefaultObject.pipeFeature(feature2);
    callAgainDefaultObject.pipeFeature(feature3);
    callAgainDefaultObject.pipeFeature(feature4);

    const preCallEventSubscriberFunction = jest.fn();
    const postCallEventSubscriberFunction = jest.fn();
    const eventManager = EventManagerSingleton.getInstance();
    eventManager.on(EventTypes.PRE_CALL_EVENT, (testArg: string = "testValue1") => {
      preCallEventSubscriberFunction(testArg);
    });
    eventManager.on(EventTypes.POST_CALL_EVENT, (testArg: string = "testValue2") => {
      postCallEventSubscriberFunction(testArg);
    });

    callAgainDefaultObject.callAgainToken(2);

    it('Should execute bypass Function', async () => {
      expect(bypassTokenMockFunction.mock.calls.length).toBe(1);
    });
    it('should call features appropriately with chain of responsibility principle', () => {
      expect(feature1Mock.mock.calls.length).toBe(1);
      expect(feature2Mock.mock.calls.length).toBe(1);
      expect(feature3Mock.mock.calls.length).toBe(1);
      expect(feature4Mock.mock.calls.length).toBe(0);
    });
  });

  describe('Testing of CallNextDefault class', () => {
    const feature1Mock = jest.fn();
    const feature2Mock = jest.fn();
    const feature3Mock = jest.fn();
    const feature4Mock = jest.fn();

    const feature1: Feature = {
      goToNextFeature: true,
      runFeature: feature1Mock
    }

    const feature2: Feature = {
      goToNextFeature: true,
      runFeature: feature2Mock
    }

    const feature3: Feature = {
      goToNextFeature: false,
      runFeature: feature3Mock
    }

    const feature4: Feature = {
      goToNextFeature: true,
      runFeature: feature4Mock
    }

    callNextTokenDefaultObject.pipeFeature(feature1);
    callNextTokenDefaultObject.pipeFeature(feature2);
    callNextTokenDefaultObject.pipeFeature(feature3);
    callNextTokenDefaultObject.pipeFeature(feature4);

    const preCallEventSubscriberFunction = jest.fn();
    const postCallEventSubscriberFunction = jest.fn();
    const eventManager = EventManagerSingleton.getInstance();
    eventManager.on(EventTypes.PRE_CALL_EVENT, (testArg: string = "testValue1") => {
      preCallEventSubscriberFunction(testArg);
    });
    eventManager.on(EventTypes.POST_CALL_EVENT, (testArg: string = "testValue2") => {
      postCallEventSubscriberFunction(testArg);
    });

    callNextTokenDefaultObject.callNextToken(2);

    it('Should execute bypass Function', async () => {
      expect(bypassTokenMockFunction.mock.calls.length).toBe(1);
    });
    it('should call features appropriately with chain of responsibility principle', () => {
      expect(feature1Mock.mock.calls.length).toBe(1);
      expect(feature2Mock.mock.calls.length).toBe(1);
      expect(feature3Mock.mock.calls.length).toBe(1);
      expect(feature4Mock.mock.calls.length).toBe(0);
    });
  });

  describe('Testing of RandomTokenCallDefault class', () => {
    const feature1Mock = jest.fn();
    const feature2Mock = jest.fn();
    const feature3Mock = jest.fn();
    const feature4Mock = jest.fn();

    const feature1: Feature = {
      goToNextFeature: true,
      runFeature: feature1Mock
    }

    const feature2: Feature = {
      goToNextFeature: true,
      runFeature: feature2Mock
    }

    const feature3: Feature = {
      goToNextFeature: false,
      runFeature: feature3Mock
    }

    const feature4: Feature = {
      goToNextFeature: true,
      runFeature: feature4Mock
    }

    randomTokenCallDefaultObject.pipeFeature(feature1);
    randomTokenCallDefaultObject.pipeFeature(feature2);
    randomTokenCallDefaultObject.pipeFeature(feature3);
    randomTokenCallDefaultObject.pipeFeature(feature4);

    const preCallEventSubscriberFunction = jest.fn();
    const postCallEventSubscriberFunction = jest.fn();
    const eventManager = EventManagerSingleton.getInstance();
    eventManager.on(EventTypes.PRE_CALL_EVENT, (testArg: string = "testValue1") => {
      preCallEventSubscriberFunction(testArg);
    });
    eventManager.on(EventTypes.POST_CALL_EVENT, (testArg: string = "testValue2") => {
      postCallEventSubscriberFunction(testArg);
    });

    randomTokenCallDefaultObject.callRandomToken(2);

    it('Should execute bypass Function', async () => {
      expect(bypassTokenMockFunction.mock.calls.length).toBe(1);
    });
    it('should call features appropriately with chain of responsibility principle', () => {
      expect(feature1Mock.mock.calls.length).toBe(1);
      expect(feature2Mock.mock.calls.length).toBe(1);
      expect(feature3Mock.mock.calls.length).toBe(1);
      expect(feature4Mock.mock.calls.length).toBe(0);
    });
  });

});