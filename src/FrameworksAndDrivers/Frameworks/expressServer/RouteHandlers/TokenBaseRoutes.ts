import { Request, Response } from 'express';

import Controller from "../Decorators/Controller";
import { del, get, patch, post } from "../Decorators/PathAndRequestMethodDecorator";
import { auth } from '../Middlewares/UserMiddlewares';
import use from '../Decorators/MiddlewareDecorator';
import { checkForAdminOrRegistrator, checkForRegistrator } from '../Middlewares/TokenBaseRoutesMiddleware';
import { checkAdminAuthority } from '../Middlewares/UserMiddlewares'
import TokenBaseStorageImplementation from '../../../Drivers/TokenBaseStorageImplementation';
import TokenBaseStorageInteractorImplementation from '../../../../InterfaceAdapters/TokenBaseStorageInteractorImplementation';
import { getCategoryTokenCountManager } from '../Helpers/tokenCountHelper';
import { TokenStatus } from '../../../../UseCases/TokenBaseManagementComponent/TokenBaseModule';
import { createNewCategoryTokenBaseObject, createNewNonCategoryTokenBaseObject } from '../Helpers/tokenBaseRouteHelper';
import TokenCountStorageInteractorImplementation from '../../../../InterfaceAdapters/TokenCategoryCountStorageInteractorImplementation';
import TokenCategoryCountStorageImplementation, { TokenStatusObject } from '../../../Drivers/TokenCategoryCountStorageImplementation';

import { PrismaClient } from '@prisma/client';
import CustomerStorageImplementation from '../../../Drivers/CustomerStorageImplementation';
import TokenCountStorageImplementation from '../../../Drivers/TokenCountStorageImplementation';


const prisma = new PrismaClient();

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
    if (!req.body.category) {
      res.status(400).send({ error: "Please Enter a Category Character" });
    } else {
      try {
        const categoryTokenCountManager = getCategoryTokenCountManager(req.body.category);
        await categoryTokenCountManager.createACategory(req.body.category, req.body.categoryName);
        res.status(201).send();
      } catch (error) {
        res.status(500).send({ error: error.toString() });
      }
    }
  }

  @get('/getalltokencategories')
  @use(auth)
  public async getAllTokenCategories(req: Request, res: Response) {
    const tokenCategoryCountStorageInteractorImplementation = new TokenCountStorageInteractorImplementation(TokenCategoryCountStorageImplementation);
    const allTokenCategories = await tokenCategoryCountStorageInteractorImplementation.getAllCategories();
    res.status(200).send(allTokenCategories);
  }

  @patch('/updatecategoryname')
  @use(auth)
  @use(checkAdminAuthority)
  public async updateATokenCategory(req: Request, res: Response) {
    const categoryTokenCountManager = getCategoryTokenCountManager(req.body.category);
    await categoryTokenCountManager.updateCategoryName(req.body.categoryName);
    res.status(200).send();
  }

  @del('/deletecategory/:category')
  @use(auth)
  @use(checkAdminAuthority)
  public async deleteATokenCategory(req: Request, res: Response) {
    const categoryTokenCountManager = getCategoryTokenCountManager(req.params.category);
    await categoryTokenCountManager.deleteCategory();
    res.status(200).send();
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
  public async filterTokenBaseByStatusAndDate(req: Request, res: Response) {
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
  @use(checkForAdminOrRegistrator)
  public async filterTokenBaseByDate(req: Request, res: Response) {
    try {
      const tokenBaseStorageInteractorImplementation = new TokenBaseStorageInteractorImplementation(TokenBaseStorageImplementation);
      const filteredTokenBases = (await tokenBaseStorageInteractorImplementation.filterTokenBaseByTokenDate(req.params.date)).map(
        tokenBaseObject => {
          if (tokenBaseObject.token.tokenCategory === "!")
            tokenBaseObject.token.tokenCategory = undefined;

          return tokenBaseObject;
        }
      );
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
      const noCategoryTokenBases = allTokenBases.filter(tokenBase => tokenBase.token.tokenCategory === '!');
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


    await prisma.tokenCategoryCount.updateMany({
      data: {
        currentTokenCount: 0,
        latestCustomerTokenCount: 0
      }
    })

    await prisma.token.deleteMany({});

    res.status(200).send({ messae: 'Successfully deleted all token bases' });
  }
}