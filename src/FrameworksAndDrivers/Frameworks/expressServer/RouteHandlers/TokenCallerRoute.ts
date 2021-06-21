import { Request, Response } from "express";
import Controller from "../Decorators/Controller";
import use from "../Decorators/MiddlewareDecorator";
import { post } from "../Decorators/PathAndRequestMethodDecorator";
import { auth, checkOperatorAuthority } from "../Middlewares/UserMiddlewares";
import { getCallerParameters, getTokenAfterRegistrationToTokenCallingState, sendCallingResponse, sendErrorMessage } from "../Helpers/TokenCallerRouteHelper";
import { TokenStatus } from "../../../../UseCases/TokenBaseManagementComponent/TokenBaseModule";
import TokenCallingStateManagerSingleton from '../../../../UseCases/TokenCallingComponent/TokenCallingStateManagerSingleton';

// TODO 0 should neither bypassed or called Again..
@Controller('/tokencaller')
class TokenCallerRoute {
  @post('/nexttoken')
  @use(auth)
  @use(checkOperatorAuthority)
  public async callNextToken(req: Request, res: Response) {
    const { tokenNumber, tokenCategory, operator } = getCallerParameters(req, res);
    const tokenLockStatusForOperator = TokenCallingStateManagerSingleton.getInstance().isTokenStateForOperatorLocked(operator.getUserInfo().username);

    if (tokenLockStatusForOperator) {
      res.status(400).send({ error: 'Some processing for your previous request still in progress' });
    } else {
      const tokenInfo = { tokenNumber, tokenCategory };
      const token = await getTokenAfterRegistrationToTokenCallingState(req.body.user, tokenInfo);
      const tokenStatus = TokenStatus.PROCESSED;
      await sendCallingResponse(token, { req, res, tokenStatus });
    }
  }

  @post('/bypasstoken')
  @use(auth)
  @use(checkOperatorAuthority)
  public async byPassToken(req: Request, res: Response) {
    const { tokenNumber, tokenCategory, operator } = getCallerParameters(req, res);
    const tokenLockStatusForOperator = TokenCallingStateManagerSingleton.getInstance().isTokenStateForOperatorLocked(operator.getUserInfo().username);

    if (tokenLockStatusForOperator) {
      res.status(400).send({ error: 'Some processing for your previous request still in progress' });
    } else {
      const tokenInfo = { tokenNumber, tokenCategory };
      const token = await getTokenAfterRegistrationToTokenCallingState(req.body.user, tokenInfo);
      const tokenStatus = TokenStatus.BYPASS;
      await sendCallingResponse(token, { req, res, tokenStatus });
    }
  }
}