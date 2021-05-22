import { Request, Response } from 'express';
import { get } from '../Decorators/PathAndRequestMethodDecorator';
import UsersRouteController from '../Decorators/UsersRouteController';
import use from '../Decorators/MiddlewareDecorator';
import { userMiddleware1, userMiddleware2 } from '../Middlewares/UserMiddlewares';

@UsersRouteController('/users')
class UserRoute {
  @get('/')
  @use(userMiddleware1)
  public getAllUsers(req: Request, res: Response) {
    res.status(200).send('this route sends all the users');
  }

  @get('/:username')
  @use(userMiddleware2)
  @use(userMiddleware1)
  public getUserByUsername(req: Request, res: Response) {
    res.status(200).send(`This route sends profile of ${req.params.username}`);
  }
}