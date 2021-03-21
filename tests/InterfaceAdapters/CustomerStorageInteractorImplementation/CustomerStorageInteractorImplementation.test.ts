import Customer from '../../../src/Entities/CustomerCore/Customer';
import CustomerStorageInteractorImplemenation, { CustomerStorageAdapter } from '../../../src/InterfaceAdapters/CustomerStorageInteractorImplementation';
import Token from '../../../src/Entities/TokenCore/Token';

import {
    writeFile,
    customerTestStoragePath,
    getCustomers,
    createCustomer,
    readCustomerById,
    updateCustomer,
    deleteCustomerById,
    getNextAvailableId,
    isIdAvailable,
    resetAllCustomers
} from './InteractorHelpers';

const customerStorageAdapter: CustomerStorageAdapter = {
    getCustomers,
    createCustomer,
    readCustomerById,
    updateCustomer,
    deleteCustomerById,
    getNextAvailableId,
    isIdAvailable,
    resetCustomers: resetAllCustomers
};

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

const customerCollection = [customer1, customer2, customer3, customer4, customer5];

describe('Test of CustomerStorageInteractorImplementation Interface adapter ', () => {
    beforeAll(async () => {
        await writeFile(customerTestStoragePath, JSON.stringify(customerCollection));
    });
    afterAll(async () => {
        await writeFile(customerTestStoragePath, '');
    });

    describe('First testing of the CustoemrStorageAdapter', () => {

        it('Should get All Customers', async () => {
            const allcustomers = await customerStorageAdapter.getCustomers();
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
            await customerStorageAdapter.createCustomer(customer);
            const allCustomers = await customerStorageAdapter.getCustomers();
            expect(allCustomers.length).toBe(6);
        });

        it('Should read a customer by id', async () => {
            const customer = await customerStorageAdapter.readCustomerById(5);
            expect(customer.customerId).toBe(5);
        });

        it('should update a customer ', async () => {
            const customer = await customerStorageAdapter.readCustomerById(5);
            customer.customerName = "Durga Sharma";
            await customerStorageAdapter.updateCustomer(customer);
            const updatedCustomer = await customerStorageAdapter.readCustomerById(5);
            expect(updatedCustomer.customerName).toBe("Durga Sharma");
        });

        it('should delete a customer', async () => {
            await deleteCustomerById(6);
            const deletedCustomerInfo = await customerStorageAdapter.readCustomerById(6);
            expect(deletedCustomerInfo).toBeFalsy();
        });

        it('Should get the next available id ', async () => {
            const nextAvailableId = await customerStorageAdapter.getNextAvailableId();
            expect(nextAvailableId).toBe(6);
        });

        it('Should prove that the id 6 is avialable', async () => {
            const availability = await customerStorageAdapter.isIdAvailable(6);
            expect(availability).toBeTruthy();
        });

        it('Should prove that the id 4 is not availble', async () => {
            const availability = await customerStorageAdapter.isIdAvailable(4);
            expect(availability).toBeFalsy();
        });
    });
    describe('Testing of CustoemrStorageInteractorImplementation', () => {
        const customerStorageInteractorImplementaiton = new CustomerStorageInteractorImplemenation(customerStorageAdapter);
        it('Should create a new customer', async () => {
            const token: Token = {
                date: new Date(),
                tokenId: 40,
                tokenNumber: 45,
                tokenCategory: 'R'
            }
            const customer: Customer = {
                customerId: null,
                customerName: "Sarala Giri",
                token: token,
                remarks: 'nothing'
            }

            await customerStorageInteractorImplementaiton.createNewCustomer(customer);
            const availableId = await getNextAvailableId();
            customer.customerId = availableId - 1;
            const newCustomer = await customerStorageInteractorImplementaiton.getCustomerById(customer.customerId);
            expect(newCustomer.customerName).toEqual(customer.customerName);
        });

        it('Should throw an exception saying the id is already used', async () => {
            const token: Token = {
                date: new Date(),
                tokenId: 40,
                tokenNumber: 45,
                tokenCategory: 'R'
            }
            const customer: Customer = {
                customerId: 2,
                customerName: "Sarala Giri",
                token: token,
                remarks: 'nothing'
            }
            await expect(async () => { await customerStorageInteractorImplementaiton.addCustomerIfHasValidId(customer) }).rejects.toThrow();
        });

        it('Should get a coustomer by Id', async () => {
            const customer = await customerStorageInteractorImplementaiton.getCustomerById(2);
            expect(customer.customerName).toBe("Sangit Sigdel");
        });

        it('Should update a customer', async () => {
            const customer = await customerStorageInteractorImplementaiton.getCustomerById(2);
            customer.customerName = "Sangit Prasad Sigdel";
            await customerStorageInteractorImplementaiton.updateCustomer(customer);
            const udpatedCustomer = await customerStorageInteractorImplementaiton.getCustomerById(2);
            expect(udpatedCustomer.customerName).toBe(customer.customerName);
        });

        it('Should delete a customer', async () => {
            await customerStorageInteractorImplementaiton.deleteCustomerById(2);
            const customer = await customerStorageInteractorImplementaiton.getCustomerById(2);
            expect(customer).toBeFalsy();
        });

        it('Should get all customers', async () => {
            const allCustomers = await customerStorageInteractorImplementaiton.getAllCustomers();
            expect(allCustomers.length).toBe(5);
        });

        // TODO Reset a customer base and handle error while reading customerbase
        it('Should reset all customers', async () => {
            await customerStorageInteractorImplementaiton.resetCustomers();
            expect(async () => { await customerStorageInteractorImplementaiton.getAllCustomers() }).rejects.toThrow();
        });

        it('Should add a new customer in empty customerCollection', async () => {
            await customerStorageInteractorImplementaiton.createNewCustomer(customer1);
            const allCustomers = await customerStorageInteractorImplementaiton.getAllCustomers();
            expect(allCustomers.length).toBe(1);
        });

        it('Should add a second customer', async () => {
            await customerStorageInteractorImplementaiton.createNewCustomer(customer2);
            const allCustomers = await customerStorageInteractorImplementaiton.getAllCustomers();
            expect(allCustomers.length).toBe(2);
        });
    });
});