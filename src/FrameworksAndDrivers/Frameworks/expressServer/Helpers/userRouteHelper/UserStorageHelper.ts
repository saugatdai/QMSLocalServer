import { Request, Response } from 'express';

import User, { UserData } from "../../../../../Entities/UserCore/User";
import UserFactory from "../../../../../Entities/UserCore/UserFactory";
import UserStorageInteractorImplementation from "../../../../../InterfaceAdapters/UserStorageInteractorImplementation";
import UserManager from '../../../../../UseCases/UserManagementComponent/UserManager';
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

  public async createAUser(req: Request, res: Response): Promise<User> {
    if (req.body.user) delete req.body.user;
    const user = await this.getUserFromUserData(req.body);
    const userManager = new UserManager(user);
    userManager.userStorageInteractorAdapter = this.userStorageInteractorImplementation;
    await userManager.store();

    const createdUser = await this.userStorageInteractorImplementation.getUserById(user.getUserInfo().id);
    return createdUser;
  }
}