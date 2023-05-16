import { TokenBaseStorageAdapter } from '../../InterfaceAdapters/TokenBaseStorageInteractorImplementation';
import { Prisma, PrismaClient } from '@prisma/client';
import { TokenBaseObject, TokenProcessing, TokenStatus } from '../../UseCases/TokenBaseManagementComponent/TokenBaseModule';
import UserRoles from '../../Entities/UserCore/UserRoles';
import Token from '../../Entities/TokenCore/Token';
import { UserData } from '../../Entities/UserCore/User';
import Operator from '../../Entities/UserCore/Operator';
import UserFactory from '../../Entities/UserCore/UserFactory';

const prisma = new PrismaClient();

const getAllTokenBases: () => Promise<TokenBaseObject[]> = async () => {
  const allPrismaTokenBases = await prisma.tokenBaseObject.findMany({
    include: {
      token: {
        include: {
          tokenCategory: true
        }
      },
      tokenProcessingInfo: {
        include: {
          operator: true
        }
      }
    }
  });

  if (allPrismaTokenBases.length == 0) {
    throw new Error('Empty Token Base');
  }

  const allTokenBaseObjects: TokenBaseObject[] = allPrismaTokenBases.map(prismaTokenBase => {
    const token: Token = {
      date: new Date(prismaTokenBase.token.date),
      tokenId: prismaTokenBase.token.tokenId,
      tokenNumber: prismaTokenBase.token.tokenNumber,
      tokenCategory: prismaTokenBase.token.tokenCategory.category
    }

    const tokenBaseObject = new TokenBaseObject(token);

    prismaTokenBase.tokenProcessingInfo.forEach(prismaTokenProcessing => {
      const tokenProcessing = new TokenProcessing();

      tokenProcessing.status = prismaTokenProcessing.status as TokenStatus;
      tokenProcessing.timeStamp = new Date(prismaTokenProcessing.timeStamp);



      const userData: UserData = {
        id: prismaTokenProcessing.operator.id,
        username: prismaTokenProcessing.operator.username,
        password: prismaTokenProcessing.operator.password,
        role: prismaTokenProcessing.operator.role as UserRoles,
        counter: prismaTokenProcessing.operator.counter
      }

      const operator = new Operator(userData);

      tokenProcessing.operator = operator;

      tokenBaseObject.addTokenProcessingInfo(tokenProcessing);
    });

    return tokenBaseObject;
  });

  return allTokenBaseObjects;
}


const putATokenBase = async (tokenBase: TokenBaseObject) => {
  if (!tokenBase.token.tokenCategory) {
    tokenBase.token.tokenCategory = '!';
  }
  const prismaTokenBase: Prisma.tokenBaseObjectCreateInput = {
    currentStatus: tokenBase.currentStatus,
    token: {
      create: {
        date: tokenBase.token.date.toString(),
        tokenNumber: tokenBase.token.tokenNumber,
        tokenCategory: {
          connectOrCreate: {
            where: {
              category: tokenBase.token.tokenCategory
            },
            create: {
              categoryName: tokenBase.token.tokenCategory,
              currentTokenCount: 0,
              latestCustomerTokenCount: 0,
              category: tokenBase.token.tokenCategory
            }
          }
        }
      }
    },
  }

  await prisma.tokenBaseObject.create({
    data: prismaTokenBase
  });
}


const getTokenBasesByStatus = async (status: TokenStatus, date?: Date) => {
  let prismaTokenBases = await prisma.tokenBaseObject.findMany({
    where: {
      currentStatus: status
    },
    include: {
      token: {
        include: {
          tokenCategory: true
        }
      },
      tokenProcessingInfo: {
        include: {
          operator: true
        }
      }
    }
  });

  if (date) {
    prismaTokenBases = prismaTokenBases.filter(prismaTokenBase => {
      const tokenDate = new Date(prismaTokenBase.token.date);
      const match = tokenDate.getDate() === date.getDate() && tokenDate.getMonth() === date.getMonth() && tokenDate.getFullYear() === date.getFullYear();
      return match;
    });
  }
  const tokenBases: TokenBaseObject[] = prismaTokenBases.map(prismaTokenBase => {
    const tokenBaseObject: TokenBaseObject = new TokenBaseObject({
      date: new Date(prismaTokenBase.token.date),
      tokenId: prismaTokenBase.token.tokenId,
      tokenNumber: prismaTokenBase.token.tokenNumber,
      tokenCategory: prismaTokenBase.token.tokenCategory.category
    });

    prismaTokenBase.tokenProcessingInfo.forEach(prismaTokenProcessingInfo => {
      const tokenProcessing: TokenProcessing = new TokenProcessing();

      const prismaOperator = prismaTokenProcessingInfo.operator;
      const operator: Operator = new Operator({
        id: prismaOperator.id,
        password: prismaOperator.password,
        role: prismaOperator.role as UserRoles,
        username: prismaOperator.username,
        counter: prismaOperator.counter
      });

      tokenProcessing.operator = operator;
      tokenProcessing.timeStamp = new Date(prismaTokenProcessingInfo.timeStamp);
      tokenProcessing.status = prismaTokenProcessingInfo.status as TokenStatus;

      tokenBaseObject.addTokenProcessingInfo(tokenProcessing);
    });

    return tokenBaseObject;
  });

  return tokenBases;
}


