import { TokenStatus } from "../../../UseCases/TokenBaseManagementComponent/TokenBaseModule";
import TokenCallingState from "../../../UseCases/TokenCallingComponent/TokenCallingState";
import TokenCallingStateManagerSingleton from "../../../UseCases/TokenCallingComponent/TokenCallingStateManagerSingleton";
import { ActedTokenProcessingInfoArgument, getNextTokenFromUnprocessedTokenBases, getNextTokenNumberAfterUpdatingNextTokenForTokenCallingState, getUnprocessedTokenBasesAfterCurrentCustomer, presetCurrentTokenCountFromNextToken, setEndOfQueueAndNullNextTokenForState, storeActedTokenProcessingInfo, storeOperatorAssignedToken } from "./helpers";


const handleCurrentProcessedToken = async (tokenCallingState: TokenCallingState) => {
  const tokenNumber = tokenCallingState.currentToken.tokenNumber;

    // if token call starts with zero, token number will be less than 50,000
  if (tokenNumber < 50000) {
    const actedTokenProcessingInfo: ActedTokenProcessingInfoArgument = {
      actedToken: tokenCallingState.currentToken,
      operator: tokenCallingState.operator,
      tokenStatus: TokenStatus.PROCESSED
    }
    await storeActedTokenProcessingInfo(actedTokenProcessingInfo);
  }
}

export const preCallRunnerForCallNext = async (tokenCallingState: TokenCallingState) => {
  await handleCurrentProcessedToken(tokenCallingState);
  await setNextToken(tokenCallingState);
}

export const preCallRunnerForByPass = async (tokenCallingState: TokenCallingState) => {
  await handleCurrentProcessedToken(tokenCallingState);
  await setNextToken(tokenCallingState);
}

export const preCallRunnerForCallAgain = async (tokenCallingState: TokenCallingState) => {
  await handleCurrentProcessedToken(tokenCallingState);
  const operatorName = tokenCallingState.operator.getUserInfo().username;
  TokenCallingStateManagerSingleton.getInstance().setNextTokenOfTokenStateForOperatorName(operatorName, tokenCallingState.currentToken);
}

export const preCallRunnerForRandomCall = async (tokenCallingState: TokenCallingState) => {
  await handleCurrentProcessedToken(tokenCallingState);
  const operatorName = tokenCallingState.operator.getUserInfo().username;
  TokenCallingStateManagerSingleton.getInstance().setNextTokenOfTokenStateForOperatorName(operatorName, tokenCallingState.currentToken);
}

export const preCallRunnerForTokenForward = async (tokenCallingState: TokenCallingState) => {
  await handleCurrentProcessedToken(tokenCallingState);
  await setNextToken(tokenCallingState);
}

export const defaultPostCaller = async (tokenCallingState: TokenCallingState) => {
  const nextToken = TokenCallingStateManagerSingleton.getInstance().getATokenCallingStateByOperatorName(tokenCallingState.operator.getUserInfo().username).nextToken;
  if (nextToken) {
    await presetCurrentTokenCountFromNextToken(nextToken);
    await storeOperatorAssignedToken(tokenCallingState.operator, nextToken);
  }
}


export const postCallRunnerForCallAgain = async (tokenCallingState: TokenCallingState) => {
  const operatorName = tokenCallingState.operator.getUserInfo().username;
  const presentTokenCallingState = TokenCallingStateManagerSingleton.getInstance().getATokenCallingStateByCurrentToken(tokenCallingState.currentToken);
  const presentToken = presentTokenCallingState.currentToken;
  TokenCallingStateManagerSingleton.getInstance().setNextTokenOfTokenStateForOperatorName(operatorName, presentToken);
  await storeOperatorAssignedToken(tokenCallingState.operator, presentToken);
}

export const postCallRunnerForRandomCall = async (tokenCallingState: TokenCallingState) => {
  const operatorName = tokenCallingState.operator.getUserInfo().username;
  const presentTokenCallingState = TokenCallingStateManagerSingleton.getInstance().getATokenCallingStateByCurrentToken(tokenCallingState.currentToken);
  const presentToken = presentTokenCallingState.currentToken;
  TokenCallingStateManagerSingleton.getInstance().setNextTokenOfTokenStateForOperatorName(operatorName, presentToken);
}

const setNextToken = async (tokenCallingState: TokenCallingState) => {
  const tokenCategory = tokenCallingState.currentToken.tokenCategory;
  const unprocessedTokenBases = await getUnprocessedTokenBasesAfterCurrentCustomer(tokenCategory);
  const unprocessedTokenBasesForToday = unprocessedTokenBases.filter(tokenBaseObject => {
    const today = new Date();
    const tokenDate = new Date(tokenBaseObject.token.date);
    return (today.getDate() === tokenDate.getDate() && today.getMonth() === today.getMonth() && today.getFullYear() === tokenDate.getFullYear());
  });
  if (unprocessedTokenBasesForToday.length === 0) {
    setEndOfQueueAndNullNextTokenForState(tokenCallingState);
  } else {
    unprocessedTokenBasesForToday.sort((tb1, tb2) => (tb1.token.tokenNumber - tb2.token.tokenNumber));
    const nextToken = getNextTokenFromUnprocessedTokenBases(unprocessedTokenBasesForToday);
    nextToken.tokenCategory = nextToken.tokenCategory === '!' ? nextToken.tokenCategory.replace('!', '') : nextToken.tokenCategory;
    if (nextToken.tokenNumber === 0) {
      setEndOfQueueAndNullNextTokenForState(tokenCallingState);
    } else {
      getNextTokenNumberAfterUpdatingNextTokenForTokenCallingState(tokenCallingState, nextToken);
    }
  }
}