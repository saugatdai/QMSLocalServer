import * as path from 'path';
import AppKernel from '../../../src/FrameworksAndDrivers/MainComponent/AppKernel';
import TokenCallingFacadeSingleton from '../../../src/UseCases/TokenCallingComponent/TokenCallingFacadeSingleton';

describe('Testing of App Kerning at application plugin level', () => {
  it('Should always return true ', async () => {
    const appKernel = new AppKernel();
    await appKernel.initializeCoreCallingActivities(path.join(__dirname, '../../../plugins'));
    TokenCallingFacadeSingleton.getInstance().callNextToken(4);
    expect(true).toBeTruthy();
  });
});

