import Customer from '../../src/Entities/CustomerCore/Customer';
import CustomerStorageInteractorAdapter from '../../src/UseCases/CustomerManagementComponent/CustomerStorageInteractorAdapter';
import CustomerManager from '../../src/UseCases/CustomerManagementComponent/CustomerManager';
import Token from '../../src/Entities/TokenCore/Token';

describe('Testing of customer management compoenent', () => {
    const token1: Token = {
        tokenId: 1,
        date: new Date(),
        tokenNumber: 2
    }

    const customer1 : Customer = {
        customerId: 123,
        token: token1,
        remarks: "-"
    }

    const token2: Token = {
        tokenId: 1,
        date: new Date(),
        tokenNumber: 2
    }

    const customer2 : Customer = {
        customerId: 123,
        token: token2,
        remarks: "-"
    }

    const addCustomerMockFunction = jest.fn();
    const addCustomerFunction = (customer: Customer) => {addCustomerMockFunction()};

    const getCustomerByIdMockFunction = jest.fn();
    const getCustomerByIdFunction = (id: number) => customer2;

    const updateCustomerMockFunction = jest.fn();
    const updateCustomerFunction = (customer: Customer) => {updateCustomerMockFunction()};

    const deleteCustomerMockFunction = jest.fn();
    const deleteCustomerFunction = (id: number) => {deleteCustomerMockFunction()};

    const getAllCustomersFunction = () => [customer1, customer2];

    const customerStorageInteractorAdapter: CustomerStorageInteractorAdapter = {
        addCustomer: addCustomerMockFunction,
        getCustomerById: getCustomerByIdFunction,
        updateCustomer: updateCustomerFunction,
        deleteCustomerById: deleteCustomerFunction,
        getAllCustomers: getAllCustomersFunction
    }

    const customerManager = new CustomerManager(customer1);
    customerManager.customerStorageInteractorAdapter = customerStorageInteractorAdapter;

    it('Should add customer in storage', () => {
        customerManager.store();
        expect(addCustomerMockFunction.mock.calls.length).toEqual(1);
    });

    it('should update customer in storage', () => {
        customerManager.update();
        expect(updateCustomerMockFunction.mock.calls.length).toBe(1);
    });

    it('should delete customer in storage', () => {
        customerManager.delete();
        expect(deleteCustomerMockFunction.mock.calls.length).toBe(1);
    });

    it('It should validate the given customer', () => {
        expect(customerManager.validateInfo()).toBe(undefined);

    });


});