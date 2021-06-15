import Feature from '../../src/UseCases/TokenCallingComponent/Feature';
import CallAgain from '../../src/UseCases/TokenCallingComponent/CallAgainModule/CallAgain';
import Bypass from '../../src/UseCases/TokenCallingComponent/BypassTokenModule/Bypass';
import CallNext from '../../src/UseCases/TokenCallingComponent/NextTokenModule/CallNext';
import RandomCall from '../../src/UseCases/TokenCallingComponent/RandomTokenCallModule/RandomCall';
import TokenCallingFacade from '../../src/UseCases/TokenCallingComponent/TokenCallingFacadeSingleton';
import TokenForward from '../../src/UseCases/TokenCallingComponent/TokenForwardModule/TokenForward';
import UserFactory from '../../src/Entities/UserCore/UserFactory';
import { UserData } from '../../src/Entities/UserCore/User';
import UserRoles from '../../src/Entities/UserCore/UserRoles';
import Operator from '../../src/Entities/UserCore/Operator';
import TokenCallingFacadeSingleton from '../../src/UseCases/TokenCallingComponent/TokenCallingFacadeSingleton';
import TokenCallingState from '../../src/UseCases/TokenCallingComponent/TokenCallingState';
import Token from '../../src/Entities/TokenCore/Token';

