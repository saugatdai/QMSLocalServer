import Customer from '../../../src/Entities/CustomerCore/Customer';
import CustomerStorageInteractorImplemenation, { CustomerStorageAdapter } from '../../../src/InterfaceAdapters/CustomerStorageInteractorImplementation';
import Token from '../../../src/Entities/TokenCore/Token';

import {
    readFile,
    writeFile,
    customerTestStoragePath,
    getCustomers,
    createCustomer,
    readCustomerById,
    updateCustomer,
    deleteCustomerById,
    getNextAvailableId,
    isIdAvailable
} from './InteractorHelpers';

const customerStorageAdapter: CustomerStorageAdapter = {
    getCustomers,
    createCustomer,
    readCustomerById,
    updateCustomer,
    deleteCustomerById,
    getNextAvailableId,
    isIdAvailable
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

    describe('First testing of the CustomerStorageInteractorAdapter', () => {
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
            const updatedCustoemr = await customerStorageAdapter.readCustomerById(5);
            expect(updatedCustoemr.customerName).toBe("Durga Sharma");
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
});