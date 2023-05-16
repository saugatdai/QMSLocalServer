import Token from "../../../../../Entities/TokenCore/Token";
import Operator from "../../../../../Entities/UserCore/Operator";
import TokenBaseStorageInteractorImplementation from "../../../../../InterfaceAdapters/TokenBaseStorageInteractorImplementation";
import { TokenBaseObject, TokenStatus } from "../../../../../UseCases/TokenBaseManagementComponent/TokenBaseModule";
import TokenBaseStorageImplementation from "../../../../Drivers/TokenBaseStorageImplementation";
import TokenCallingState from "../../../../../UseCases/TokenCallingComponent/TokenCallingState";
import TokenCallingStateManagerSingleton from "../../../../../UseCases/TokenCallingComponent/TokenCallingStateManagerSingleton";
import { Request, Response } from "express";
import TokenCallingFacadeSingleton from "../../../../../UseCases/TokenCallingComponent/TokenCallingFacadeSingleton";
import TokenForwardListManager, { TokenForwardObject } from "../../../../../UseCases/TokenForwardListManagement/TokenForwardListManager";
import TokenForwardListStorageInteractorImplementation from "../../../../../InterfaceAdapters/TokenForwardListStorageInteractorImplementation";
import { tokenForwardListStorageImplementation } from "../../../../Drivers/TokenForwardListStorageImplementation";

export const beginTokenCallTask = async (helperParameters: { req: Request, res: Response, tokenStatus: TokenStatus }) => {
  await processTokenCallingTask(helperParameters);
}

export const processTokenCallingTask = async (helperParameters: { req: Request, res: Response, tokenStatus: TokenStatus }) => {
  const { tokenNumber, tokenCategory, operator } = getCallerParameters(helperParameters.req, helperParameters.res);
  const tokenLockStatusForOperator = TokenCallingStateManagerSingleton.getInstance().isTokenStateForOperatorLocked(operator.getUserInfo().username);

  if (tokenLockStatusForOperator) {
    helperParameters.res.status(400).send({ error: 'Some processing for your previous request still in progress' });
  } else {
    const tokenInfo = { tokenNumber, tokenCategory };
    try {
      const token = await getTokenAfterRegistrationToTokenCallingState(helperParameters.req.body.user, tokenInfo);
      await sendCallingResponse(token, { req: helperParameters.req, res: helperParameters.res, tokenStatus: helperParameters.tokenStatus });
    } catch (error) {
      helperParameters.res.status(500).send({ error: error.toString() });
    }
  }
}

export const getCallerParameters = (req: Request, res: Response) => {
  const tokenNumber: number = parseInt(req.body.actedTokenNumber);
  const tokenCategory: string = req.body.category;
  const operator: Operator = req.body.user as Operator;

  return { tokenNumber, tokenCategory, operator }
}


export const getTokenAfterRegistrationToTokenCallingState = async (operator: Operator, tokenInfo: { tokenNumber: number, tokenCategory: string }) => {
  let tokenBaseObject: TokenBaseObject;

  const tokenBaseStorageInteractor = new TokenBaseStorageInteractorImplementation(TokenBaseStorageImplementation);
  if (tokenInfo.tokenNumber === 0) {
    const tempToken: Token = {
      date: new Date(),
      tokenId: 0,
      tokenNumber: Math.ceil(Math.random()*15000) + 50001, //indication of the starting of queue processing from 0 by operator
      tokenCategory: tokenInfo.tokenCategory
    }

    tokenBaseObject = new TokenBaseObject(tempToken);
  } else {
    if (tokenInfo.tokenCategory) {
      tokenBaseObject = await tokenBaseStorageInteractor.getTodaysTokenBaseByTokenNumber(tokenInfo.tokenNumber, tokenInfo.tokenCategory);
    } else {
      tokenBaseObject = await tokenBaseStorageInteractor.getTodaysTokenBaseByTokenNumber(tokenInfo.tokenNumber);
    }
  }
  if (tokenBaseObject) {
    const tokenCallingState = new TokenCallingState(operator, tokenBaseObject.token);
    TokenCallingStateManagerSingleton.getInstance().addTokenCallingState(tokenCallingState);
    return tokenBaseObject.token;
  } else {
    throw new Error(`Token base for token number ${tokenInfo.tokenNumber} not found`);
  }
}

export const getTodaysTokenByTokenNumber = async (tokenNumber: number) => {
  const tokenBaseStorageInteractorImplementation = new TokenBaseStorageInteractorImplementation(TokenBaseStorageImplementation);
  const tokenBaseObject = await tokenBaseStorageInteractorImplementation.getTodaysTokenBaseByTokenNumber(tokenNumber);
  return tokenBaseObject.token;
}

export const sendErrorMessage = (req: Request, res: Response) => {
  const operator: Operator = req.body.user;
  const tokenCallingState = TokenCallingStateManagerSingleton.getInstance().getATokenCallingStateByOperatorName(operator.getUserInfo().username);
  if (tokenCallingState.endOfQueue) {
    res.status(400).send({ error: 'End of Queue' });
  } else {
    res.status(400).send({ error: 'Can not extract next token, please try again' });
  }
}


export const sendCallingResponse = async (token: Token, httpObject: { req: Request, res: Response, tokenStatus: TokenStatus }) => {
  try {
    let newToken: Token;
    if (httpObject.tokenStatus === TokenStatus.PROCESSED) {
      newToken = await TokenCallingFacadeSingleton.getInstance().callNextToken(token);
    } else if (httpObject.tokenStatus === TokenStatus.BYPASS) {
      newToken = await TokenCallingFacadeSingleton.getInstance().byPassToken(token);
    } else if (httpObject.tokenStatus === TokenStatus.CALLAGAIN) {
      newToken = await TokenCallingFacadeSingleton.getInstance().callTokenAgain(token);
    } else if (httpObject.tokenStatus === TokenStatus.RANDOMPROCESSED) {
      newToken = await TokenCallingFacadeSingleton.getInstance().callRandomToken(token);
    } else if (httpObject.tokenStatus === TokenStatus.FORWARD) {
      const tokenForwardListStorageInteractorImplementation = new TokenForwardListStorageInteractorImplementation(tokenForwardListStorageImplementation);
      const tokenForwardListManager = new TokenForwardListManager(tokenForwardListStorageInteractorImplementation);
      const tokenForwardObject: TokenForwardObject = {
        counter: httpObject.req.body.counterToForward,
        tokens: [token]
      }
      await tokenForwardListManager.storeATokenForwardObject(tokenForwardObject);
      newToken = await TokenCallingFacadeSingleton.getInstance().forwardToken(token);
    }
    if (newToken) {
      httpObject.res.status(200).send(newToken);
    } else {
      sendErrorMessage(httpObject.req, httpObject.res);
    }
  } catch (error) {
    httpObject.res.status(500).send({ error: error.toString() });
  }
}

