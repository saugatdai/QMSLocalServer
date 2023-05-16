import Customer from '../src/Entities/CustomerCore/Customer';
import CustomerStorageImplementation from '../src/FrameworksAndDrivers/Drivers/CustomerStorageImplementation';
import Token from '../src/Entities/TokenCore/Token';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

let testId: number;

describe('Testing of CustomerStorageImplementation', () => {
  beforeAll(async () => {
    await prisma.customer.deleteMany({});
    await prisma.token.deleteMany({});

    for (let i = 1; i <= 5; i++) {
      const prismaToken = await prisma.token.create({
        data: {
          date: new Date().toString(),
          tokenNumber: i,
          tokenCategory: {
            connectOrCreate: {
              create: {
                categoryName: 'R',
                currentTokenCount: 0,
                latestCustomerTokenCount: 0,
                category: 'R',
              },
              where: {
                category: 'R'
              }
            }
          }
        }
      });

      const customer = await prisma.customer.create({
        data: {
          customerName: `Customer ${i}`,
          remarks: `Customer #${i} entry`,
          tokenId: prismaToken.tokenId
        }
      });
    }
  });
  afterAll(async () => {
    prisma.customer.deleteMany({});
    prisma.token.deleteMany({});
  });

  it('Should get All Customers', async () => {
    const allcustomers = await CustomerStorageImplementation.getCustomers();
    expect(allcustomers.length).toEqual(5);
  });
  it('Should create a customer ', async () => {
    const token6 = await prisma.token.create({
      data: {
        date: new Date().toString(),
        tokenNumber: 6,
        tokenCategory: {
          connectOrCreate: {
            create: {
              categoryName: 'R',
              currentTokenCount: 0,
              latestCustomerTokenCount: 0,
              category: 'R',
            },
            where: {
              category: 'R'
            }
          }
        }
      },
      include: {
        tokenCategory: true
      }
    });

    const customerToken: Token = {
      date: new Date(token6.date),
      tokenId: token6.tokenId,
      tokenNumber: token6.tokenNumber,
      tokenCategory: token6.tokenCategory.category
    }

    const customer: Customer = {
      customerId: 0,
      customerName: "Holus Bahadur Molus",
      remarks: "Holus bahadur is here",
      token: customerToken
    }
    await CustomerStorageImplementation.createCustomer(customer);
    const allCustomers = await CustomerStorageImplementation.getCustomers();
    testId = allCustomers[allCustomers.length - 1].customerId;
    expect(allCustomers.length).toBe(6);
  });

  it('Should read a customer by id', async () => {
    const customer = await CustomerStorageImplementation.readCustomerById(testId);
    expect(customer.customerId).toBe(testId);
  });

  it('should update a customer ', async () => {
    const customer = await CustomerStorageImplementation.readCustomerById(testId);
    customer.customerName = "Durga Sharma";
    await CustomerStorageImplementation.updateCustomer(customer);
    const updatedCustomer = await CustomerStorageImplementation.readCustomerById(testId);
    expect(updatedCustomer.customerName).toBe("Durga Sharma");
  });

  it('should delete a customer', async () => {
    await CustomerStorageImplementation.deleteCustomerById(testId);
    expect(async () => await CustomerStorageImplementation.readCustomerById(testId)).rejects.toThrow();
  });

  it('Should get the next available id ', async () => {
    const nextAvailableId = await CustomerStorageImplementation.getNextAvailableId();
    expect(nextAvailableId).toBe(6);
  });

  it('Should prove that the id testID + 1 id is avialable', async () => {
    const availability = await CustomerStorageImplementation.isIdAvailable(testId + 1);
    expect(availability).toBeTruthy();
  });

  it('Should prove that the id testId - 1 is not availble', async () => {
    const availability = await CustomerStorageImplementation.isIdAvailable(testId - 1);
    expect(availability).toBeFalsy();
  });
});