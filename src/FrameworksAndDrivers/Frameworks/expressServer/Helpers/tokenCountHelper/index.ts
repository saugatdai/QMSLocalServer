import TokenCountStorageInteractorImplementation from "../../../../../InterfaceAdapters/TokenCountStorageInteractorImplementation";
import TokenCountManager from "../../../../../UseCases/TokenCountManagementComponent/TokenCountManager";
import TokenCountStorageImplementation from "../../../../Drivers/TokenCountStorageImplementation";
import TokenCategoryCountStorageInteractorImplementation from '../../../../../InterfaceAdapters/TokenCategoryCountStorageInteractorImplementation';
import TokenCategoryCountMangaer from "../../../../../UseCases/TokenCategoryCountManagementComponent/TokenCategoryCountManager";
import TokenCategoryCountStorageImplementation from '../../../../Drivers/TokenCategoryCountStorageImplementation';

export const getTokenCountManager = () => {
  const tokenCountStorageInteractor = new TokenCountStorageInteractorImplementation(TokenCountStorageImplementation);
  const tokenCountManager = new TokenCountManager(tokenCountStorageInteractor);
  return tokenCountManager;
}

export const getCategoryTokenCountManager = (category: string) => {
  const tokenCategoryCountStorageInteractor = new TokenCategoryCountStorageInteractorImplementation(TokenCategoryCountStorageImplementation);
  const tokenCategoryCountManager = new TokenCategoryCountMangaer(tokenCategoryCountStorageInteractor, category);
  return tokenCategoryCountManager;
}