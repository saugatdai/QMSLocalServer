import { Request, Response } from 'express';

import Controller from "../Decorators/Controller";
import { get, post } from "../Decorators/PathAndRequestMethodDecorator";
import { auth } from '../Middlewares/UserMiddlewares';
import use from '../Decorators/MiddlewareDecorator';
import { checkForAdminOrRegistrator, checkForRegistrator } from '../Middlewares/TokenBaseRoutesMiddleware';
import TokenBaseStorageImplementation from '../../../Drivers/TokenBaseStorageImplementation';
import Token from '../../../../Entities/TokenCore/Token';
import TokenBaseStorageInteractorImplementation from '../../../../InterfaceAdapters/TokenBaseStorageInteractorImplementation';
import { getTokenCountManager } from '../Helpers/tokenCountHelper';
import { TokenBaseObject } from '../../../../UseCases/TokenBaseManagementComponent/TokenBaseModule';
import { getTokenBaseManager } from '../Helpers/tokenBaseRouteHelper';


@Controller('/tokenbase')
class TokenBaseRoutes {
  @get('/')
  @use(auth)
  @use(checkForAdminOrRegistrator)
  public async getAllTokenBases(req: Request, res: Response) {
    try {
      const tokenBaseStorageInteractorImplementation = new TokenBaseStorageInteractorImplementation(TokenBaseStorageImplementation);
      const allTokenBases = await tokenBaseStorageInteractorImplementation.readAllTokenBases();
      res.status(200).send(allTokenBases);
    } catch (error) {
      res.status(500).send({ error: error.toString() });
    }
  }

  @get('/createatokenbase')
  @use(auth)
  @use(checkForRegistrator)
  public async createANewTokenBase(req: Request, res: Response) {
    const nextAvailableTokenId = await TokenBaseStorageImplementation.getNextAvailableTokenId();
    const tokenCountManager = getTokenCountManager();
    const tokenNumber = await tokenCountManager.revcoverTokenCount();

    const token: Token = {
      tokenId: nextAvailableTokenId,
      tokenNumber: tokenNumber + 1,
      date: new Date(),
    }
    const tokenBaseObject = new TokenBaseObject(token);

    const tokenBaseManager = getTokenBaseManager();
    tokenBaseManager.tokenBase = tokenBaseObject;

    await tokenBaseManager.createATokenBase();
    res.status(200).send(tokenBaseManager.tokenBase);
  }
}