import User, { UserData } from "../../../../../Entities/UserCore/User";
import UserFactory from "../../../../../Entities/UserCore/UserFactory";
import UserStorageInteractorImplementation from "../../../../../InterfaceAdapters/UserStorageInteractorImplementation";
import UserStorageImplementation from "../../../../Drivers/UserStorageImplementation";

export default class UserStorageHelper {
  private _userStorageInteractorImplementation: UserStorageInteractorImplementation;
  public constructor() {
    this._userStorageInteractorImplementation = new UserStorageInteractorImplementation(UserStorageImplementation);
  }

  public get userStorageInteractorImplementation(): UserStorageInteractorImplementation {
    return this._userStorageInteractorImplementation;
  }

  public async getNextAvailableId(): Promise<number> {
    return await UserStorageImplementation.getNextAvailableId();
  }

  public async getUserFromUserData(userData: UserData): Promise<User> {
    const user: User = new UserFactory().getUser(userData);
    const userId = await this.getNextAvailableId();
    user.getUserInfo().id = userId;
    return user;
  }
}