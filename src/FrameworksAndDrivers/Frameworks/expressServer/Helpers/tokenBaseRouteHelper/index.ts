import Token from "../../../../../Entities/TokenCore/Token";
import Operator from "../../../../../Entities/UserCore/Operator";
import TokenBaseStorageInteractorImplementation from "../../../../../InterfaceAdapters/TokenBaseStorageInteractorImplementation"
import TokenBaseManager from "../../../../../UseCases/TokenBaseManagementComponent/TokenBaseManager";
import { TokenBaseObject } from "../../../../../UseCases/TokenBaseManagementComponent/TokenBaseModule";
import TokenBaseStorageImplementation from "../../../../Drivers/TokenBaseStorageImplementation"
import { getCategoryTokenCountManager, getTokenCountManager } from "../tokenCountHelper";

export const getTokenBaseManager = () => {
  const tokenBaseStorageInteractorImplementation = new TokenBaseStorageInteractorImplementation(TokenBaseStorageImplementation);
  return new TokenBaseManager(tokenBaseStorageInteractorImplementation);
}


export const createNewNonCategoryTokenBaseObject = async () => {
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

  return tokenBaseManager.tokenBase;
}

export const createNewCategoryTokenBaseObject = async (category: string) => {
  const nextAvailableTokenId = await TokenBaseStorageImplementation.getNextAvailableTokenId();
  const tokenCategoryCountManager = getCategoryTokenCountManager(category);
  const tokenNumber = await tokenCategoryCountManager.getLatestCustomerTokenCount();
  const token: Token = {
    tokenId: nextAvailableTokenId,
    tokenNumber: tokenNumber + 1,
    date: new Date(),
    tokenCategory: category
  }
  const tokenBaseObject = new TokenBaseObject(token);
  const tokenBaseManager = getTokenBaseManager();
  tokenBaseManager.tokenBase = tokenBaseObject;
  await tokenBaseManager.createATokenBase();

  await tokenCategoryCountManager.setLatestCustomerTokenCount(token.tokenNumber);

  return tokenBaseManager.tokenBase;
}