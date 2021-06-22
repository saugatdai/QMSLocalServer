import Token from "../../../Entities/TokenCore/Token";
import Operator from "../../../Entities/UserCore/Operator";
import TokenBaseStorageInteractorImplementation from "../../../InterfaceAdapters/TokenBaseStorageInteractorImplementation";
import TokenCategoryCountStorageInteractorImplementation from "../../../InterfaceAdapters/TokenCategoryCountStorageInteractorImplementation";
import TokenCountStorageInteractorImplementation from "../../../InterfaceAdapters/TokenCountStorageInteractorImplementation";
import TokenBaseManager from "../../../UseCases/TokenBaseManagementComponent/TokenBaseManager";
import { TokenBaseObject, TokenProcessing, TokenStatus } from "../../../UseCases/TokenBaseManagementComponent/TokenBaseModule";
import TokenCallingState from "../../../UseCases/TokenCallingComponent/TokenCallingState";
import TokenCountManager from "../../../UseCases/TokenCountManagementComponent/TokenCountManager";
import TokenCategoryCountManager from "../../../UseCases/TokenCategoryCountManagementComponent/TokenCategoryCountManager";
import TokenBaseStorageImplementation from "../TokenBaseStorageImplementation";
import TokenCategoryCountStorageImplementation from "../TokenCategoryCountStorageImplementation";
import TokenCountStorageImplementation from "../TokenCountStorageImplementation";
import TokenCallingStateManagerSingleton from "../../../UseCases/TokenCallingComponent/TokenCallingStateManagerSingleton";

const getCategoryTokenCountManager = (category: string) => {
  const tokenCategoryCountStorageInteractor = new TokenCategoryCountStorageInteractorImplementation(TokenCategoryCountStorageImplementation);
  const tokenCategoryCountManager = new TokenCategoryCountManager(tokenCategoryCountStorageInteractor, category);
  return tokenCategoryCountManager;
}

const getTokenCountManager = () => {
  const tokenCountStorageInteractorImplementation = new TokenCountStorageInteractorImplementation(TokenCountStorageImplementation);
  const tokenCountManager = new TokenCountManager(tokenCountStorageInteractorImplementation);
  return tokenCountManager;
}

export type ActedTokenProcessingInfoArgument = {
  actedToken: Token;
  operator: Operator;
  tokenStatus: TokenStatus
}

export const storeActedTokenProcessingInfo = async (actedTokenProcessingInfo: ActedTokenProcessingInfoArgument) => {
  const tokenBaseManager = await getTokenBaseManagerOfAToken(actedTokenProcessingInfo.actedToken);
  const tokenProcessingInfo = getTokenProcessingInfoObject(actedTokenProcessingInfo.operator, actedTokenProcessingInfo.tokenStatus);
  tokenBaseManager.tokenBase.addTokenProcessingInfo(tokenProcessingInfo);
  await tokenBaseManager.updateTokenBase();
}

const getTokenBaseManagerOfAToken = async (token: Token) => {
  const tokenBaseStorageInteractorImplementation = new TokenBaseStorageInteractorImplementation(TokenBaseStorageImplementation);
  const tokenBaseObject = await tokenBaseStorageInteractorImplementation.getTodaysTokenBaseByTokenNumber(token.tokenNumber, token.tokenCategory);
  const tokenBaseManager = getTokenBaseManager();
  tokenBaseManager.tokenBase = tokenBaseObject;
  return tokenBaseManager;
}

const getTokenBaseManager = () => {
  const tokenBaseStorageInteractorImplementation = new TokenBaseStorageInteractorImplementation(TokenBaseStorageImplementation);
  return new TokenBaseManager(tokenBaseStorageInteractorImplementation);
}

const getTokenProcessingInfoObject = (operator: Operator, tokenStatus: TokenStatus) => {
  const tokenProcessingInfo = new TokenProcessing();
  tokenProcessingInfo.operator = operator;
  tokenProcessingInfo.status = tokenStatus;
  tokenProcessingInfo.timeStamp = new Date();

  return tokenProcessingInfo;
}

export const getUnprocessedTokenBasesAfterCurrentCustomer = async (tokenCategory: string) => {
  const tokenBaseStorageInteractorImplementation = new TokenBaseStorageInteractorImplementation(TokenBaseStorageImplementation);
  const allUnprocessedTokenBases = await tokenBaseStorageInteractorImplementation.filterTokenBaseByStatus(TokenStatus.UNPROCESSED);
  let unprocessedTokenBases: TokenBaseObject[];
  if (tokenCategory) {
    unprocessedTokenBases = await getCategoryUnprocessedTokenBases(allUnprocessedTokenBases, tokenCategory);
  } else {
    unprocessedTokenBases = await getUnprocessedTokenBases(allUnprocessedTokenBases);
  }
  return unprocessedTokenBases;
}

