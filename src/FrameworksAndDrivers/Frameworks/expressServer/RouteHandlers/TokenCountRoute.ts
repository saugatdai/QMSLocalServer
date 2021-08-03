import { Request, Response } from "express";
import Controller from "../Decorators/Controller";
import use from "../Decorators/MiddlewareDecorator";
import { get, patch, put } from "../Decorators/PathAndRequestMethodDecorator";
import { getCategoryTokenCountManager, getTokenCountManager } from "../Helpers/tokenCountHelper";
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

  @put('/setlastcustomertokencount/:tokencount')
  @use(auth)
  @use(checkForAdminOrRegistrator)
  public async setLastCustomerTokenCount(req: Request, res: Response) {
    const tokenCountManager = getTokenCountManager();
    await tokenCountManager.setLatestCustomerTokenCount(parseInt(req.params.tokencount));
    res.status(200).send();
  }

  @put('/presettokencount/:tokencount')
  @use(auth)
  @use(checkForAdminOrRegistrator)
  public async presetTokenCount(req: Request, res: Response) {
    const tokenCountManager = getTokenCountManager();
    await tokenCountManager.presetTokenCount(parseInt(req.params.tokencount));
    res.status(200).send();
  }

  @put('/resettokencount')
  @use(auth)
  @use(checkForAdminOrRegistrator)
  public async resetTokenCount(req: Request, res: Response) {
    const tokenCountManager = getTokenCountManager();
    await tokenCountManager.resetTokenCount();
    res.status(200).send();
  }

  @get('/categorytokencount/:category')
  @use(auth)
  @use(checkForAdminOrRegistrator)
  public async getCategoryTokenCount(req: Request, res: Response) {
    try {
      const tokenCategoryCountManager = getCategoryTokenCountManager(req.params.category);
      const currentCustomerCountOfCategory = await tokenCategoryCountManager.recoverTokenCount();
      res.status(200).send({ currentCustomerCountOfCategory });
    } catch (error) {
      res.status(500).send({ error: error.toString() });
    }
  }

  @put('/categorytokencount/categorycountpreset/:count')
  @use(auth)
  @use(checkForAdminOrRegistrator)
  public async presetCategoryTokenCount(req: Request, res: Response) {
    try {
      const tokenCategoryCountManager = getCategoryTokenCountManager(req.body.category);
      await tokenCategoryCountManager.presetTokenCount(parseInt(req.params.count));
      res.status(200).send();
    } catch (error) {
      res.status(500).send({ error: error.toString() });
    }
  }

  @put('/categorytokencount/categorycountreset')
  @use(auth)
  @use(checkForAdminOrRegistrator)
  public async resetCategoryTokenCount(req: Request, res: Response) {
    try {
      const tokenCategoryCountManager = getCategoryTokenCountManager(req.body.category);
      await tokenCategoryCountManager.resetTokenCount();
      res.status(200).send();
    } catch (error) {
      res.status(500).send({ error: error.toString() });
    }
  }

  @get('/categorytokencount/latestcustomercount/:category')
  @use(auth)
  @use(checkForAdminOrRegistrator)
  public async getLatestCustomerTokenCountForCategory(req: Request, res: Response) {
    try {
      const tokenCategoryCountManager = getCategoryTokenCountManager(req.params.category);
      const lastCustomerCount = await tokenCategoryCountManager.getLatestCustomerTokenCount();
      res.status(200).send({ lastCustomerCount })
    } catch (error) {
      res.status(500).send({ error: error.toString() })
    }
  }

  @put('/categorytokencount/latestcustomercountset/:count')
  @use(auth)
  @use(checkForAdminOrRegistrator)
  public async setLatestCustomerTokenCountForCategory(req: Request, res: Response) {
    const tokenCategoryCountManager = getCategoryTokenCountManager(req.body.category);
    await tokenCategoryCountManager.setLatestCustomerTokenCount(parseInt(req.params.count));
    res.status(200).send();
  }
}