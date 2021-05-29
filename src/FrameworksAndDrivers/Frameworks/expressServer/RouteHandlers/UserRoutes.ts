import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jsonwebtoken from 'jsonwebtoken';

import use from '../Decorators/MiddlewareDecorator';
import { del, get, patch, post } from '../Decorators/PathAndRequestMethodDecorator';
import UsersRouteController from '../Decorators/UsersRouteController';
import UserStorageHelper from '../Helpers/userRouteHelper/UserStorageHelper';
import {
  superAdminPresenceCreateCheck,
  validateUserData,
  validateLoginCredentialsPresence,
  hashPassword,
  auth,
  checkAUthorityForCreatingAUser,
  checkAdminAuthority,
  checkSuperAdminAuthority
} from '../Middlewares/UserMiddlewares';
import AuthTokenHelper from '../Helpers/userRouteHelper/AuthTokenHelper';
import OtherConstants from '../Constants/OtherConstants';
import UserRoles from '../../../../Entities/UserCore/UserRoles';

@UsersRouteController('/users')
class UserRoute {
  @get('/')
  @use(auth)
  @use(checkAdminAuthority)
  public async getAllUsers(req: Request, res: Response) {
    const userStorageHelper = new UserStorageHelper();
    let users = await userStorageHelper.userStorageInteractorImplementation.getAllUsers();
    users = users.filter(user => user.getUserInfo().role !== UserRoles.SUPERADMIN && user.getUserInfo().role !== UserRoles.ADMIN);
    res.status(200).send(users);
  }

  @get('/getuser/:userId')
  @use(auth)
  @use(checkAdminAuthority)
  public async getAUserProfile(req: Request, res: Response) {
    const user = await new UserStorageHelper().userStorageInteractorImplementation.getUserById(parseInt(req.params.userId));
    res.status(200).send(user);
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

  @patch('/:userId')
  @use(auth)
  @use(checkAdminAuthority)
  @use(validateUserData)
  @use(hashPassword)
  public async updateAUser(req: Request, res: Response) {
    try {
      const updatedUser = await new UserStorageHelper().updateUser(req, res);
      res.status(200).send(updatedUser);
    } catch (error) {
      res.status(500).send({ error: error.toString() });
    }
  }

  @del('/:userId')
  @use(auth)
  @use(checkAdminAuthority)
  public async deleteAUser(req: Request, res: Response) {
    res.status(200).send('holsu')
  }

  @post('/superAdmin')
  @use(validateUserData)
  @use(superAdminPresenceCreateCheck)
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

  @get('/admins')
  @use(auth)
  @use(checkSuperAdminAuthority)
  public async getAdmins(req: Request, res: Response) {
    const admins = await new UserStorageHelper().userStorageInteractorImplementation.getUsersByRole(UserRoles.ADMIN);
    res.status(200).send(admins);
  }

  @get('/admins/:adminId')
  @use(auth)
  @use(checkSuperAdminAuthority)
  public async getAdminProfile(req: Request, res: Response) {
    const admin = await new UserStorageHelper().userStorageInteractorImplementation.getUserById(parseInt(req.params.adminId));
    res.status(200).send(admin);
  }

  @patch('/admins/:adminId')
  @use(validateUserData)
  @use(auth)
  @use(checkSuperAdminAuthority)
  @use(hashPassword)
  public async editAdmins(req: Request, res: Response) {
    try {
      const updatedAdmin = await new UserStorageHelper().updateAdmin(req, res);
      res.status(200).send(updatedAdmin);
    } catch (error) {
      res.status(500).send({ error: error.toString() });
    }
  }

  @del('/admins/:adminId')
  @use(auth)
  @use(checkSuperAdminAuthority)
  public async deleteAdmin(req: Request, res: Response) {
    await new UserStorageHelper().deleteAdmin(req, res);
    res.status(200).send();
  }

}