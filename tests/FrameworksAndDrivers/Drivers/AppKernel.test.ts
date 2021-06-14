import * as Path from 'path';
import Token from '../../../src/Entities/TokenCore/Token';
import AppKernelSingleton from '../../../src/FrameworksAndDrivers/Drivers/AppKernelSingleton';
import AppKernel from "../../../src/FrameworksAndDrivers/Drivers/AppKernelSingleton";
import TokenCallingFacadeSingleton from "../../../src/UseCases/TokenCallingComponent/TokenCallingFacadeSingleton";
import { eventHandler1MockFunction, eventHandler2, eventHandler2MockFunction } from './plugins/TestPlugin1/EventHandlers';
import {
  pipeline1Feature1Mock,
  pipeline1Feature2Mock,
  pipeline2Feature1Mock,
  pipeline2Feature2Mock
} from './plugins/TestPlugin1/PipelineExecutors';
import {
  bypassTokenStrategyMock,
  callAgainStrategyMock,
  callRandomTokenStrategyMock,
  nextTokenStrategyMock,
  tokenFrowardStrategyMock
} from './plugins/TestPlugin1/Strategies';

const token: Token = {
  date: new Date(),
  tokenId: 1,
  tokenNumber: 123,
  tokenCategory: ''
}

describe('Testing of Main component', () => {
  const appKernel = AppKernel.getInstance();

  it('Should Load all plugins, event-handlers, pipelineExeuctors and strategies', async () => {
    await appKernel.initializeCoreCallingActivities(Path.join(__dirname, './plugins'));
    TokenCallingFacadeSingleton.getInstance().callNextToken(token);
    TokenCallingFacadeSingleton.getInstance().callTokenAgain(token);
    TokenCallingFacadeSingleton.getInstance().callRandomToken(token);
    TokenCallingFacadeSingleton.getInstance().forwardToken(token);
    TokenCallingFacadeSingleton.getInstance().byPassToken(token);

    expect(pipeline1Feature1Mock.mock.calls.length).toBe(1);
    expect(pipeline1Feature2Mock.mock.calls.length).toBe(1);
    expect(pipeline2Feature1Mock.mock.calls.length).toBe(1);
    expect(pipeline2Feature2Mock.mock.calls.length).toBe(1);

    expect(bypassTokenStrategyMock.mock.calls.length).toBe(1);
    expect(callAgainStrategyMock.mock.calls.length).toBe(1);
    expect(callRandomTokenStrategyMock.mock.calls.length).toBe(1);
    expect(nextTokenStrategyMock.mock.calls.length).toBe(1);
    expect(bypassTokenStrategyMock.mock.calls.length).toBe(1);
    expect(tokenFrowardStrategyMock.mock.calls.length).toBe(1);

    expect(eventHandler1MockFunction.mock.calls.length).toBe(5);
    expect(eventHandler2MockFunction.mock.calls.length).toBe(5);
  });

});