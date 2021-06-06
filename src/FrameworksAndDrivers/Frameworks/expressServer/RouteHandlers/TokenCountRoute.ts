import { Request, Response } from "express";
import TokenCountStorageInteractorImplementation from "../../../../InterfaceAdapters/TokenCountStorageInteractorImplementation";
import TokenCountManager from "../../../../UseCases/TokenCountManagementComponent/TokenCountManager";
import TokenCountStorageImplementation from "../../../Drivers/TokenCountStorageImplementation";
import Controller from "../Decorators/Controller";
import use from "../Decorators/MiddlewareDecorator";
import { get, put } from "../Decorators/PathAndRequestMethodDecorator";
import { getTokenCountManager } from "../Helpers/tokenCountHelper";
import { checkForAdminOrRegistrator } from "../Middlewares/TokenBaseRoutesMiddleware";
import { auth } from "../Middlewares/UserMiddlewares";

@Controller('/tokencount')
class TokenCountRoute {
  @get('/')
  @use(auth)
  @use(checkForAdminOrRegistrator)
  public async getTokenCountOfCurrentCustomer(req: Request, res: Response) {
    const tokenCountManager = getTokenCountManager();
    const currentCustomerTokenCount = await tokenCountManager.revcoverTokenCount();
    res.status(200).send({ currentCustomerTokenCount });
  }

  @get('/lastcustomertokencount')
  @use(auth)
  @use(checkForAdminOrRegistrator)
  public async getTokenCountOfLatestCustomer(req: Request, res: Response) {
    const tokenCountManager = getTokenCountManager();
    const lastCustomerTokenCount = await tokenCountManager.getLatestCustomerTokenCount();
    res.status(200).send({ lastCustomerTokenCount });
  }





}