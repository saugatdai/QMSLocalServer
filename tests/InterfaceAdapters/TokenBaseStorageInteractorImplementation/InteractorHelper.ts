import * as path from 'path';
import * as fs from 'fs';
import * as util from 'util';

import { TokenBaseObject, TokenStatus } from '../../../src/UseCases/TokenBaseManagementComponent/TokenBaseModule';

export const readFile = (filename: string) =>
    util.promisify(fs.readFile)(filename, 'utf-8');
export const writeFile = (filename: string, data: string) =>
    util.promisify(fs.writeFile)(filename, data, 'utf-8');

export const tokenBaseTestStoragePath = path.join(__dirname, '/tokenBase.json.json');

const getAllTokenBases: () => Promise<TokenBaseObject[]> = async () => {
    const allTokenBasesJSON = await readFile(tokenBaseTestStoragePath);
    const allTokenBases = JSON.parse(allTokenBasesJSON) as TokenBaseObject[];
    return allTokenBases;
}

const putATokenBase = async (tokenBase: TokenBaseObject) => {
    const allTokenBases = await getAllTokenBases();
    allTokenBases.push(tokenBase);
    await writeFile(tokenBaseTestStoragePath, JSON.stringify(allTokenBases));
}

const getTokenBasesByStatus = async (status: TokenStatus, date?: Date) => {
    const allTokenBases = await getAllTokenBases();
    if (date) {
        return allTokenBases.filter(tokenBase =>
            tokenBase.currentStatus === status &&
            tokenBase.token.date.getDate() === date.getDate() &&
            tokenBase.token.date.getMonth() === date.getMonth() &&
            tokenBase.token.date.getFullYear() === date.getFullYear()
        );
    } else {
        return allTokenBases.filter(tokenBase => {
            return tokenBase.currentStatus === status;
        });
    }
}

const getTokenBaseByTokenDate = async (date: string) => {
    const allTokenBases = await getAllTokenBases();
    const filterDate = new Date(date);
    return allTokenBases.filter(tokenBase => {
        const loopTokenDate = new Date(tokenBase.getBaseObjectDetails().token.date);
        return (loopTokenDate.getDate() === filterDate.getDate() &&
            loopTokenDate.getFullYear() === filterDate.getFullYear() &&
            loopTokenDate.getMonth() === filterDate.getMonth());
    });
}

const resetTokenBase = async () => {
    await writeFile(tokenBaseTestStoragePath, '');
}

const editATokenBase = async (tokenBase: TokenBaseObject) => {
    let allTokenBases = await getAllTokenBases();
    allTokenBases = allTokenBases.map(looptokenBase => {
        if (tokenBase.token.date.getTime() === looptokenBase.token.date.getTime()
            && tokenBase.token.tokenNumber === looptokenBase.token.tokenNumber) {
            return tokenBase;
        }
        return looptokenBase;
    });
}

const readTodaysTokenBaseByTokenNumber = async (tokenNumber: number, category?: string) => {
    const allTokenBases = await getAllTokenBases();
    let todaysTokenBase: TokenBaseObject;
    if (category) {
        todaysTokenBase = allTokenBases.find(tokenBase => {
            return tokenBase.token.date.getDate() === new Date().getDate() &&
                tokenBase.token.tokenNumber === tokenNumber && tokenBase.token.tokenCategory === category;
        });
    } else {
        todaysTokenBase = allTokenBases.find(tokenBase => {
            return tokenBase.token.date.getDate() === new Date().getDate() &&
                tokenBase.token.tokenNumber === tokenNumber;
        });
    }
    return todaysTokenBase;
}

const readNextAvailableTokenNumberInACategory = async (tokenCategory: string) => {
    const allTokenBases = await getAllTokenBases();
    let highestNumber = 0;
    if (tokenCategory) {
        allTokenBases.forEach(tokenBase => {
            if (tokenBase.token.tokenCategory === tokenCategory) {
                highestNumber = tokenBase.token.tokenNumber > highestNumber ? tokenBase.token.tokenNumber : highestNumber;
            }
        });
    } else {
        allTokenBases.forEach(tokenBase => {
            highestNumber = tokenBase.token.tokenNumber > highestNumber ? tokenBase.token.tokenNumber : highestNumber
        });
    }
    return highestNumber + 1;
}

const readTokenBasesByTokenCategory = (tokenBases: TokenBaseObject[], tokenCategory: string) => {
    return tokenBases.filter(tokenBase => tokenBase.token.tokenCategory === tokenCategory);
}

const readTokenBaseByTokenId = async (tokenId: number) => {
    const allTokenBases = await getAllTokenBases();
    return allTokenBases.find(tokenBase => tokenBase.token.tokenId === tokenId);
}

export {
    getAllTokenBases,
    putATokenBase,
    getTokenBasesByStatus,
    getTokenBaseByTokenDate,
    resetTokenBase,
    editATokenBase,
    readTodaysTokenBaseByTokenNumber,
    readNextAvailableTokenNumberInACategory,
    readTokenBasesByTokenCategory,
    readTokenBaseByTokenId 
};