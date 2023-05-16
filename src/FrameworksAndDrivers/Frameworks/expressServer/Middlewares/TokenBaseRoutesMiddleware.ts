import { Request, Response, NextFunction } from 'express';
import UserRoles from '../../../../Entities/UserCore/UserRoles';

export const checkForAdminOrRegistrator = (req: Request, res: Response, next: NextFunction) => {
  if (req.body.user.getUserInfo().role === UserRoles.ADMIN || req.body.user.getUserInfo().role === UserRoles.REGISTRATOR) {
    next();
  } else {
    res.status(400).send({ error: 'Either regiter or admin can access this route' });
  }
}

export const checkForRegistrator = (req: Request, res: Response, next: NextFunction) => {
  if (req.body.user.getUserInfo().role !== UserRoles.REGISTRATOR) {
    res.status(400).send({ error: 'Only Registrator can access this route' });
  } else {
    next();
  }
}