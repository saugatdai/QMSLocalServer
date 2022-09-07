import { Request, Response } from "express";
import Controller from "../Decorators/Controller";
import use from "../Decorators/MiddlewareDecorator";
import { del, get, post } from "../Decorators/PathAndRequestMethodDecorator";
import { auth, checkForOperatorcounter, checkOperatorAuthority } from "../Middlewares/UserMiddlewares";
import { beginTokenCallTask, processTokenCallingTask } from "../Helpers/TokenCallerRouteHelper";
import { TokenStatus } from "../../../../UseCases/TokenBaseManagementComponent/TokenBaseModule";
import Operator from "../../../../Entities/UserCore/Operator";
import TokenCallingStateManagerSingleton from "../../../../UseCases/TokenCallingComponent/TokenCallingStateManagerSingleton";

@Controller('/tokencaller')
class TokenCallerRoute {
  @post('/nexttoken')
  @use(auth)
  @use(checkOperatorAuthority)
  @use(checkForOperatorcounter)
  public async callNextToken(req: Request, res: Response) {
    try {
      await beginTokenCallTask({ req, res, tokenStatus: TokenStatus.PROCESSED });
    } catch (error) {
      res.status(500).send({ error: error.toString() });
    }
  }

  @post('/bypasstoken')
  @use(auth)
  @use(checkOperatorAuthority)
  @use(checkForOperatorcounter)
  public async byPassToken(req: Request, res: Response) {
    try {
      await beginTokenCallTask({ req, res, tokenStatus: TokenStatus.BYPASS });
    } catch (error) {
      res.status(500).send({ error: error.toString() });
    }
  }

  @post('/callagaintoken')
  @use(auth)
  @use(checkOperatorAuthority)
  @use(checkForOperatorcounter)
  public async callAgainToken(req: Request, res: Response) {
    try {
      await processTokenCallingTask({ req, res, tokenStatus: TokenStatus.CALLAGAIN });
    } catch (error) {
      res.status(500).send({ error: error.toString() })
    }
  }

  @post('/callrandom')
  @use(auth)
  @use(checkOperatorAuthority)
  @use(checkForOperatorcounter)
  public async callRandom(req: Request, res: Response) {
    try {
      await processTokenCallingTask({ req, res, tokenStatus: TokenStatus.RANDOMPROCESSED });
    } catch (error) {
      res.status(500).send({ error: error.toString() });
    }
  }

  @post('/forwardtoken')
  @use(auth)
  @use(checkOperatorAuthority)
  @use(checkForOperatorcounter)
  public async forwardToken(req: Request, res: Response) {
    try {
      beginTokenCallTask({ req, res, tokenStatus: TokenStatus.FORWARD });
    } catch (error) {
      res.status(500).send({ error: error.toString() })
    }
  }

  @del('/removeoperatorlockedState')
  @use(auth)
  @use(checkOperatorAuthority)
  @use(checkForOperatorcounter)
  public async removeLockedState(req: Request, res: Response) {
    const operator = req.body.user as Operator;

    TokenCallingStateManagerSingleton.getInstance().removeAllStateLockerForAnOperator(operator.getUserInfo().username);
    console.log("Locked states removed for : " + operator.getUserInfo().username);
    res.status(200).send({ success: "Removed all State Lockers..." });
  }
}
