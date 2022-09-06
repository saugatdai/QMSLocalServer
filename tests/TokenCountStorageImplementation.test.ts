import { PrismaClient } from '@prisma/client';
import TokenCountStorageImplementation from '../src/FrameworksAndDrivers/Drivers/TokenCountStorageImplementation';

const prisma = new PrismaClient();

describe('Testing of TokenCountStorageInteractorImplementation', () => {
  beforeAll(async () => {
    const categoryCount = await prisma.tokenCategoryCount.findMany({
      where: {
        category: ''
      }
    });

    if (categoryCount.length === 0) {
      await prisma.tokenCategoryCount.create({
        data: {
          categoryName: 'General',
          currentTokenCount: 0,
          latestCustomerTokenCount: 0,
          category: ''
        }
      });
    }

  });
  afterAll(async () => {
    await prisma.tokenCategoryCount.deleteMany({
      where: {
        category: ''
      }
    });
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

  it('Should set and get the latest customer token count', async () => {
    await TokenCountStorageImplementation.setLatestCustomerTokenCount(13);
    const latestCustomerTokenCount = await TokenCountStorageImplementation.getLatestCustomerTokenCount();

    expect(latestCustomerTokenCount).toBe(13);
  });
});