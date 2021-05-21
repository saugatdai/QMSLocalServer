import Customer from "../../Entities/CustomerCore/Customer";
import CustomerStorageInteractorAdapter from "./CustomerStorageInteractorAdapter";

export default class CustomerManager {
  private _customerStorageInteractorAdapter: CustomerStorageInteractorAdapter;

  constructor(private _customer: Customer) { }

  public set customer(customer: Customer) {
    this._customer = customer;
  }

  public set customerStorageInteractorAdapter(customerStorageInteractorAdapter: CustomerStorageInteractorAdapter) {
    this._customerStorageInteractorAdapter = customerStorageInteractorAdapter;
  }

  public async store() {
    await this._customerStorageInteractorAdapter.createNewCustomer(this._customer);
  }

  public async update() {
    await this._customerStorageInteractorAdapter.updateCustomer(this._customer);
  }

  public async validateInfo() {
    const obtainedCustomer = await this._customerStorageInteractorAdapter.getCustomerById(
      this._customer.customerId
    );

    if (!obtainedCustomer) {
      throw new Error(`Customer not found`);
    }
    const validity =
      obtainedCustomer.customerId === this._customer.customerId &&
      obtainedCustomer.remarks === this._customer.remarks &&
      obtainedCustomer.token.tokenId === this._customer.token.tokenId

    if (!validity) {
      throw new Error("Customer data did not match");
    }
  }

  public async delete() {
    await this._customerStorageInteractorAdapter.deleteCustomerById(this._customer.customerId);
  }

  public addCustomerInfo<T>(propertyName: string, value: T) {
    this[propertyName] = value;
  }
}
