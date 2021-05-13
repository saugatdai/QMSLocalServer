import Feature from '../../src/UseCases/TokenCallingComponent/Feature';
import CallAgain from '../../src/UseCases/TokenCallingComponent/CallAgainModule/CallAgain';
import Bypass from '../../src/UseCases/TokenCallingComponent/BypassTokenModule/Bypass';
import CallNext from '../../src/UseCases/TokenCallingComponent/NextTokenModule/CallNext';
import RandomCall from '../../src/UseCases/TokenCallingComponent/RandomTokenCallModule/RandomCall';
import TokenCallingFacade from '../../src/UseCases/TokenCallingComponent/TokenCallingFacadeSingleton';
import TokenForward from '../../src/UseCases/TokenCallingComponent/TokenForwardModule/TokenForward';
import TokenCallingFacadeSingleton from '../../src/UseCases/TokenCallingComponent/TokenCallingFacadeSingleton';

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

    describe('Testing of TokenForwardModule', () => {
      const callMockFunction = jest.fn(tokenNumber => { });
      const tokenForwardStrategyFunction = (tokenNumber: number) => {
        callMockFunction(tokenNumber);
      }

      const forwardTokenStrategyObject = {
        features: [feature],
        pipeFeature: pipeFeature,
        forwardToken: tokenForwardStrategyFunction
      }

      const forwardToken = new TokenForward();
      it('Should get and set strategy for Token Forward', () => {
        forwardToken.strategy = forwardTokenStrategyObject;
        expect(forwardToken.strategy).toEqual(forwardTokenStrategyObject);
      });

      it('Should forward a token', () => {
        forwardToken.callToken(4);
        expect(callMockFunction.mock.calls.length).toBe(1);
      })

    });

    describe('Testing of Token Calling Facade', () => {
      const runFeatureMockFunction = jest.fn();
      const runFeatureFunction = () => {
        runFeatureMockFunction();
      };

      const callAgainMockFunction = jest.fn();
      const callAgainFunction = (tokenNumber: number) => {
        callAgainMockFunction();
      };

      const callNextTokenMockFunction = jest.fn();
      const callNextTokenFunction = (tokenNumber: number) => {
        callNextTokenMockFunction();
      };

      const byPassTokenMockFunction = jest.fn();
      const byPassTokenFucntion = (tokenNumber: number): void => {
        byPassTokenMockFunction();
      };

      const randomTokenCallMockFunction = jest.fn();
      const randomTokenCallFunction = (tokenNumber: number) => {
        randomTokenCallMockFunction();
      };

      const tokenForwardMockFunction = jest.fn();
      const tokenForwardFunction = (tokenNumber: number) => {
        tokenForwardMockFunction();
      }

      const feature = {
        runFeature: runFeatureFunction,
      };

      const pipeFeatureMockFunction = jest.fn();
      const pipeFeatureFunction = (feature: Feature) => {
        pipeFeatureMockFunction();
      };

      const byPassTokenStrategy = {
        features: [],
        bypassToken: byPassTokenFucntion,
        pipeFeature: pipeFeatureFunction,
      };

      const nextTokenStrategy = {
        features: [],
        callNextToken: callNextTokenFunction,
        pipeFeature: pipeFeatureFunction,
      };

      const randomTokenStrategy = {
        features: [],
        callRandomToken: randomTokenCallFunction,
        pipeFeature: pipeFeatureFunction,
      };

      const callAgainTokenStrategy = {
        features: [],
        callAgainToken: callAgainFunction,
        pipeFeature: pipeFeatureFunction,
      };

      const tokenForwardStrategy = {
        features: [],
        forwardToken: tokenForwardFunction,
        pipeFeature: pipeFeatureFunction
      }

      const tokenCallingFacade = TokenCallingFacade.getInstance();

      describe('Testing token calling procedure of Facade', () => {
        tokenCallingFacade.byPassStrategy = byPassTokenStrategy;
        it('Should bypass a token', () => {
          tokenCallingFacade.byPassToken(4);
          expect(byPassTokenMockFunction.mock.calls.length).toBe(1);
          expect(tokenCallingFacade.currentlyProcessingNumber).toBe(4);
        });

        tokenCallingFacade.callAgainStrategy = callAgainTokenStrategy;
        it('Should call again a token', () => {
          tokenCallingFacade.callTokenAgain(5);
          expect(callAgainMockFunction.mock.calls.length).toBe(1);
          expect(tokenCallingFacade.currentlyProcessingNumber).toBe(5);
        });

        tokenCallingFacade.nextTokenStrategy = nextTokenStrategy;
        it('Should call next token', () => {
          tokenCallingFacade.callNextToken(40);
          expect(callNextTokenMockFunction.mock.calls.length).toBe(1);
          expect(tokenCallingFacade.currentlyProcessingNumber).toBe(40);
        });

        tokenCallingFacade.randomCallStrategy = randomTokenStrategy;
        it('Should call a random token', () => {
          tokenCallingFacade.callRandomToken(400);
          expect(randomTokenCallMockFunction.mock.calls.length).toBe(1);
          expect(tokenCallingFacade.currentlyProcessingNumber).toBe(400);
        });

        tokenCallingFacade.tokenForwardStrategy = tokenForwardStrategy;
        it('Should forward a token', () => {
          tokenCallingFacade.forwardToken(32);
          expect(tokenForwardMockFunction.mock.calls.length).toBe(1);
          expect(tokenCallingFacade.currentlyProcessingNumber).toBe(32);
        });
      });

      describe('Testing Add set pipeline feature of facade', () => {
        it('Should pipe a byPass feature', () => {
          tokenCallingFacade.pipeByPassTokenFeature(feature);
          expect(pipeFeatureMockFunction.mock.calls.length).toBe(1);
        });
        it('Should pipe a callAgain feature', () => {
          tokenCallingFacade.pipeCallTokenAgainFeature(feature);
          expect(pipeFeatureMockFunction.mock.calls.length).toBe(2);
        });
        it('Should pipe a callNext feature', () => {
          tokenCallingFacade.pipeNextTokenFeature(feature);
          expect(pipeFeatureMockFunction.mock.calls.length).toBe(3);
        });
        it('Should pipe a randomTokenCall feature', () => {
          tokenCallingFacade.pipeRandomTokenFeature(feature);
          expect(pipeFeatureMockFunction.mock.calls.length).toBe(4);
        });
        it('Should pipe a tokenForward feature', () => {
          tokenCallingFacade.pipeTokenForwardFeature(feature);
          expect(pipeFeatureMockFunction.mock.calls.length).toBe(5);
        });
      });
    });
  });
});
