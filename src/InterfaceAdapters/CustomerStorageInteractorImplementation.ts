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

export default class CustomerStorageInteractorImplementation implements CustomerStorageAdapter{
  constructor(private customerStorageAdapter: CustomerStorageAdapter){}

  public async addCustomerIfHasValidId(customer: Customer){
    if(! await this.customerStorageAdapter.isIdAvailable(customer.customerId)){
      throw new Error(`Customer id : ${customer.customerId} already in use`);
    }else{
      this.customerStorageAdapter.createCustomer(customer);
    }
  }

  

}