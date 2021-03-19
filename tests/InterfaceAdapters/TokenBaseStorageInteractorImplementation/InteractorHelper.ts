import * as path from 'path';
import * as fs from 'fs';
import * as util from 'util';

import { TokenBaseObject, TokenProcessing, TokenStatus } from '../../../src/UseCases/TokenBaseManagementComponent/TokenBaseModule';
import UserRoles from '../../../src/Entities/UserCore/UserRoles';
import Token from '../../../src/Entities/TokenCore/Token';
import { UserData } from '../../../src/Entities/UserCore/User';
import Operator from '../../../src/Entities/UserCore/Operator';

export const readFile = (filename: string) =>
    util.promisify(fs.readFile)(filename, 'utf-8');
export const writeFile = (filename: string, data: string) =>
    util.promisify(fs.writeFile)(filename, data, 'utf-8');

export const tokenBaseTestStoragePath = path.join(__dirname, '/tokenBase.json');

// Define structure of json object stored in file

type userInfo = {
    id: number;
    password: string;
    role: UserRoles;
    username: string;
}

type operator = {
    _userInfo: UserData;
    counter?: string;
}

type tokenProcessingInfo = {
    _timeStamp: Date;
    _operator: operator;
    _status: TokenStatus;
}


type tokenBaseObjectJSONStructure = {
    _token: Token;
    tokenProcessingInfo: tokenProcessingInfo[];
    _currentStatus: TokenStatus;
};

const getAllTokenBases: () => Promise<TokenBaseObject[]> = async () => {
    const allTokenBasesJSON = await readFile(tokenBaseTestStoragePath);
    if (!allTokenBasesJSON) {
        throw new Error('Empty Token Base');
    }
    const temporaryTokenBases: tokenBaseObjectJSONStructure[] = JSON.parse(allTokenBasesJSON);
    const tokenBases = getTokenBasesFromTemporaryTokenBase(temporaryTokenBases);
    return tokenBases;
}

const getTokenBasesFromTemporaryTokenBase = (temporaryTokenBases: tokenBaseObjectJSONStructure[]) => {
    const tokenBases: TokenBaseObject[] = [];

    temporaryTokenBases.forEach(temporaryTokenBase => {
        const token = getTokenByConvertingDateStringToDateObject(temporaryTokenBase._token);

        const tokenBaseObject = new TokenBaseObject(token);

        temporaryTokenBase.tokenProcessingInfo.forEach(tokenProcessingInfo => {
            const tokenProcessing = getTokenProcessingObjectFromTokenProcessingInfo(tokenProcessingInfo);
            tokenBaseObject.addTokenProcessingInfo(tokenProcessing);
        });

        tokenBaseObject.currentStatus = temporaryTokenBase._currentStatus;
        tokenBases.push(tokenBaseObject);
    });
    return tokenBases;
}

const getTokenByConvertingDateStringToDateObject = (token: Token) => {
    return { ...token, date: new Date(token.date) }
}

const getTokenProcessingObjectFromTokenProcessingInfo = (tokenProcessingInfo: tokenProcessingInfo) => {
    const tokenProcessing = new TokenProcessing();

    const operator = new Operator(tokenProcessingInfo._operator._userInfo);
    if (tokenProcessingInfo._operator.counter) {
        operator.setCounter(tokenProcessingInfo._operator.counter);
    }
    tokenProcessing.operator = operator;

    tokenProcessing.timeStamp = new Date(tokenProcessingInfo._timeStamp);
    tokenProcessing.status = tokenProcessingInfo._status;

    return tokenProcessing;
}

const putATokenBase = async (tokenBase: TokenBaseObject) => {
    let allTokenBases: TokenBaseObject[];
    try {
        allTokenBases = await getAllTokenBases();
        allTokenBases.push(tokenBase);
    } catch (error) {
        allTokenBases = [tokenBase];
    }
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