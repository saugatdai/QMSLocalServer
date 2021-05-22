import UserStorageInteractorImplementation from "../../../../InterfaceAdapters/UserStorageInteractorImplementation";
import UserManager from "../../../../UseCases/UserManagementComponent/UserManager";
import UserStorageImplementation from "../../../Drivers/UserStorageImplementation";

export default class UserStorageHelper {
  private _userStorageInteractorImplementation: UserStorageInteractorImplementation;
  public constructor() {
    this._userStorageInteractorImplementation = new UserStorageInteractorImplementation(UserStorageImplementation);
  }

  public get userStorageInteractorImplementation(): UserStorageInteractorImplementation {
    return this._userStorageInteractorImplementation;
  }

  public async getNextAvailableId(): Promise<number> {
    return UserStorageImplementation.getNextAvailableId();
  }
}