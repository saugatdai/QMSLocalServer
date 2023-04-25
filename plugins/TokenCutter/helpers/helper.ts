import TokenCountStorageImplementation from '../../../src/FrameworksAndDrivers/Drivers/TokenCountStorageImplementation';
import TokenCountStorageInteractorImplementation from '../../../src/InterfaceAdapters/TokenCountStorageInteractorImplementation';
import TokenCountManager from '../../../src/UseCases/TokenCountManagementComponent/TokenCountManager';
import TokenCategoryCountStorageInteractorImplementation from '../../../src/InterfaceAdapters/TokenCategoryCountStorageInteractorImplementation';
import TokenCategoryCountMangaer from "../../../src/UseCases/TokenCategoryCountManagementComponent/TokenCategoryCountManager";
import TokenBaseManager from '../../../src/UseCases/TokenBaseManagementComponent/TokenBaseManager';
import TokenBaseStorageInteractorImplementation from '../../../src/InterfaceAdapters/TokenBaseStorageInteractorImplementation';
import TokenBaseStorageImplementation from '../../../src/FrameworksAndDrivers/Drivers/TokenBaseStorageImplementation';
import Token from '../../../src/Entities/TokenCore/Token';
import { TokenBaseObject } from '../../../src/UseCases/TokenBaseManagementComponent/TokenBaseModule';
import TokenCategoryCountStorageImplementation from '../../../src/FrameworksAndDrivers/Drivers/TokenCategoryCountStorageImplementation';

export const getTokenBaseManager = () => {
    const tokenBaseStorageInteractorImplementation = new TokenBaseStorageInteractorImplementation(TokenBaseStorageImplementation);
    return new TokenBaseManager(tokenBaseStorageInteractorImplementation);
}

export const createNewNonCategoryTokenBaseObject = async () => {
    const nextAvailableTokenId = await TokenBaseStorageImplementation.getNextAvailableTokenId();
    const tokenCountStorageInteractorImplementation = new TokenCountStorageInteractorImplementation(TokenCountStorageImplementation);
    const tokenCountManager = new TokenCountManager(tokenCountStorageInteractorImplementation);

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
    
    const tokenCategoryCountStorageInteractorImplementation = new TokenCategoryCountStorageInteractorImplementation(TokenCategoryCountStorageImplementation);
    const tokenCategoryCountManager = new TokenCategoryCountMangaer(tokenCategoryCountStorageInteractorImplementation, category);

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