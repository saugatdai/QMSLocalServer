import Customer from '../../Entities/CustomerCore/Customer';

export default interface CustomerStorageInteractorAdapter{
    addCustomer(customer: Customer): void;
    getCustomerById(id: number): Customer;
    updateCustomer(customer: Customer): void;
    deleteCustomerById(id: number): void;
    getAllCustomers(): Customer[];
}