const getTokenBaseByTokenDate = async (date: string) => {
  const filterDate = new Date(date);

  const allPrismaokenBases = await prisma.tokenBaseObject.findMany({
    include: {
      token: {
        include: {
          tokenCategory: true
        }
      },
      tokenProcessingInfo: {
        include: {
          operator: true
        }
      }
    }
  });

  const filteredTokenBasesByDate = allPrismaokenBases.filter(prismaTokenBase => {
    const localDate = new Date(prismaTokenBase.token.date);
    return (filterDate.getDate() === localDate.getDate() && filterDate.getMonth() === localDate.getMonth() && filterDate.getFullYear() === localDate.getFullYear());
  });

  const tokenBaseObjects: TokenBaseObject[] = filteredTokenBasesByDate.map(prismaTokenBase => {
    const tokenBaseObject: TokenBaseObject = new TokenBaseObject({
      date: new Date(prismaTokenBase.token.date),
      tokenId: prismaTokenBase.token.tokenId,
      tokenNumber: prismaTokenBase.token.tokenNumber,
      tokenCategory: prismaTokenBase.token.tokenCategory.category
    });

    prismaTokenBase.tokenProcessingInfo.forEach(prismaTokenProcessingInfo => {
      const tokenProcessing: TokenProcessing = new TokenProcessing();

      const prismaOperator = prismaTokenProcessingInfo.operator;
      const operator: Operator = new Operator({
        id: prismaOperator.id,
        password: prismaOperator.password,
        role: prismaOperator.role as UserRoles,
        username: prismaOperator.username,
        counter: prismaOperator.counter
      });

      tokenProcessing.operator = operator;
      tokenProcessing.timeStamp = new Date(prismaTokenProcessingInfo.timeStamp);
      tokenProcessing.status = prismaTokenProcessingInfo.status as TokenStatus;

      tokenBaseObject.addTokenProcessingInfo(tokenProcessing);
    });

    return tokenBaseObject;
  });
  return tokenBaseObjects;
}



const resetTokenBase = async () => {
  await prisma.tokenBaseObject.deleteMany({});
}


const editATokenBase = async (tokenBase: TokenBaseObject) => {

  const tokenBasetoEdit = await prisma.tokenBaseObject.findUnique({
    where: {
      tokenId: tokenBase.token.tokenId
    }
  });

  const lastTokenProcessing = tokenBase.getBaseObjectDetails().tokenProcessingInfo[tokenBase.getBaseObjectDetails().tokenProcessingInfo.length - 1];

  if (lastTokenProcessing) {
    await prisma.tokenProcessing.create({
      data: {
        status: lastTokenProcessing.status,
        timeStamp: lastTokenProcessing.timestamp.toString(),
        operator: {
          connect: {
            id: lastTokenProcessing.operator.getUserInfo().id
          }
        },
        tokenBaseObject: {
          connect: {
            tokenBaseId: tokenBasetoEdit.tokenBaseId
          }
        }
      }
    });
  }

  await prisma.tokenBaseObject.update({
    where: {
      tokenBaseId: tokenBasetoEdit.tokenBaseId
    },
    data: {
      currentStatus: tokenBase.currentStatus
    }
  });



  // const prismaTokenBase: Prisma.tokenBaseObjectCreateInput = {
  //   currentStatus: tokenBase.currentStatus,
  //   token: {
  //     connect: { tokenId: tokenBase.token.tokenId }
  //   }
  // }

  // await prisma.tokenBaseObject.update({
  //   select: {
  //     token: true
  //   }, where: {
  //     tokenId: tokenBase.token.tokenId
  //   },
  //   data: {
  //     ...prismaTokenBase
  //   }
  // });
}



