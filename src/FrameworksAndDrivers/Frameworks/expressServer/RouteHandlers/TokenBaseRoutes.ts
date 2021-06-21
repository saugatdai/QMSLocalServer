import * as util from 'util';
import * as fs from 'fs';
import * as path from 'path';

import { Request, Response } from 'express';

import Controller from "../Decorators/Controller";
import { del, get, post } from "../Decorators/PathAndRequestMethodDecorator";
import { auth } from '../Middlewares/UserMiddlewares';
import use from '../Decorators/MiddlewareDecorator';
import { checkForAdminOrRegistrator, checkForRegistrator } from '../Middlewares/TokenBaseRoutesMiddleware';
import { checkAdminAuthority } from '../Middlewares/UserMiddlewares'
import TokenBaseStorageImplementation from '../../../Drivers/TokenBaseStorageImplementation';
import TokenBaseStorageInteractorImplementation from '../../../../InterfaceAdapters/TokenBaseStorageInteractorImplementation';
import { getCategoryTokenCountManager } from '../Helpers/tokenCountHelper';
import { TokenStatus } from '../../../../UseCases/TokenBaseManagementComponent/TokenBaseModule';
import { createNewCategoryTokenBaseObject, createNewNonCategoryTokenBaseObject } from '../Helpers/tokenBaseRouteHelper';
import TokenCountManager from '../../../../UseCases/TokenCountManagementComponent/TokenCountManager';
import TokenCategoryCountStorageInteractorImplementation from '../../../../InterfaceAdapters/TokenCategoryCountStorageInteractorImplementation';
import TokenCountStorageImplementation from '../../../Drivers/TokenCountStorageImplementation';

const writeFile = (filename: string, data: string) =>
  util.promisify(fs.writeFile)(filename, data, 'utf-8');


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
    try {
      const tokenBaseObject = await createNewNonCategoryTokenBaseObject();
      res.status(200).send(tokenBaseObject);
    } catch (error) {
      res.status(500).send({ error: error.toString() });
    }
  }

  @get('/createatokenbase/:category')
  @use(auth)
  @use(checkForRegistrator)
  public async createANewCategoryTokenBaes(req: Request, res: Response) {
    try {
      const tokenBaseObject = await createNewCategoryTokenBaseObject(req.params.category);
      res.status(200).send(tokenBaseObject);
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
    res.status(201).send();
  }

  @get('/filterbystatus/:status')
  @use(auth)
  @use(checkAdminAuthority)
  public async filterTokenBaseByStatus(req: Request, res: Response) {
    try {
      const tokenBaseStorageInteractorImplementation = new TokenBaseStorageInteractorImplementation(TokenBaseStorageImplementation);
      const filteredTokenBase = await tokenBaseStorageInteractorImplementation.filterTokenBaseByStatus(req.params.status as TokenStatus);
      res.status(200).send(filteredTokenBase);
    } catch (error) {
      res.status(500).send({ error: error.toString() });
    }
  }

  @get('/filterbystatusanddate/:status/:date')
  @use(auth)
  @use(checkAdminAuthority)
  public async filterTokenBaseByCategoryAndDate(req: Request, res: Response) {
    try {
      const tokenBaseStorageInteractorImplementation = new TokenBaseStorageInteractorImplementation(TokenBaseStorageImplementation);
      const date = new Date(req.params.date);
      const filteredTokenBase = await tokenBaseStorageInteractorImplementation.filterTokenBaseByStatus(req.params.status as TokenStatus, date);
      res.status(200).send(filteredTokenBase);
    } catch (error) {
      res.status(500).send({ error: error.toString() });
    }
  }

  @get('/filterbydate/:date')
  @use(auth)
  @use(checkAdminAuthority)
  public async filterTokenBaseByDate(req: Request, res: Response) {
    try {
      const tokenBaseStorageInteractorImplementation = new TokenBaseStorageInteractorImplementation(TokenBaseStorageImplementation);
      const filteredTokenBases = await tokenBaseStorageInteractorImplementation.filterTokenBaseByTokenDate(req.params.date);
      res.status(200).send(filteredTokenBases);
    } catch (error) {
      res.status(500).send({ error: error.toString() });
    }
  }

  @get('/filterbycategory')
  @use(auth)
  @use(checkAdminAuthority)
  public async filterTokneBaseWithNoCategories(req: Request, res: Response) {
    try {
      const tokenBaseStorageInteractorImplementation = new TokenBaseStorageInteractorImplementation(TokenBaseStorageImplementation);
      const allTokenBases = await tokenBaseStorageInteractorImplementation.readAllTokenBases();
      const noCategoryTokenBases = allTokenBases.filter(tokenBase => !tokenBase.token.tokenCategory);
      res.status(200).send(noCategoryTokenBases);
    } catch (error) {
      res.status(500).send({ error: error.toString() });
    }
  }

  @get('/filterbycategory/:category')
  @use(auth)
  @use(checkAdminAuthority)
  public async filterTokenBaseByCategory(req: Request, res: Response) {
    try {
      const tokenBaseStorageInteractorImplementation = new TokenBaseStorageInteractorImplementation(TokenBaseStorageImplementation);
      const allTokenBases = await tokenBaseStorageInteractorImplementation.readAllTokenBases();
      const filteredTokenBases = tokenBaseStorageInteractorImplementation.getTokenBasesByTokenCategory(allTokenBases, req.params.category);
      res.status(200).send(filteredTokenBases);
    } catch (error) {
      res.status(500).send({ error: error.toString() });
    }
  }

  @get('/todaystokenbase/:tokenNumber')
  @use(auth)
  @use(checkAdminAuthority)
  public async getTodaysTokenBaseByTokenNumber(req: Request, res: Response) {
    try {
      const tokenBaseStorageInteractorImplementation = new TokenBaseStorageInteractorImplementation(TokenBaseStorageImplementation);
      const todaysTokenBases = await tokenBaseStorageInteractorImplementation.getTodaysTokenBaseByTokenNumber(parseInt(req.params.tokenNumber));
      res.send(todaysTokenBases);
    } catch (error) {
      res.status(500).send({ error: error.toString() });
    }
  }

  @get('/tokenbasebytokenid/:tokenid')
  @use(auth)
  @use(checkAdminAuthority)
  public async getTokenBaseById(req: Request, res: Response) {
    try {
      const tokenBaseStorageInteractorImplementation = new TokenBaseStorageInteractorImplementation(TokenBaseStorageImplementation);
      const tokenBase = await tokenBaseStorageInteractorImplementation.getTokenBaseByTokenId(parseInt(req.params.tokenid));
      res.status(200).send(tokenBase);
    } catch (error) {
      res.status(500).send({ error: error.toString() });
    }
  }

  @del('/')
  @use(auth)
  @use(checkAdminAuthority)
  public async resetAllTokenBases(req: Request, res: Response) {
    const tokenBaseStorageInteractorImplementation = new TokenBaseStorageInteractorImplementation(TokenBaseStorageImplementation);
    await tokenBaseStorageInteractorImplementation.resetTokenBase();

    const tokenCountStoragePath = path.join(__dirname, '../../../../../Data/tokenCount.json');
    const tokenCategoryCountStoragePath = path.join(__dirname, '../../../../../Data/tokenCategoryCount.json');

    const resetCountData = {
      currentTokenCount: 0,
      latestCustomerTokenCount: 0
    }

    await writeFile(tokenCountStoragePath, JSON.stringify(resetCountData));
    await writeFile(tokenCategoryCountStoragePath, '');

    res.status(200).send({ messae: 'Successfully deleted all token bases' });
  }
}