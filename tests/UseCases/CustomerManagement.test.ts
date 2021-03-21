import Customer from '../../src/Entities/CustomerCore/Customer';
import CustomerStorageInteractorAdapter from '../../src/UseCases/CustomerManagementComponent/CustomerStorageInteractorAdapter';
import CustomerManager from '../../src/UseCases/CustomerManagementComponent/CustomerManager';
import Token from '../../src/Entities/TokenCore/Token';
import { resetAllCustomers } from '../InterfaceAdapters/CustomerStorageInteractorImplementation/InteractorHelpers';

describe('Testing of customer management compoenent', () => {
  const token1: Token = {
    tokenId: 1,
    date: new Date(),
    tokenNumber: 2,
  };

  const customer1: Customer = {
    customerId: 123,
    token: token1,
    remarks: '-',
    customerName: "Saugat Sigdel"
  };

  const token2: Token = {
    tokenId: 2,
    date: new Date(),
    tokenNumber: 2,
  };

  const customer2: Customer = {
    customerId: 124,
    token: token2,
    remarks: '-',
    customerName: "Saugat Sigdel"
  };

  const addCustomerMockFunction = jest.fn();
  const addCustomerFunction = async (customer: Customer) => {
    addCustomerMockFunction();
  };

  const getCustomerByIdFunction = async (id: number) => customer1;

  const updateCustomerMockFunction = jest.fn();
  const updateCustomerFunction = async (customer: Customer) => {
    updateCustomerMockFunction();
  };

  const deleteCustomerMockFunction = jest.fn();
  const deleteCustomerFunction = async (id: number) => {
    deleteCustomerMockFunction();
  };

  const createNewCustomerMockFunction = jest.fn();
  const createNewCustomerFunction = async (customer: Customer) => {
    await createNewCustomerMockFunction();
  }

  const getAllCustomersFunction = async () => [customer1, customer2];

  const customerStorageInteractorAdapter: CustomerStorageInteractorAdapter = {
    addCustomerIfHasValidId: addCustomerFunction,
    getCustomerById: getCustomerByIdFunction,
    updateCustomer: updateCustomerFunction,
    deleteCustomerById: deleteCustomerFunction,
    getAllCustomers: getAllCustomersFunction,
    createNewCustomer: createNewCustomerFunction,
    resetCustomers: resetAllCustomers
  };

  const customerManager = new CustomerManager(customer1);
  customerManager.customerStorageInteractorAdapter = customerStorageInteractorAdapter;

  it('Should add customer in storage', async () => {
    await customerManager.store();
    expect(createNewCustomerMockFunction.mock.calls.length).toEqual(1);
  });

  it('should update customer in storage', async () => {
    await customerManager.update();
    expect(updateCustomerMockFunction.mock.calls.length).toBe(1);
  });

  it('should delete customer in storage', async () => {
    await customerManager.delete();
    expect(deleteCustomerMockFunction.mock.calls.length).toBe(1);
  });

  it('It should validate the given customer', async () => {
    expect(await customerManager.validateInfo()).toBe(undefined);
  });

  it('Should throw Custmer data did not match exception', async () => {
    customerManager.customer = customer2;
    await expect(async () => {
      await customerManager.validateInfo();
    }).rejects.toThrow('Custmer data did not match');
  });

  it('Should throw customer not found exception', () => {
    customerStorageInteractorAdapter.getCustomerById = (id: number) => null;
    expect(async () => {
      await customerManager.validateInfo();
    }).rejects.toThrow('Customer not found');
  });

  it('Should add new property to customer', () => {
    customerManager.addCustomerInfo<string>('purpose', 'visit');
    expect(customerManager['purpose']).toBe('visit');
  });

  it('Should add a new method to customer', () => {
    customerManager.addCustomerInfo<Function>('laugh', () => 'Hahahaha');
    expect(customerManager['laugh']()).toBe('Hahahaha');
  });
});
