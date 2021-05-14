import * as Path from 'path';
import Main from "../../src/FrameworksAndDrivers/Main";
import TokenCallingFacadeSingleton from "../../src/UseCases/TokenCallingComponent/TokenCallingFacadeSingleton";

describe('Testing of Main component', () => {
  it('Should always return true', async () => {
    const main = new Main();
    main.initializeTokenCallingFacade();
    await main.loadPlugins(Path.join(__dirname, '../../plugins'));
    TokenCallingFacadeSingleton.getInstance().callNextToken(4);
    expect(true).toBeTruthy();
  })
});