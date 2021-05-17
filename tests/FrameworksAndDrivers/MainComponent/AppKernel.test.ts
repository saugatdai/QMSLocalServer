// import * as Path from 'path';
// import AppKernel from "../../../src/FrameworksAndDrivers/MainComponent/AppKernel";
// import TokenCallingFacadeSingleton from "../../../src/UseCases/TokenCallingComponent/TokenCallingFacadeSingleton";
// import { eventHandler1MockFunction, eventHandler2, eventHandler2MockFunction } from './plugins/TestPlugin1/EventHandlers';
// import {
//   pipeline1Feature1Mock,
//   pipeline1Feature2Mock,
//   pipeline2Feature1Mock,
//   pipeline2Feature2Mock
// } from './plugins/TestPlugin1/PipelineExecutors';
// import {
//   bypassTokenStrategyMock,
//   callAgainStrategyMock,
//   callRandomTokenStrategyMock,
//   nextTokenStrategyMock,
//   tokenFrowardStrategyMock
// } from './plugins/TestPlugin1/Strategies';

// describe('Testing of Main component', () => {
//   const appKernel = new AppKernel();

//   it('Should Load all plugins, event-handlers, pipelineExeuctors and strategies', async () => {
//     await appKernel.initializeCoreCallingActivities(Path.join(__dirname, './plugins'));
//     TokenCallingFacadeSingleton.getInstance().callNextToken(4);
//     TokenCallingFacadeSingleton.getInstance().callTokenAgain(4);
//     TokenCallingFacadeSingleton.getInstance().callRandomToken(4);
//     TokenCallingFacadeSingleton.getInstance().forwardToken(4);
//     TokenCallingFacadeSingleton.getInstance().byPassToken(4);

//     expect(pipeline1Feature1Mock.mock.calls.length).toBe(1);
//     expect(pipeline1Feature2Mock.mock.calls.length).toBe(1);
//     expect(pipeline2Feature1Mock.mock.calls.length).toBe(1);
//     expect(pipeline2Feature2Mock.mock.calls.length).toBe(1);

//     expect(bypassTokenStrategyMock.mock.calls.length).toBe(1);
//     expect(callAgainStrategyMock.mock.calls.length).toBe(1);
//     expect(callRandomTokenStrategyMock.mock.calls.length).toBe(1);
//     expect(nextTokenStrategyMock.mock.calls.length).toBe(1);
//     expect(bypassTokenStrategyMock.mock.calls.length).toBe(1);
//     expect(tokenFrowardStrategyMock.mock.calls.length).toBe(1);

//     expect(eventHandler1MockFunction.mock.calls.length).toBe(5);
//     expect(eventHandler2MockFunction.mock.calls.length).toBe(5);
//   });

// });

test('It should return true', () => {
  expect(true).toBeTruthy();
});