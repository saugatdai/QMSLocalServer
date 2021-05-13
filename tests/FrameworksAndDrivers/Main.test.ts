import Main from "../../src/FrameworksAndDrivers/Main";
import TokenCallingFacadeSingleton from "../../src/UseCases/TokenCallingComponent/TokenCallingFacadeSingleton";

describe('Testing of Main component', () => {
  it('Should always return true', async () => {
    const main = new Main();
    main.initializeTokenCallingFacade();
    await main.loadPlugins();
    TokenCallingFacadeSingleton.getInstance().callNextToken(4);
    expect(true).toBeTruthy();
  })
});