import { Request, Response } from "express";
import Controller from "../Decorators/Controller";
import use from "../Decorators/MiddlewareDecorator";
import { get, post } from "../Decorators/PathAndRequestMethodDecorator";
import { auth, checkForOperatorcounter, checkOperatorAuthority } from "../Middlewares/UserMiddlewares";
import { processTokenCallingTask } from "../Helpers/TokenCallerRouteHelper";
import { TokenStatus } from "../../../../UseCases/TokenBaseManagementComponent/TokenBaseModule";

@Controller('/tokencaller')
class TokenCallerRoute {
  @post('/nexttoken')
  @use(auth)
  @use(checkOperatorAuthority)
  @use(checkForOperatorcounter)
  public async callNextToken(req: Request, res: Response) {
    processTokenCallingTask({ req, res, tokenStatus: TokenStatus.PROCESSED });
  }

  @post('/bypasstoken')
  @use(auth)
  @use(checkOperatorAuthority)
  @use(checkForOperatorcounter)
  public async byPassToken(req: Request, res: Response) {
    processTokenCallingTask({ req, res, tokenStatus: TokenStatus.BYPASS });
  }

  @post('/callagaintoken')
  @use(auth)
  @use(checkOperatorAuthority)
  @use(checkForOperatorcounter)
  public async callAgainToken(req: Request, res: Response) {
    processTokenCallingTask({ req, res, tokenStatus: TokenStatus.CALLAGAIN });
  }

  @post('/callrandom')
  @use(auth)
  @use(checkOperatorAuthority)
  @use(checkForOperatorcounter)
  public async callRandom(req: Request, res: Response) {
    processTokenCallingTask({ req, res, tokenStatus: TokenStatus.RANDOMPROCESSED });
  }

  @post('/forwardtoken')
  @use(auth)
  @use(checkOperatorAuthority)
  @use(checkForOperatorcounter)
  public async forwardToken(req: Request, res: Response) {
    processTokenCallingTask({ req, res, tokenStatus: TokenStatus.FORWARD });
  }
}
