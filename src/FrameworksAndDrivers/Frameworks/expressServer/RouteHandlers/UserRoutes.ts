import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jsonwebtoken from 'jsonwebtoken';

import use from '../Decorators/MiddlewareDecorator';
import { get, post } from '../Decorators/PathAndRequestMethodDecorator';
import UsersRouteController from '../Decorators/UsersRouteController';
import UserStorageHelper from '../Helpers/userRouteHelper/UserStorageHelper';
import { superAdminCreateCheck, validateUserData, validateLoginCredentialsPresence, hashPassword, auth, checkAUthorityForCreatingAUser } from '../Middlewares/UserMiddlewares';
import UserManager from '../../../../UseCases/UserManagementComponent/UserManager';
import AuthTokenHelper from '../Helpers/userRouteHelper/AuthTokenHelper';
import OtherConstants from '../Constants/OtherConstants';

@UsersRouteController('/users')
class UserRoute {
  @get('/')
  public async getAllUsers(req: Request, res: Response) {
    const userStorageHelper = new UserStorageHelper();
    const users = await userStorageHelper.userStorageInteractorImplementation.getAllUsers();
    res.status(200).send(users);
  }

  @post('/')
  @use(auth)
  @use(checkAUthorityForCreatingAUser)
  @use(validateUserData)
  @use(hashPassword)
  public async createAUser(req: Request, res: Response) {
    try {
      const createdUser = await new UserStorageHelper().createAUser(req, res);
      res.status(201).send(createdUser);
    } catch (error) {
      res.status(500).send({ error: error.toString() });
    }
  }

  @post('/superAdmin')
  @use(validateUserData)
  @use(superAdminCreateCheck)
  @use(hashPassword)
  public async createASuperAdmin(req: Request, res: Response) {
    try {
      const createdSuperAdmin = await new UserStorageHelper().createAUser(req, res);
      res.status(201).send(createdSuperAdmin);
    } catch (error) {
      res.status(500).send({ error: error.toString() });
    }
  }

  @post('/login')
  @use(validateLoginCredentialsPresence)
  public async login(req: Request, res: Response) {
    const userStorageHelper = new UserStorageHelper();
    try {
      const users = await userStorageHelper.userStorageInteractorImplementation.getAllUsers();
      const user = users.find(user => user.getUserInfo().username === req.body.username);
      if (!user) {
        throw new Error('Invalid username');
      }
      const match = await bcrypt.compare(req.body.password, user.getUserInfo().password);
      if (!match) {
        throw new Error('Invalid password');
      }
      jsonwebtoken.sign({ id: user.getUserInfo().id }, OtherConstants.JWTSECRET, async (error: Error, token: string) => {
        await new AuthTokenHelper().storeATokenForUser({ id: user.getUserInfo().id, token })
        res.status(200).send({
          user, token
        });
      });
    } catch (error) {
      res.status(400).send({ error: error.toString() });
    }
  }

}