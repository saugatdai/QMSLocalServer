import Feature from '../../src/UseCases/TokenCallingComponent/Feature';
import CallAgain from '../../src/UseCases/TokenCallingComponent/CallAgainModule/CallAgain';
import Bypass from '../../src/UseCases/TokenCallingComponent/BypassTokenModule/Bypass';
import CallNext from '../../src/UseCases/TokenCallingComponent/NextTokenModule/CallNext';
import RandomCall from '../../src/UseCases/TokenCallingComponent/RandomTokenCallModule/RandomCall';

describe('Testing of Use Cases', () => {
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
      const callMockFunction = jest.fn((tokenNumber) => {});
      const callTokenAgainStrategyFunction = (tokenNumber: number) => {
        callMockFunction(tokenNumber);
      };

      const callAgainStrategyObject = {
        features: [feature],
        callAgainToken: callTokenAgainStrategyFunction,
        pipeFeature: pipeFeature,
      };

      const callAgain = new CallAgain();
      callAgain.setStrategy(callAgainStrategyObject);
      it('Should set the CallAgainStrategy', () => {
        expect(callAgain.getStrategy()).toEqual(callAgainStrategyObject);
      });
      it('Should call the callTokenAgain Function', () => {
        callAgain.callToken(4);
        expect(callMockFunction.mock.calls.length).toBe(1);
      });
    });

    describe('Testing of BypassTokenModule', () => {
      const callMockFunction = jest.fn((tokenNumber) => {});

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
        byPassObject.setStrategy(byPassTokenStrategyObject);
        expect(byPassObject.getStrategy()).toEqual(byPassTokenStrategyObject);
      });
      it('It should bypass a token', () => {
        byPassObject.callToken(5);
        expect(callMockFunction.mock.calls.length).toBe(1);
      });
    });

    describe('Testing of NextTokenModule', () => {
      const callMockFunction = jest.fn((tokenNumber) => {});
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
        callNextObject.setStrategy(callNextObjectStrategy);
        expect(callNextObject.getStrategy()).toEqual(callNextObjectStrategy);
      });
      it('It should call next token', () => {
        callNextObject.callToken(4);
        expect(callMockFunction.mock.calls.length).toBe(1);
      });
    });

    describe('Testing of RandomTokenCallModule', () => {
      const callMockFunction = jest.fn((tokenNumber) => {});
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
        randomCall.setStrategy(randomCallStrategyObject);
        expect(randomCall.getStrategy()).toEqual(randomCallStrategyObject);
      });

      it('should call a random token', () => {
        randomCall.callToken(4);
        expect(callMockFunction.mock.calls.length).toBe(1);
      });
    });
  });
});
