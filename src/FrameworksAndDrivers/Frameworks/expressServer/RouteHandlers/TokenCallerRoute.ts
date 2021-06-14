import { Request, Response } from "express";
import Controller from "../Decorators/Controller";
import use from "../Decorators/MiddlewareDecorator";
import { post } from "../Decorators/PathAndRequestMethodDecorator";
import { auth, checkOperatorAuthority } from "../Middlewares/UserMiddlewares";


// TODO 0 should neither bypassed or called Again..
@Controller('/tokencaller')
class TokenCallerRoute {
  @post('/nexttoken')
  @use(auth)
  @use(checkOperatorAuthority)
  public async callNextToken(req: Request, res: Response) {
    res.status(200).send({ message: 'OK' });
  }
}