import { NextFunction, Request, RequestHandler, Response } from 'express';

export const userMiddleware1 = (req: Request, res: Response, next: NextFunction) => {
  console.log('usermiddleware1');
  next();
}

export const userMiddleware2 = (req: Request, res: Response, next: NextFunction) => {
  console.log('usermiddleware2');
  next();
}