import { Request, Response } from 'express';

import User, { UserData } from "../../../../../Entities/UserCore/User";
import UserFactory from "../../../../../Entities/UserCore/UserFactory";
import UserRoles from '../../../../../Entities/UserCore/UserRoles';
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

  public async updateAdmin(req: Request, res: Response): Promise<User> {
    if (req.body.user) delete req.body.user;
    const storedUser = await this.userStorageInteractorImplementation.getUserById(parseInt(req.params.adminId));
    if (!storedUser || (req.body.role !== UserRoles.ADMIN && storedUser.getUserInfo().role != UserRoles.ADMIN)) {
      res.status(400).send({ error: `This route can handle only Administraotrs or admin with id ${req.params.adminId} doesn't exists` });
    } else {
      const user = await this.getUserFromUserData(req.body);
      user.getUserInfo().id = parseInt(req.params.adminId);
      const userManager = new UserManager(user);
      userManager.userStorageInteractorAdapter = this.userStorageInteractorImplementation;
      await userManager.update();

      const createdUser = await this.userStorageInteractorImplementation.getUserById(user.getUserInfo().id);
      return createdUser;
    }
  }

  public async deleteAdmin(req: Request, res: Response): Promise<void> {
    const user = await this.userStorageInteractorImplementation.getUserById(parseInt(req.params.adminId));
    if (!user) {
      res.status(400).send({ error: `No admin with id ${req.params.id} exists` });
    } else if (user.getUserInfo().role !== UserRoles.ADMIN) {
      res.status(401).send({ error: 'Only admins can be deleted through this route' });
    } else {
      const usermanager = new UserManager(user);
      usermanager.userStorageInteractorAdapter = this.userStorageInteractorImplementation;
      await usermanager.delete();
    }
  }

  public async updateUser(req: Request, res: Response): Promise<User> {
    if (req.body.user) delete req.body.user;
    const storedUser = await this.userStorageInteractorImplementation.getUserById(parseInt(req.params.userId));
    if (!storedUser || req.body.role === UserRoles.SUPERADMIN
      || storedUser.getUserInfo().role === UserRoles.SUPERADMIN ||
      req.body.role === UserRoles.ADMIN ||
      storedUser.getUserInfo().role === UserRoles.ADMIN) {
      res.status(400).send({ error: `This route can not handle admins, superadmins or ${req.params.userId} doesn't exists` });
    } else {
      const user = await this.getUserFromUserData(req.body);
      user.getUserInfo().id = parseInt(req.params.userId);
      const userManager = new UserManager(user);
      userManager.userStorageInteractorAdapter = this.userStorageInteractorImplementation;
      await userManager.update();
      const createdUser = await this.userStorageInteractorImplementation.getUserById(user.getUserInfo().id);
      return createdUser;
    }
  }

  public async deleteUser(req: Request, res: Response) {
    const user = await this.userStorageInteractorImplementation.getUserById(parseInt(req.params.userId));
    if (!user) {
      res.status(400).send({ error: `user with id ${req.params.userId} doesn't exists` });
    } else if (user.getUserInfo().role === UserRoles.ADMIN || user.getUserInfo().role === UserRoles.SUPERADMIN) {
      res.status(401).send({ error: `Can not touch admins and superAdmins through this route` });
    } else {
      const userManager = new UserManager(user);
      userManager.userStorageInteractorAdapter = this.userStorageInteractorImplementation;
      await userManager.delete();
    }
  }



}