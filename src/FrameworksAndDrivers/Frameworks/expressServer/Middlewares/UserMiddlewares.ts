import { NextFunction, Request, RequestHandler, Response } from 'express';
import UserRoles from '../../../../Entities/UserCore/UserRoles';

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

export const userMiddleware1 = (req: Request, res: Response, next: NextFunction) => {
  console.log('usermiddleware1');
  next();
}

export const userMiddleware2 = (req: Request, res: Response, next: NextFunction) => {
  console.log('usermiddleware2');
  next();
}