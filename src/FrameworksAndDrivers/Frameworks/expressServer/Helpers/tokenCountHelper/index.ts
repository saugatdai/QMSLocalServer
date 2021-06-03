import TokenCountStorageInteractorImplementation from "../../../../../InterfaceAdapters/TokenCountStorageInteractorImplementation";
import TokenCountManager from "../../../../../UseCases/TokenCountManagementComponent/TokenCountManager";
import TokenCountStorageImplementation from "../../../../Drivers/TokenCountStorageImplementation";

export const getTokenCountManager = () => {
  const tokenCountStorageInteractor = new TokenCountStorageInteractorImplementation(TokenCountStorageImplementation);
  const tokenCountManager = new TokenCountManager(tokenCountStorageInteractor);
  return tokenCountManager;
}