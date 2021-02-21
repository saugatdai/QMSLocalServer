import Customer from '../../Entities/CustomerCore/Customer';

export default interface CustomerStorageInteractorAdapter{
    addCustomerIfHasValidId(customer: Customer): Promise<void>;
    getCustomerById(id: number): Promise<Customer>;
    updateCustomer(customer: Customer): Promise<void>;
    deleteCustomerById(id: number): Promise<void>;
    getAllCustomers(): Promise<Customer[]>;
    createNewCustomer(customer: Customer): Promise<void>;
}