import Operator from "../../../Entities/UserCore/Operator";
import TokenBaseStorageInteractorImplementation from "../../../InterfaceAdapters/TokenBaseStorageInteractorImplementation";
import TokenBaseManager from "../../../UseCases/TokenBaseManagementComponent/TokenBaseManager";
import { TokenBaseObject, TokenProcessing, TokenStatus } from "../../../UseCases/TokenBaseManagementComponent/TokenBaseModule";
import TokenCallingFacadeSingleton from "../../../UseCases/TokenCallingComponent/TokenCallingFacadeSingleton";
import TokenBaseStorageImplementation from "../TokenBaseStorageImplementation";

export type ActedTokenProcessingInfoArgument = {
  actedTokenNumber: number;
  operator: Operator;
  tokenStatus: TokenStatus
}

const getTokenBaseManager = () => {
  const tokenBaseStorageInteractorImplementation = new TokenBaseStorageInteractorImplementation(TokenBaseStorageImplementation);
  return new TokenBaseManager(tokenBaseStorageInteractorImplementation);
}

const getTokenBaseManagerOfATokenNumber = async (tokenNumber: number) => {
  const tokenBaseStorageInteractorImplementation = new TokenBaseStorageInteractorImplementation(TokenBaseStorageImplementation);
  const token = await tokenBaseStorageInteractorImplementation.getTodaysTokenBaseByTokenNumber(tokenNumber);
  console.log(token);
  const tokenBaseManager = getTokenBaseManager();
  tokenBaseManager.tokenBase = token;
  return tokenBaseManager;
}

const getTokenProcessingInfoObject = (operator: Operator, tokenStatus: TokenStatus) => {
  const tokenProcessingInfo = new TokenProcessing();
  tokenProcessingInfo.operator = operator;
  tokenProcessingInfo.status = tokenStatus;
  tokenProcessingInfo.timeStamp = new Date();

  return tokenProcessingInfo;
}

const storeActedTokenProcessingInfo = async (actedTokenProcessingInfo: ActedTokenProcessingInfoArgument) => {
  const tokenBaseManager = await getTokenBaseManagerOfATokenNumber(actedTokenProcessingInfo.actedTokenNumber);
  const tokenProcessingInfo = getTokenProcessingInfoObject(actedTokenProcessingInfo.operator, TokenStatus.PROCESSED);
  tokenBaseManager.tokenBase.addTokenProcessingInfo(tokenProcessingInfo);
  await tokenBaseManager.updateTokenBase();
}

const getTokenBaseForNextToken = async (tokenCategory: string) => {
  const tokenBaseStorageInteractorImplementation = new TokenBaseStorageInteractorImplementation(TokenBaseStorageImplementation);
  const nextTokenToBeCalled = await tokenBaseStorageInteractorImplementation.getNextAvailableTokenNumberInACategoryForToday(tokenCategory);
  const tokenBaseForNextToken = await tokenBaseStorageInteractorImplementation.getTodaysTokenBaseByTokenNumber(nextTokenToBeCalled);
  return tokenBaseForNextToken;
}

const storeOperatorAssignedToken = async (operator: Operator, tokenBase: TokenBaseObject) => {
  const tokenProcessingInfo = getTokenProcessingInfoObject(operator, TokenStatus.ASSIGNED);
  const tokenBaseManager = getTokenBaseManager();
  tokenBaseManager.tokenBase = tokenBase;
  tokenBaseManager.tokenBase.addTokenProcessingInfo(tokenProcessingInfo);
  await tokenBaseManager.updateTokenBase();
}

export const preCallRunnerForCallNext = async () => {
  /*
  const tokenCallingFacade = TokenCallingFacadeSingleton.getInstance();
  const actedTokenProcessingInfo: ActedTokenProcessingInfoArgument = {
    operator: tokenCallingFacade.caller,
    actedTokenNumber: tokenCallingFacade.currentlyProcessingNumber,
    tokenStatus: TokenStatus.PROCESSED
  }
  await storeActedTokenProcessingInfo(actedTokenProcessingInfo);*/
}

export const postCallerForCallNext: () => Promise<number> = async () => {
  /*
  const tokenCallingFacade = TokenCallingFacadeSingleton.getInstance();
  const tokenBaseForNextToken = await getTokenBaseForNextToken(tokenCallingFacade.currentlyProcessingCategory);
  if (tokenBaseForNextToken && tokenBaseForNextToken.currentStatus === TokenStatus.UNPROCESSED) {
    await storeOperatorAssignedToken(tokenCallingFacade.caller, tokenBaseForNextToken);
    return tokenBaseForNextToken.token.tokenNumber;
  }*/
  return 0;
}