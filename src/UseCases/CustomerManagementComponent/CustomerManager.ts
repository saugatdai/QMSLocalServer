import Customer from "../../Entities/CustomerCore/Customer";
import CustomerStorageInteractorAdapter from "./CustomerStorageInteractorAdapter";

export default class CustomerManager {
  private _customerStorageInteractorAdapter: CustomerStorageInteractorAdapter;

  constructor(private _customer: Customer) {}

  public set customer(customer: Customer) {
    this._customer = customer;
  }

  public set customerStorageInteractorAdapter(customerStorageInteractorAdapter: CustomerStorageInteractorAdapter){
    this._customerStorageInteractorAdapter = customerStorageInteractorAdapter;
  }

  public store(): void {
    this._customerStorageInteractorAdapter.addCustomer(this._customer);
  }

  public update(): void {
    this._customerStorageInteractorAdapter.updateCustomer(this._customer);
  }

  public validateInfo(): void {
    const obtainedCustomer = this._customerStorageInteractorAdapter.getCustomerById(
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
      throw new Error("Custmer data did not match");
    }
  }

  public delete(): void {
    this._customerStorageInteractorAdapter.deleteCustomerById(this._customer.customerId);
  }

  public addCustomerInfo<T>(propertyName: string, value: T){
    this[propertyName] = value;
  }
}