const getCategoryUnprocessedTokenBases = async (allUnprocessedTokenBases: TokenBaseObject[], tokenCategory: string) => {
  let unprocessedTokenBases: TokenBaseObject[];
  unprocessedTokenBases = allUnprocessedTokenBases.filter(tokenBase => tokenBase.token.tokenCategory === tokenCategory);
  const tokenCategoryCountManager = getCategoryTokenCountManager(tokenCategory);
  const currentCustomerToken = await tokenCategoryCountManager.recoverTokenCount();
  unprocessedTokenBases = unprocessedTokenBases.filter(tokenBase => tokenBase.token.tokenNumber > currentCustomerToken);
  return unprocessedTokenBases;
}

const getUnprocessedTokenBases = async (allUnprocessedTokenBases: TokenBaseObject[]) => {
  let unprocessedTokenBases: TokenBaseObject[];
  unprocessedTokenBases = allUnprocessedTokenBases.filter(tokenBase => !tokenBase.token.tokenCategory);
  const tokenCountManager = getTokenCountManager();
  const currentCustomerToken = await tokenCountManager.revcoverTokenCount();
  unprocessedTokenBases = unprocessedTokenBases.filter(tokenBase => tokenBase.token.tokenNumber > currentCustomerToken);
  return unprocessedTokenBases;
}

export const setEndOfQueueAndNullNextTokenForState = (tokenCallingState: TokenCallingState) => {
  TokenCallingStateManagerSingleton.getInstance().setEndOfQueuePropertyForOperatorTokenState(tokenCallingState.operator.getUserInfo().username);
  TokenCallingStateManagerSingleton.getInstance().setNextTokenOfTokenStateForOperatorName(tokenCallingState.operator.getUserInfo().username, null);
}

export const getNextTokenFromUnprocessedTokenBases = (unprocessedTokenBases: TokenBaseObject[]) => {
  let i = 0;
  let nextToken: Token;
  do {
    nextToken = unprocessedTokenBases[i].token;
    if (isAlreadyInState(nextToken)) {
      nextToken.tokenNumber = 0;
    } else {
      break;
    }
    ++i;
  } while (i < unprocessedTokenBases.length);
  return nextToken;
}

const isAlreadyInState = (token: Token) => {
  if (token.tokenCategory) {
    return TokenCallingStateManagerSingleton.getInstance().tokenCallingStates.find(tokenCallingState => {
      return tokenCallingState.nextToken && tokenCallingState.nextToken.tokenNumber === token.tokenNumber && tokenCallingState.nextToken.tokenCategory === token.tokenCategory;
    });
  } else {
    return TokenCallingStateManagerSingleton.getInstance().tokenCallingStates.find(tokenCallingState => {
      return tokenCallingState.nextToken && tokenCallingState.nextToken.tokenNumber === token.tokenNumber;
    });
  }
}

export const getNextTokenNumberAfterUpdatingNextTokenForTokenCallingState = (tokenCallingState: TokenCallingState, nextToken: Token) => {
  TokenCallingStateManagerSingleton.getInstance().setNextTokenOfTokenStateForOperatorName(tokenCallingState.operator.getUserInfo().username, nextToken);
  const updatedTokenCallingState = TokenCallingStateManagerSingleton.getInstance().getATokenCallingStateByOperatorName(tokenCallingState.operator.getUserInfo().username);
  const nextTokenNumber = updatedTokenCallingState.nextToken.tokenNumber;
  return nextTokenNumber;
}

export const presetCurrentTokenCountFromNextToken = async (token: Token) => {
  if (token.tokenCategory) {
    const tokenCategoryCountManager = getCategoryTokenCountManager(token.tokenCategory);
    await tokenCategoryCountManager.presetTokenCount(token.tokenNumber);
  } else {
    const tokenCountManager = getTokenCountManager();
    await tokenCountManager.presetTokenCount(token.tokenNumber);
  }
}

export const storeOperatorAssignedToken = async (operator: Operator, token: Token) => {
  const tokenBaseObject = new TokenBaseObject(token);
  const tokenProcessingInfo = getTokenProcessingInfoObject(operator, TokenStatus.ASSIGNED);
  const tokenBaseManager = getTokenBaseManager();
  tokenBaseManager.tokenBase = tokenBaseObject;
  tokenBaseManager.tokenBase.addTokenProcessingInfo(tokenProcessingInfo);
  await tokenBaseManager.updateTokenBase();
}