const readTodaysTokenBaseByTokenNumber = async (tokenNumber: number, category?: string) => {
  const token = await prisma.token.findFirst({
    where: {
      AND: {
        tokenNumber: tokenNumber,
        tokenCategory: {
          category: category ? category : '!'
        }
      }
    },
    include: {
      tokenCategory: true
    }
  })

  if(!token){
    throw new Error(`Token you've submitted was not found in tokenBase`);
  }

  const prismaTokenBase = await prisma.tokenBaseObject.findUnique({
    where: {
      tokenId: token.tokenId
    },
    include: {
      token: {
        include: {
          tokenCategory: true
        }
      },
      tokenProcessingInfo: {
        include: {
          operator: true
        }
      }
    }
  });

  const tokenBaseObject = new TokenBaseObject({
    date: new Date(token.date),
    tokenId: token.tokenId,
    tokenNumber: token.tokenNumber,
    tokenCategory: token.tokenCategory.category === '!' ? '' : token.tokenCategory.category
  });

  prismaTokenBase.tokenProcessingInfo.forEach(prismaTokenProcessingInfo => {
    const tokenProcessing: TokenProcessing = new TokenProcessing();

    const operator: Operator = new Operator({
      id: prismaTokenProcessingInfo.operator.id,
      password: prismaTokenProcessingInfo.operator.password,
      username: prismaTokenProcessingInfo.operator.username,
      role: prismaTokenProcessingInfo.operator.role as UserRoles,
      counter: prismaTokenProcessingInfo.operator.counter
    });

    tokenProcessing.operator = operator;
    tokenProcessing.status = prismaTokenProcessingInfo.status as TokenStatus;
    tokenProcessing.timeStamp = new Date(prismaTokenProcessingInfo.timeStamp);

    tokenBaseObject.addTokenProcessingInfo(tokenProcessing);
  })

  return tokenBaseObject;

}


const readNextAvailableTokenNumberInACategoryForToday = async (tokenCategory: string) => {
  const highestToken = await prisma.token.findFirst({
    orderBy: {
      tokenNumber: 'desc'
    },
    where: {
      tokenCategory: {
        category: tokenCategory
      }
    }
  });

  return (highestToken.tokenId + 1);
}

const readTokenBasesByTokenCategory = (tokenBases: TokenBaseObject[], tokenCategory: string) => {
  return tokenBases.filter(tokenBase => tokenBase.token.tokenCategory === tokenCategory);
}


const readTokenBaseByTokenId = async (tokenId: number) => {
  const prismaTokenBaseObject = await prisma.tokenBaseObject.findFirst({
    where: {
      tokenId: tokenId
    },
    include: {
      token: {
        include: {
          tokenCategory: true
        }
      },
      tokenProcessingInfo: {
        include: {
          operator: true
        }
      }
    }
  });

  const token: Token = {
    date: new Date(prismaTokenBaseObject.token.date),
    tokenId: prismaTokenBaseObject.tokenId,
    tokenNumber: prismaTokenBaseObject.token.tokenNumber,
    tokenCategory: prismaTokenBaseObject.token.tokenCategory.category
  }

  const tokenBaseObject = new TokenBaseObject(token);

  prismaTokenBaseObject.tokenProcessingInfo.forEach(prismaTokenProcessing => {
    const tokenProcessingInfo = new TokenProcessing();
    const operator: Operator = new Operator({
      id: prismaTokenProcessing.operator.id,
      password: prismaTokenProcessing.operator.password,
      username: prismaTokenProcessing.operator.username,
      role: prismaTokenProcessing.operator.role as UserRoles,
      counter: prismaTokenProcessing.operator.counter
    });

    tokenProcessingInfo.operator = operator;
    tokenProcessingInfo.status = prismaTokenProcessing.status as TokenStatus;
    tokenProcessingInfo.timeStamp = new Date(prismaTokenProcessing.timeStamp);

    tokenBaseObject.addTokenProcessingInfo(tokenProcessingInfo);
  });

  return tokenBaseObject;
}


const getNextAvailableTokenId = async () => {
  const highestIdToken = await prisma.token.findFirst({
    orderBy: {
      tokenId: 'desc'
    }
  });

  if (!highestIdToken) {
    return 0;
  }

  return (highestIdToken.tokenId + 1);
}

const TokenBaseStorageImplementation: TokenBaseStorageAdapter = {
  getAllTokenBases,
  putATokenBase,
  getTokenBasesByStatus,
  getTokenBaseByTokenDate,
  resetTokenBase,
  editATokenBase,
  readTodaysTokenBaseByTokenNumber,
  readNextAvailableTokenNumberInACategoryForToday,
  readTokenBasesByTokenCategory,
  readTokenBaseByTokenId,
  getNextAvailableTokenId
};

export default TokenBaseStorageImplementation;