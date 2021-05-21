import TokenCountStorageImplementation from '../../src/FrameworksAndDrivers/Drivers/TokenCountStorageImplementation';

describe('Testing of TokenCountStorageInteractorImplementation', () => {
  beforeAll(async () => {
    await TokenCountStorageImplementation.updateCurrentCount(0);
  });

  afterAll(async () => {
    await TokenCountStorageImplementation.updateCurrentCount(0);
  });

  it('Should update current count', async () => {
    await TokenCountStorageImplementation.updateCurrentCount(3);
    const currentCount = await TokenCountStorageImplementation.getCurrentCount();
    expect(currentCount).toBe(3);
  });

  it('Should get the current count ', async () => {
    const currentCount = await TokenCountStorageImplementation.getCurrentCount();
    expect(currentCount).toBe(3);
  });

  it('Should reset the current token count ', async () => {
    await TokenCountStorageImplementation.resetCount();
    const currentCount = await TokenCountStorageImplementation.getCurrentCount();
    expect(currentCount).toBe(0);
  });
});