describe('Testing of Token Calling Use Cases', () => {
  const dummyToken: Token = {
    date: new Date(),
    tokenId: 1,
    tokenNumber: 123,
    tokenCategory: ''
  }

  const tokenCallingFacade = TokenCallingFacadeSingleton.getInstance();

  const userData: UserData = {
    username: 'holusBahadur',
    id: 1,
    password: 'holus123',
    role: UserRoles.OPERATOR,
  }

  const userData2: UserData = {
    username: 'helloworld',
    id: 1,
    password: 'hello123',
    role: UserRoles.OPERATOR
  }

  const nextDummyToken = { ...dummyToken, tokenId: 2, tokenNumber: 124, tokenCategory: 'F' };

  const operator: Operator = new UserFactory().getUser(userData) as Operator;
  operator.setCounter('4');
  const operator2: Operator = new UserFactory().getUser(userData2) as Operator;

  const tokenCallingState = new TokenCallingState(operator, dummyToken);
  const anotherTokenCallingState = new TokenCallingState(operator2, nextDummyToken);

  describe('Testing of token calling facade', () => {
    describe('Testing of tokencallingstate', () => {
      tokenCallingFacade.tokenCallingStateManager.addTokenCallingState(tokenCallingState);
      expect(tokenCallingFacade.tokenCallingStateManager.getATokenCallingStateByOperatorName(userData.username).operator).toEqual(operator);
    });

    it('Should get the operator', () => {
      const operator = tokenCallingState.operator;
      expect(operator).toEqual(operator);
    });

    it('Should allow to set next token', () => {
      tokenCallingState.nextToken = nextDummyToken;
      expect(tokenCallingState.nextToken).toEqual(nextDummyToken);
    });

    it('Should allow to set canChange property', () => {
      tokenCallingState.canChange = false;
      expect(tokenCallingState.canChange).toBeFalsy();
    });

    it('Should not allow to set next token', () => {
      tokenCallingState.nextToken = dummyToken;
      expect(tokenCallingState.nextToken).toEqual(nextDummyToken);
    });

    it('Should not allow set canChange property', () => {
      tokenCallingState.canChange = true;
      expect(tokenCallingState.canChange).toBeFalsy();
    });
    describe('Testing of token calling facade tokenState management component', () => {
      it('Should add a tokenCallingState to the currentState', () => {
        tokenCallingFacade.tokenCallingStateManager.addTokenCallingState(tokenCallingState);
        tokenCallingFacade.tokenCallingStateManager.addTokenCallingState(anotherTokenCallingState);
        expect(tokenCallingFacade.tokenCallingStateManager.tokenCallingStates.length).toBe(2);
      });

      it('Should remove a tokenCallingState by userName', () => {
        tokenCallingFacade.tokenCallingStateManager.removeATokenCallingStateForAUser(operator2.getUserInfo().username);
        console.log(tokenCallingFacade.tokenCallingStateManager.tokenCallingStates);
      });
    });

  });
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
      const callTokenAgainStrategyFunction = async (token: Token) => {
        callMockFunction(token);
        return token;
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
        callAgain.callToken(dummyToken);
        expect(callMockFunction.mock.calls.length).toBe(1);
      });
    });

    describe('Testing of BypassTokenModule', () => {
      const callMockFunction = jest.fn((tokenNumber) => { });

      const byPassTokenStrategyFunction = async (token: Token) => {
        callMockFunction(token);
        return token;
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
        byPassObject.callToken(dummyToken);
        expect(callMockFunction.mock.calls.length).toBe(1);
      });
    });

    describe('Testing of NextTokenModule', () => {
      const callMockFunction = jest.fn((tokenNumber) => { });
      const callNextStrategyFunction = async (token: Token) => {
        callMockFunction(token);
        return token;
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
        callNextObject.callToken(dummyToken);
        expect(callMockFunction.mock.calls.length).toBe(1);
      });
    });

    describe('Testing of RandomTokenCallModule', () => {
      const callMockFunction = jest.fn((tokenNumber) => { });
      const randomTokenCallStrategyFunction = async (token: Token) => {
        callMockFunction(token);
        return token;
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
        randomCall.callToken(dummyToken);
        expect(callMockFunction.mock.calls.length).toBe(1);
      });
    });

    describe('Testing of TokenForwardModule', () => {
      const callMockFunction = jest.fn(tokenNumber => { });
      const tokenForwardStrategyFunction = async (token: Token) => {
        callMockFunction(token);
        return token;
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
        forwardToken.callToken(dummyToken);
        expect(callMockFunction.mock.calls.length).toBe(1);
      })

    });

    describe('Testing of Token Calling Facade', () => {
      const runFeatureMockFunction = jest.fn();
      const runFeatureFunction = () => {
        runFeatureMockFunction();
      };

      const callAgainMockFunction = jest.fn();
      const callAgainFunction = async (token: Token) => {
        callAgainMockFunction();
        return token;
      };

      const callNextTokenMockFunction = jest.fn();
      const callNextTokenFunction = async (token: Token) => {
        callNextTokenMockFunction();
        return token;
      };

      const byPassTokenMockFunction = jest.fn();
      const byPassTokenFucntion = async (token: Token): Promise<Token> => {
        byPassTokenMockFunction();
        return token;
      };

      const randomTokenCallMockFunction = jest.fn();
      const randomTokenCallFunction = async (token: Token) => {
        randomTokenCallMockFunction();
        return token;
      };

      const tokenForwardMockFunction = jest.fn();
      const tokenForwardFunction = async (token: Token) => {
        tokenForwardMockFunction();
        return token;
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
          tokenCallingFacade.byPassToken(dummyToken);
          expect(byPassTokenMockFunction.mock.calls.length).toBe(1);
        });

        tokenCallingFacade.callAgainStrategy = callAgainTokenStrategy;
        it('Should call again a token', () => {
          tokenCallingFacade.callTokenAgain(dummyToken);
          expect(callAgainMockFunction.mock.calls.length).toBe(1);
        });

        tokenCallingFacade.nextTokenStrategy = nextTokenStrategy;
        it('Should call next token', () => {
          tokenCallingFacade.callNextToken(dummyToken);
          expect(callNextTokenMockFunction.mock.calls.length).toBe(1);
        });

        tokenCallingFacade.randomCallStrategy = randomTokenStrategy;
        it('Should call a random token', () => {
          tokenCallingFacade.callRandomToken(dummyToken);
          expect(randomTokenCallMockFunction.mock.calls.length).toBe(1);
        });

        tokenCallingFacade.tokenForwardStrategy = tokenForwardStrategy;
        it('Should forward a token', () => {
          tokenCallingFacade.forwardToken(dummyToken);
          expect(tokenForwardMockFunction.mock.calls.length).toBe(1);
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
