import { PrismaClient } from '@prisma/client';

import TokenBaseStorageInteractorImplementation from '../../../src/InterfaceAdapters/TokenBaseStorageInteractorImplementation';
import TokenBaseStorageImplementation from '../../../src/FrameworksAndDrivers/Drivers/TokenBaseStorageImplementation';

const prisma = new PrismaClient();


export const clearAction = async () => {

    const tokenBaseInteractorAdapter = new TokenBaseStorageInteractorImplementation(TokenBaseStorageImplementation);
    const todaysTokenBases = await tokenBaseInteractorAdapter.filterTokenBaseByTokenDate(new Date().toDateString());

    if (todaysTokenBases.length === 0) {
        console.log('No todays token base found....');
        await prisma.tokenBaseObject.deleteMany({});
        await prisma.token.deleteMany({});
        await prisma.tokenCategoryCount.updateMany({
            data: {
                currentTokenCount: 0,
                latestCustomerTokenCount: 0
            }
        });
        console.log('All tokens and tokenbases deleted successfully...');
    } else {
        console.log('Todays token base found...');
    }
}



