import { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import UserRoles from '../../../../Entities/UserCore/UserRoles';
import UserStorageHelper from '../Helpers/userRouteHelper/UserStorageHelper';
import OtherConstants from '../Constants/OtherConstants';
import AuthTokenHelper from '../Helpers/userRouteHelper/AuthTokenHelper';
import UserManager from '../../../../UseCases/UserManagementComponent/UserManager';

type jwtDecodedData = {
  id: number;
}

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

export const superAdminPresenceCreateCheck = async (req: Request, res: Response, next: NextFunction) => {
  const userStorageHelper = new UserStorageHelper();
  const superAdmin = await userStorageHelper.userStorageInteractorImplementation.getUsersByRole(UserRoles.SUPERADMIN);

  if (req.body.role !== UserRoles.SUPERADMIN) {
    res.status(400).send({ error: 'This route is for creating superadmins only' });
  } else if (superAdmin.length && req.body.role === UserRoles.SUPERADMIN) {
    res.status(400).send({ error: "SuperAdministrator already exists" });
  } else {
    next();
  }
}

export const hashPassword = async (req: Request, res: Response, next: NextFunction) => {
  req.body.password = await bcrypt.hash(req.body.password, 10);
  next();
}

export const validateLoginCredentialsPresence = (req: Request, res: Response, next: NextFunction) => {
  if (!req.body.username || !req.body.password) {
    res.status(400).send({ error: 'Bad login credentials' });
  } else {
    next();
  }
}


export const auth = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    jwt.verify(token, OtherConstants.JWTSECRET, async (error, data: jwtDecodedData) => {
      if (error) {
        res.status(401).send({ error: 'Invalid Token' });
      } else {
        const tokensHolder = await new AuthTokenHelper().getAllTokensHolderById(data.id);
        if (!tokensHolder) {
          res.status(401).send({ error: 'Received token does not yield any token holder' });
        } else {
          const match = tokensHolder.tokens.find(loopToken => token === loopToken);
          if (match) {
            const user = await new UserStorageHelper().userStorageInteractorImplementation.getUserById(data.id);
            req.body.user = user;
            next();
          } else {
            res.status(401).send({ error: 'Non-existing token' });
          }
        }
      }
    });
  } else {
    res.status(401).send({ error: 'Requires Login' });
  }
}

export const checkAUthorityForCreatingAUser = async (req: Request, res: Response, next: NextFunction) => {
  if (req.body.role === UserRoles.ADMIN && req.body.user.getUserInfo().role !== UserRoles.SUPERADMIN) {
    res.status(400).send({ error: 'Only superadmins can create admin' });
  } else if (req.body.role === UserRoles.SUPERADMIN) {
    res.status(400).send({ error: 'Can not create a superadmin from this route' });
  } else if (req.body.role !== UserRoles.ADMIN && req.body.user.getUserInfo().role != UserRoles.ADMIN) {
    res.status(400).send({ error: 'Only admins can create users with such roles' });
  } else {
    next();
  }
}

export const checkAdminAuthority = async (req: Request, res: Response, next: NextFunction) => {
  if (req.body.user && req.body.user.getUserInfo().role !== UserRoles.ADMIN) {
    res.status(401).send({ error: 'Must be Admin' });
  } else {
    next();
  }
}

export const checkOperatorAuthority = async (req: Request, res: Response, next: NextFunction) => {
  if (req.body.user && req.body.user.getUserInfo().role !== UserRoles.OPERATOR) {
    res.status(401).send({ error: 'Only operator has access to this route' });
  } else {
    next();
  }
}

export const checkForOperatorcounter = async (req: Request, res: Response, next: NextFunction) => {
  if (req.body.user && !req.body.user.getUserInfo().counter) {
    res.status(401).send({ error: 'Operator must have a counter' });
  } else {
    next();
  }
}

export const checkSuperAdminAuthority = async (req: Request, res: Response, next: NextFunction) => {
  if (req.body.user && req.body.user.getUserInfo().role !== UserRoles.SUPERADMIN) {
    res.status(401).send({ error: 'Must be superadmin to access admins' });
  } else {
    next();
  }
}

