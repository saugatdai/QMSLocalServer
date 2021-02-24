import Customer from '../Entities/CustomerCore/Customer';
import CustomerStorageInteractorAdapter from '../UseCases/CustomerManagementComponent/CustomerStorageInteractorAdapter';

export interface CustomerStorageAdapter {
  createCustomer: (customer: Customer) => Promise<void>;
  readCustomerById: (customerId: number) => Promise<Customer>;
  updateCustomer: (customer: Customer) => Promise<void>;
  deleteCustomerById: (customerId: number) => Promise<void>;
  getCustomers: () => Promise<Customer[]>;
  getNextAvailableId: () => Promise<number>;
  isIdAvailable: (id: number) => Promise<boolean>;
}

export default class CustomerStorageInteractorImplementation implements CustomerStorageInteractorAdapter {
  constructor(private customerStorageAdapter: CustomerStorageAdapter) { }

  public async addCustomerIfHasValidId(customer: Customer) {
    if (! await this.customerStorageAdapter.isIdAvailable(customer.customerId)) {
      throw new Error(`Customer id : ${customer.customerId} already in use`);
    } else {
      await this.customerStorageAdapter.createCustomer(customer);
    }
  }

  public async getCustomerById(customerId: number) {
    const customer = await this.customerStorageAdapter.readCustomerById(customerId);
    return customer;
  }

  public async updateCustomer(customer: Customer) {
    await this.customerStorageAdapter.updateCustomer(customer);
  }

  public async deleteCustomerById(customerId: number) {
    await this.customerStorageAdapter.deleteCustomerById(customerId);
  }

  public async getAllCustomers() {
    const customers = await this.customerStorageAdapter.getCustomers();
    return customers;
  }

  public async createNewCustomer(customer: Customer) {
    const id = await this.customerStorageAdapter.getNextAvailableId();
    customer.customerId = id;
    await this.addCustomerIfHasValidId(customer);
  }
}