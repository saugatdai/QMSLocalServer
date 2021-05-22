import { Request, Response } from 'express';

import use from '../Decorators/MiddlewareDecorator';
import { get, post } from '../Decorators/PathAndRequestMethodDecorator';
import UsersRouteController from '../Decorators/UsersRouteController';
import UserStorageHelper from '../Helpers/UserStorageHelper';
import { validateUserData } from '../Middlewares/UserMiddlewares';
import UserManager from '../../../../UseCases/UserManagementComponent/UserManager';
import User, { UserData } from '../../../../Entities/UserCore/User';
import UserFactory from '../../../../Entities/UserCore/UserFactory';

@UsersRouteController('/users')
class UserRoute {
  @get('/')
  public async getAllUsers(req: Request, res: Response) {
    const userStorageHelper = new UserStorageHelper();
    const users = await userStorageHelper.userStorageInteractorImplementation.getAllUsers();
    res.status(200).send(users);
  }

  @post('/')
  @use(validateUserData)
  public async createAUser(req: Request, res: Response) {
    try {
      const userdData: UserData = req.body;
      const user: User = new UserFactory().getUser(userdData);

      const userStorageHelper = new UserStorageHelper();
      const userId = await userStorageHelper.getNextAvailableId();
      user.getUserInfo().id = userId;

      const userManager = new UserManager(user);

      userManager.userStorageInteractorAdapter = userStorageHelper.userStorageInteractorImplementation;
      await userManager.store();

      const createdUser = await userStorageHelper.userStorageInteractorImplementation.getUserById(userId);
      res.status(201).send(createdUser);
    } catch (error) {
      res.status(500).send({ error: error.toString() });
    }
  }

  @get('/:username')
  public getUserByUsername(req: Request, res: Response) {
    res.status(200).send(`This route sends profile of ${req.params.username}`);
  }
}