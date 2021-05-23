import { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcrypt';

import UserRoles from '../../../../Entities/UserCore/UserRoles';
import UserStorageHelper from '../Helpers/userRouteHelper/UserStorageHelper';

export const validateUserData = (req: Request, res: Response, next: NextFunction) => {
  if (!req.body.username || !req.body.role || !req.body.password) {
    res.status(400).send({ error: 'invalid userdata' });
  } else {
    const username: string = req.body.username;
    const role: UserRoles = req.body.role;
    const password: string = req.body.password;

    if (username.length < 3) {
      res.status(400).send({ error: 'Username must be atleast 3 characters long' })
    } else if (!Object.values(UserRoles).includes(role)) {
      res.status(400).send({ error: 'Invalid Role' });
    } else if (password.length < 8) {
      res.status(400).send({ error: 'password must be atleast 8 characters long' });
    } else {
      next();
    }
  }
}

export const superAdminCreateCheck = async (req: Request, res: Response, next: NextFunction) => {
  const userStorageHelper = new UserStorageHelper();
  const superAdmin = await userStorageHelper.userStorageInteractorImplementation.getUsersByRole(UserRoles.SUPERADMIN);

  if (superAdmin.length && req.body.role === UserRoles.SUPERADMIN) {
    res.status(400).send({ error: "SuperAdministrator already exists" });
  } else {
    next();
  }
}

export const hashPassword = async (req: Request, res: Response, next: NextFunction) => {
  req.body.password = await bcrypt.hash(req.body.password, 10);
  next();
}

// TODO validate superuser while creating admin
export const validateAdminCreatinfo = async (req: Request, res: Response, next: NextFunction) => {

}

// TODO validate admin info while creating other users
export const validateForAdmin = async (req: Request, res: Response, next: NextFunction) => {

}

export const validateLoginCredentialsPresence = (req: Request, res: Response, next: NextFunction) => {
  if (!req.body.username || !req.body.password) {
    res.status(400).send({ error: 'Bad login credentials' });
  } else {
    next();
  }
}

