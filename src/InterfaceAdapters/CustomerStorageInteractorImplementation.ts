import Customer from '../Entities/CustomerCore/Customer';

export interface CustomerStorageAdapter {
  createCustomer: (customer: Customer) => void;
  readCustomer: (customerId: number) => void;
}