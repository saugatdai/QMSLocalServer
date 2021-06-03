import { request, Request, Response } from 'express';

import Controller from "../Decorators/Controller";
import { get, post } from "../Decorators/PathAndRequestMethodDecorator";
import { auth } from '../Middlewares/UserMiddlewares';
import use from '../Decorators/MiddlewareDecorator';
import { checkForAdminOrRegistrator, checkForRegistrator } from '../Middlewares/TokenBaseRoutesMiddleware';
import { checkAdminAuthority } from '../Middlewares/UserMiddlewares'
import TokenBaseStorageImplementation from '../../../Drivers/TokenBaseStorageImplementation';
import Token from '../../../../Entities/TokenCore/Token';
import TokenBaseStorageInteractorImplementation from '../../../../InterfaceAdapters/TokenBaseStorageInteractorImplementation';
import { getCategoryTokenCountManager, getTokenCountManager } from '../Helpers/tokenCountHelper';
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
    const tokenNumber = await tokenCountManager.getLatestCustomerTokenCount();
    const token: Token = {
      tokenId: nextAvailableTokenId,
      tokenNumber: tokenNumber + 1,
      date: new Date(),
    }
    const tokenBaseObject = new TokenBaseObject(token);

    const tokenBaseManager = getTokenBaseManager();
    tokenBaseManager.tokenBase = tokenBaseObject;
    await tokenBaseManager.createATokenBase();

    await tokenCountManager.setLatestCustomerTokenCount(token.tokenNumber);

    res.status(200).send(tokenBaseManager.tokenBase);
  }

  @get('/createatokenbase/:category')
  @use(auth)
  @use(checkForRegistrator)
  public async createANewCategoryTokenBaes(req: Request, res: Response) {
    try {
      const nextAvailableTokenId = await TokenBaseStorageImplementation.getNextAvailableTokenId();
      const tokenCategoryCountManager = getCategoryTokenCountManager(req.params.category);
      const tokenNumber = await tokenCategoryCountManager.getLatestCustomerTokenCount();
      const token: Token = {
        tokenId: nextAvailableTokenId,
        tokenNumber: tokenNumber + 1,
        date: new Date(),
        tokenCategory: req.params.category
      }
      const tokenBaseObject = new TokenBaseObject(token);
      const tokenBaseManager = getTokenBaseManager();
      tokenBaseManager.tokenBase = tokenBaseObject;
      await tokenBaseManager.createATokenBase();

      await tokenCategoryCountManager.setLatestCustomerTokenCount(token.tokenNumber);
      res.status(200).send(tokenBaseManager.tokenBase);
    } catch (error) {
      res.status(500).send({ error: error.toString() });
    }
  }

  @post('/createtokencategory')
  @use(auth)
  @use(checkAdminAuthority)
  public async createACategory(req: Request, res: Response) {
    const categoryTokenCountManager = getCategoryTokenCountManager(req.body.category);
    await categoryTokenCountManager.createACategory(req.body.category);
    res.status(200).send();
  }




}