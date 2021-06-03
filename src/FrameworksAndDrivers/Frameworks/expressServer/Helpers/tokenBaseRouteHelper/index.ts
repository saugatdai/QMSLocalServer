import TokenBaseStorageInteractorImplementation from "../../../../../InterfaceAdapters/TokenBaseStorageInteractorImplementation"
import TokenBaseManager from "../../../../../UseCases/TokenBaseManagementComponent/TokenBaseManager";
import TokenBaseStorageImplementation from "../../../../Drivers/TokenBaseStorageImplementation"

export const getTokenBaseManager = () => {
  const tokenBaseStorageInteractorImplementation = new TokenBaseStorageInteractorImplementation(TokenBaseStorageImplementation);
  return new TokenBaseManager(tokenBaseStorageInteractorImplementation);
}