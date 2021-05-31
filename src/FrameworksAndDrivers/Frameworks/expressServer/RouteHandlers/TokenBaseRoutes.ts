import { Request, Response } from 'express';

import Controller from "../Decorators/Controller";
import { get } from "../Decorators/PathAndRequestMethodDecorator";
import { auth } from '../Middlewares/UserMiddlewares';
import use from '../Decorators/MiddlewareDecorator';
import { checkForAdminOrRegistrator } from '../Middlewares/TokenBaseRoutesMiddleware';
import TokenBaseManager from '../../../../UseCases/TokenBaseManagementComponent/TokenBaseManager';
import TokenBaseStorageImplementation from '../../../Drivers/TokenBaseStorageImplementation';
import TokenCountManager from '../../../../UseCases/TokenCountManagementComponent/TokenCountManager';
import TokenCountStorageImplementation from '../../../Drivers/TokenCountStorageImplementation';
import TokenCountStorageInteractorImplementation from '../../../../InterfaceAdapters/TokenCountStorageInteractorImplementation';
import Token from '../../../../Entities/TokenCore/Token';

@Controller('/tokenbase')
class TokenBaseRoutes {
  @get('/')
  @use(auth)
  @use(checkForAdminOrRegistrator)

  public async getAllTokenBases(req: Request, res: Response) {
    const nextAvailableTokenId = await TokenBaseStorageImplementation.getNextAvailableTokenId();
    const tokenCountManager = this.getTokenCountManager();
    const tokenNumber = await tokenCountManager.revcoverTokenCount();
    const token: Token = {
      tokenId: nextAvailableTokenId,
      tokenNumber: tokenNumber + 1,
      date: new Date(),
    }

    console.log(token);
    res.status(200).send({ message: 'New route for tokenbase....' });
  }

  private getTokenCountManager() {
    const tokenCountStorageInteractor = new TokenCountStorageInteractorImplementation(TokenCountStorageImplementation);
    const tokenCountManager = new TokenCountManager(tokenCountStorageInteractor);
    return tokenCountManager;
  }


}