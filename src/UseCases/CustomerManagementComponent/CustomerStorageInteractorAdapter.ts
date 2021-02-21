import Customer from '../../Entities/CustomerCore/Customer';

export default interface CustomerStorageInteractorAdapter{
    addCustomer(customer: Customer): Promise<void>;
    getCustomerById(id: number): Promise<Customer>;
    updateCustomer(customer: Customer): Promise<void>;
    deleteCustomerById(id: number): Promise<void>;
    getAllCustomers(): Promise<Customer[]>;
}