import * as path from 'path';
import * as fs from 'fs';
import * as util from 'util';

import Customer from '../Entities/CustomerCore/Customer';
import { CustomerStorageAdapter } from '../InterfaceAdapters/CustomerStorageInteractorImplementation';

export const readFile = (filename: string) =>
  util.promisify(fs.readFile)(filename, 'utf-8');
export const writeFile = (filename: string, data: string) =>
  util.promisify(fs.writeFile)(filename, data, 'utf-8');

const customerTestStoragePath = path.join(__dirname, '../../Data/customers.json');

const getCustomers = async () => {
  const customerJson = await readFile(customerTestStoragePath);
  if (!customerJson) {
    throw new Error("No Customer Found");
  }
  const allCustomers: Customer[] = JSON.parse(customerJson);
  return allCustomers;
}
const createCustomer = async (customer: Customer) => {
  let customers: Customer[];
  try {
    customers = await getCustomers();
    customers.push(customer);
  } catch (error) {
    customers = [customer];
  }
  await writeFile(customerTestStoragePath, JSON.stringify(customers));
}

const readCustomerById = async (customerId: number) => {
  try {
    const customers = await getCustomers();
    return customers.find(customer => customer.customerId === customerId);
  } catch (error) {
    console.log(error);
    return null;
  }
}

const updateCustomer = async (customer: Customer) => {
  const allCustomersList = await getCustomers();
  const updatedList = allCustomersList.map(loopCustomer => {
    if (customer.customerId === loopCustomer.customerId) {
      return customer;
    }
    return loopCustomer;
  });
  await writeFile(customerTestStoragePath, JSON.stringify(updatedList));
}

const deleteCustomerById = async (customerId: number) => {
  const allCustomersList = await getCustomers();
  const customersAfterDeletedById = allCustomersList.filter(customer => customer.customerId !== customerId);
  await writeFile(customerTestStoragePath, JSON.stringify(customersAfterDeletedById));
}

const getNextAvailableId = async () => {
  let greatestId = 0;
  try {
    const allCustomers = await getCustomers();
    allCustomers.forEach(customer => {
      if (customer.customerId > greatestId) {
        greatestId = customer.customerId;
      }
    });
  } catch (error) {

  }
  return greatestId + 1;
}

const isIdAvailable = async (id: number) => {
  try {
    const allCustomers = await getCustomers();
    return !allCustomers.some(customer => customer.customerId === id);
  } catch (error) { }
  return true;
}

const resetAllCustomers = async () => {
  await writeFile(customerTestStoragePath, '');
}

const CustomerStorageImplementation: CustomerStorageAdapter = {
  getCustomers,
  createCustomer,
  readCustomerById,
  updateCustomer,
  deleteCustomerById,
  getNextAvailableId,
  isIdAvailable,
  resetCustomers: resetAllCustomers
}

export default CustomerStorageImplementation;