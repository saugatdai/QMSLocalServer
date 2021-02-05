import Feature from '../../src/UseCases/TokenCallingComponent/Feature';
import CallAgain from '../../src/UseCases/TokenCallingComponent/CallAgainModule/CallAgain';
import Bypass from '../../src/UseCases/TokenCallingComponent/BypassTokenModule/Bypass';
import CallNext from '../../src/UseCases/TokenCallingComponent/NextTokenModule/CallNext';
import RandomCall from '../../src/UseCases/TokenCallingComponent/RandomTokenCallModule/RandomCall';
import TokenCallingFacade from '../../src/UseCases/TokenCallingComponent/TokenCallingFacade';

describe('Testing of Token Calling Use Cases', () => {
  describe('Testing of Token Calling Component', () => {
    const featureFunctionMock = jest.fn();
    const feature = {
      runFeature: () => {
        featureFunctionMock();
      },
    };
    const pipeFeatureFunctionMock = jest.fn();
    const pipeFeature = (feature: Feature) => {
      pipeFeatureFunctionMock();
    };

    describe('Testing of CallAgainModule', () => {
      const callMockFunction = jest.fn((tokenNumber) => { });
      const callTokenAgainStrategyFunction = (tokenNumber: number) => {
        callMockFunction(tokenNumber);
      };

      const callAgainStrategyObject = {
        features: [feature],
        callAgainToken: callTokenAgainStrategyFunction,
        pipeFeature: pipeFeature,
      };

      const callAgain = new CallAgain();
      callAgain.strategy = callAgainStrategyObject;
      it('Should set the CallAgainStrategy', () => {
        expect(callAgain.strategy).toEqual(callAgainStrategyObject);
      });
      it('Should call the callTokenAgain Function', () => {
        callAgain.callToken(4);
        expect(callMockFunction.mock.calls.length).toBe(1);
      });
    });

    describe('Testing of BypassTokenModule', () => {
      const callMockFunction = jest.fn((tokenNumber) => { });

      const byPassTokenStrategyFunction = (tokenNumber: number) => {
        callMockFunction(tokenNumber);
      };

      const byPassTokenStrategyObject = {
        features: [feature],
        bypassToken: byPassTokenStrategyFunction,
        pipeFeature: pipeFeature,
      };

      const byPassObject = new Bypass();
      it('Should set and get ByPassObjectStrategy', () => {
        byPassObject.strategy = byPassTokenStrategyObject;
        expect(byPassObject.strategy).toEqual(byPassTokenStrategyObject);
      });
      it('It should bypass a token', () => {
        byPassObject.callToken(5);
        expect(callMockFunction.mock.calls.length).toBe(1);
      });
    });

    describe('Testing of NextTokenModule', () => {
      const callMockFunction = jest.fn((tokenNumber) => { });
      const callNextStrategyFunction = (tokenNumber: number) => {
        callMockFunction(tokenNumber);
      };

      const callNextObjectStrategy = {
        features: [feature],
        callNextToken: callNextStrategyFunction,
        pipeFeature: pipeFeature,
      };

      const callNextObject = new CallNext();
      it('Should get and set strategy', () => {
        callNextObject.strategy = callNextObjectStrategy;
        expect(callNextObject.strategy).toEqual(callNextObjectStrategy);
      });
      it('It should call next token', () => {
        callNextObject.callToken(4);
        expect(callMockFunction.mock.calls.length).toBe(1);
      });
    });

    describe('Testing of RandomTokenCallModule', () => {
      const callMockFunction = jest.fn((tokenNumber) => { });
      const randomTokenCallStrategyFunction = (tokenNumber: number) => {
        callMockFunction(tokenNumber);
      };

      const randomCallStrategyObject = {
        features: [feature],
        pipeFeature: pipeFeature,
        callRandomToken: randomTokenCallStrategyFunction,
      };

      const randomCall = new RandomCall();

      it('Should get and set strategy for Random call', () => {
        randomCall.strategy = randomCallStrategyObject;
        expect(randomCall.strategy).toEqual(randomCallStrategyObject);
      });

      it('should call a random token', () => {
        randomCall.callToken(4);
        expect(callMockFunction.mock.calls.length).toBe(1);
      });
    });

    describe('Testing of Token Calling Facade', () => {
      
      const runFeatureMockFunction = jest.fn();
      const runFeatureFunction = () => {
        runFeatureMockFunction();
      }

      const callAgainMockFunction = jest.fn();
      const callAgainFunction = (tokenNumber: number) => {
        callAgainMockFunction();
      }

      const callNextTokenMockFunction = jest.fn();
      const callNextTokenFunction = (tokenNumber: number) => {
        callNextTokenMockFunction();
      }

      const byPassTokenMockFunction = jest.fn();
      const byPassTokenFucntion = (tokenNumber: number) => {
        byPassTokenMockFunction();
      }

      const randomTokenCallMockFunction = jest.fn();
      const randomTokenCallFunction = (tokenNumber: number) => {
        randomTokenCallMockFunction();
      }

      const feature = {
        runFeature: runFeatureFunction
      }

      const pipeFeatureMockFunction = jest.fn();
      const pipeFeatureFunction = (feature: Feature) => {
        pipeFeatureMockFunction();
      }

      interface Strategy{
        features: Feature[],
        pipeFeature: (feature: Feature) => void,
      }

      const byPassTokenStrategy = {
        features: [],
        byPassToken: byPassTokenFucntion,
        pipeFeature: pipeFeatureFunction
      }

      const nextTokenStrategy = {
        features: [],
        callNextToken: callNextTokenMockFunction,
        pipeFeature: pipeFeatureFunction
      }

      const randomTokenStrategy = {
        features: [],
        callRandomToken: randomTokenCallFunction,
        pipeFeature: pipeFeatureFunction
      }

      const tokenCallingFacade = new TokenCallingFacade();



    });
  });
});
