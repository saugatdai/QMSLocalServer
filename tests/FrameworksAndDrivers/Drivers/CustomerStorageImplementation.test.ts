import * as fs from 'fs';
import * as path from 'path';
import * as util from 'util';

import Customer from '../../../src/Entities/CustomerCore/Customer';
import CustomerStorageImplementation from '../../../src/FrameworksAndDrivers/Drivers/CustomerStorageImplementation';
import Token from '../../../src/Entities/TokenCore/Token';

const token1: Token = {
  date: new Date(),
  tokenId: 1,
  tokenNumber: 1,
};
const token2: Token = {
  date: new Date(),
  tokenId: 2,
  tokenNumber: 2,
  tokenCategory: 'C'
};
const token3: Token = {
  date: new Date(),
  tokenId: 3,
  tokenNumber: 3,
  tokenCategory: 'R'
};
const token4: Token = {
  date: new Date(),
  tokenId: 4,
  tokenNumber: 4,
};
const token5: Token = {
  date: new Date(),
  tokenId: 5,
  tokenNumber: 5,
  tokenCategory: 'C'
};
const customer1: Customer = {
  customerId: 1,
  remarks: "General Customer",
  token: token1,
  customerName: "Saugat Sigdel"
}
const customer2: Customer = {
  customerId: 2,
  remarks: "Another Customer",
  token: token2,
  customerName: "Sangit Sigdel"
}
const customer3: Customer = {
  customerId: 3,
  remarks: "The Other Customer",
  token: token3,
  customerName: "Nikunj Chapagain"
}
const customer4: Customer = {
  customerId: 4,
  remarks: "General Customer",
  token: token4,
  customerName: "Ujjwal Bhattarai"
}
const customer5: Customer = {
  customerId: 5,
  remarks: "General Customer",
  token: token5,
  customerName: "Lochan Thapa"
}

const customerTestStoragePath = path.join(__dirname, '../../../Data/customers.json');

const customerCollection = [customer1, customer2, customer3, customer4, customer5];

const readFile = (filename: string) =>
  util.promisify(fs.readFile)(filename, 'utf-8');
const writeFile = (filename: string, data: string) =>
  util.promisify(fs.writeFile)(filename, data, 'utf-8');

describe('Testing of CustomerStorageImplementation', () => {
  beforeAll(async () => {
    await writeFile(customerTestStoragePath, JSON.stringify(customerCollection));
  });
  afterAll(async () => {
    await writeFile(customerTestStoragePath, '');
  });

  it('Should get All Customers', async () => {
    const allcustomers = await CustomerStorageImplementation.getCustomers();
    expect(allcustomers.length).toEqual(5);
  });
  it('Should create a customer ', async () => {
    const token6: Token = {
      date: new Date(),
      tokenId: 6,
      tokenCategory: 'R',
      tokenNumber: 6
    }
    const customer: Customer = {
      customerId: 6,
      customerName: "Holus Bahadur Molus",
      remarks: "Holus bahadur is here",
      token: token6
    }
    await CustomerStorageImplementation.createCustomer(customer);
    const allCustomers = await CustomerStorageImplementation.getCustomers();
    expect(allCustomers.length).toBe(6);
  });

  it('Should read a customer by id', async () => {
    const customer = await CustomerStorageImplementation.readCustomerById(5);
    expect(customer.customerId).toBe(5);
  });

  it('should update a customer ', async () => {
    const customer = await CustomerStorageImplementation.readCustomerById(5);
    customer.customerName = "Durga Sharma";
    await CustomerStorageImplementation.updateCustomer(customer);
    const updatedCustomer = await CustomerStorageImplementation.readCustomerById(5);
    expect(updatedCustomer.customerName).toBe("Durga Sharma");
  });

  it('should delete a customer', async () => {
    await CustomerStorageImplementation.deleteCustomerById(6);
    const deletedCustomerInfo = await CustomerStorageImplementation.readCustomerById(6);
    expect(deletedCustomerInfo).toBeFalsy();
  });

  it('Should get the next available id ', async () => {
    const nextAvailableId = await CustomerStorageImplementation.getNextAvailableId();
    expect(nextAvailableId).toBe(6);
  });

  it('Should prove that the id 6 is avialable', async () => {
    const availability = await CustomerStorageImplementation.isIdAvailable(6);
    expect(availability).toBeTruthy();
  });

  it('Should prove that the id 4 is not availble', async () => {
    const availability = await CustomerStorageImplementation.isIdAvailable(4);
    expect(availability).toBeFalsy();
  });
});