import {
  updateCurrentCount,
  getCurrentCount,
  resetCount
} from './InteractorHelper';

import TokenCountStorageInteractorImplementation, { TokenCountStorageAdapter } from '../../../src/InterfaceAdapters/TokenCountStorageInteractorImplementation';

const tokenCountStorageAdapter: TokenCountStorageAdapter = {
  getCurrentCount,
  updateCurrentCount,
  resetCount
}

const tokenCountStorageInteractorImplementation = new TokenCountStorageInteractorImplementation(tokenCountStorageAdapter);

describe('Testing of TokenCountStorageInteractorImplementation', () => {
  beforeAll(async () => {
    await updateCurrentCount(0);
  });

  afterAll(async () => {
    await updateCurrentCount(0);
  });

  it('Should update current count', async () => {
    await tokenCountStorageInteractorImplementation.updateCurrentTokenCount(3);
    const currentCount = await getCurrentCount();
    expect(currentCount).toBe(3);
  });

  it('Should get the current count ', async () => {
    const currentCount = await tokenCountStorageInteractorImplementation.getCurrentTokenCount();
    expect(currentCount).toBe(3);
  });

  it('Should reset the current token count ', async () => {
    await tokenCountStorageInteractorImplementation.clearCurrentTokenCount();
    const currentCount = await getCurrentCount();
    expect(currentCount).toBe(0);
  });
});