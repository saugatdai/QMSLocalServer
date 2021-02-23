import * as path from 'path';
import * as fs from 'fs';
import * as util from 'util';

import Customer from '../../../src/Entities/CustomerCore/Customer';
import CustomerStorageInteractorImplementation from '../../../src/InterfaceAdapters/CustomerStorageInteractorImplementation';

export const readFile = (filename: string) =>
  util.promisify(fs.readFile)(filename, 'utf-8');
export const writeFile = (filename: string, data: string) =>
  util.promisify(fs.writeFile)(filename, data, 'utf-8');

  export const customerTestStoragePath = path.join(__dirname, '/customers.json');

  const getAllCustomers = async () => {
    const customerJson = await readFile(customerTestStoragePath);
    const allCustomers: Customer[] = JSON.parse(customerJson);
    return allCustomers;
  }
  const createCustomer = async (customer: Customer) => {
    const customers = await getAllCustomers();
    customers.push(customer);
    await writeFile(customerTestStoragePath, JSON.stringify(customers));
  }

  const readCustomerById = async (customerId: number) => {
    const customers = await getAllCustomers();
    return customers.find(customer => customer.customerId === customerId);
  }

  const updateCustomer = async (customer: Customer) => {
    const allCustomersList = await getAllCustomers();
    const updatedList = allCustomersList.map(loopCustomer => {
      if(customer.customerId === loopCustomer.customerId){
        return customer;
      }
      return loopCustomer;
    });
    await writeFile(customerTestStoragePath, JSON.stringify(updatedList));
  }

  const deleteCustomerById = async (customerId: number) => {
    const allCustomersList = await getAllCustomers();
    const customersAfterDeletedById = allCustomersList.filter(customer => customer.customerId !== customerId);  
    await writeFile(customerTestStoragePath, JSON.stringify(customersAfterDeletedById));
  }

  const getNextAvailableId = async() => {
    const allCustomers = await getAllCustomers();
    let greatestId = 0;
    allCustomers.forEach(customer => {
      if(customer.customerId > greatestId){
        greatestId = customer.customerId;
      }
    });
    return greatestId + 1;
  }

  const isIdAvailable = async(id: number) => {
    const allCustomers = await getAllCustomers();
    return allCustomers.find(customer => customer.customerId === id);
  }

  export {
    getAllCustomers, 
    createCustomer, 
    readCustomerById, 
    updateCustomer, 
    deleteCustomerById,
    getNextAvailableId,
    isIdAvailable
}