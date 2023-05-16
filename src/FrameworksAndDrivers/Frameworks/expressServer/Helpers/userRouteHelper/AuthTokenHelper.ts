import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

type tokensHolder = {
  id: number,
  tokens: string[]
}

export type tokenHolder = {
  id: number,
  token: string
}


export default class AuthTokenHelper {

  public async storeATokenForUser(tokenHolder: tokenHolder) {
    await prisma.authToken.create({
      data: {
        token: tokenHolder.token,
        userId: tokenHolder.id
      }
    })
  }

  private async getStoredTokenHolders(): Promise<tokensHolder[]> {
    const allPrismaTokens = await prisma.authToken.findMany({
      include: {
        user: {
          include: {
            authTokens: true
          }
        }
      }
    });

    const allTokenHolders: tokensHolder[] = allPrismaTokens.map(prismaToken => {
      const allTokens: string[] = prismaToken.user.authTokens.map(authToken => authToken.token);

      const tokensHolder: tokensHolder = {
        id: prismaToken.userId,
        tokens: allTokens
      }

      return tokensHolder;
    });
    
    return allTokenHolders
  }

  public async getAllTokensHolderById(id: number) {
    const storedTokensHolders = await this.getStoredTokenHolders();
    return storedTokensHolders.find(storedTokensHolder => storedTokensHolder.id === id);
  }

  public async getAllTokensOfAUserId(id: number) {
    const tokenHolders = await this.getStoredTokenHolders();
    const tokensHolder = tokenHolders.find(tokenHolder => tokenHolder.id === id);
    if (!tokensHolder) {
      return [];
    } else {
      return tokensHolder.tokens;
    }
  }

  // continue from here...

  public async deleteATokenOfUserId(id: number, token: string) {
    await prisma.authToken.deleteMany({
      where: {
        AND: {
          userId: id,
          token: token
        }
      }
    });
  }

  public async deleteAllTokensOfUserId(id: number) {
    await prisma.authToken.deleteMany({
      where:{
        userId: id
      }
    });
  }
}