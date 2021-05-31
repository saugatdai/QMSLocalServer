import * as fs from 'fs';
import * as util from 'util';
import * as path from 'path';

const readFile = (filename: string) =>
  util.promisify(fs.readFile)(filename, 'utf-8');
const writeFile = (filename: string, data: string) =>
  util.promisify(fs.writeFile)(filename, data, 'utf-8');


type tokensHolder = {
  id: number,
  tokens: string[]
}

export type tokenHolder = {
  id: number,
  token: string
}


export default class AuthTokenHelper {

  constructor(private authFilePath = path.join(__dirname, '/auths.json')) { }

  public async storeATokenForUser(tokenHolder: tokenHolder) {
    const storedTokensHolders = await this.getStoredTokenHolders();
    if (!storedTokensHolders.length) {
      await this.writeATokenHolderToBlankFile(tokenHolder);
    } else {
      if (storedTokensHolders.find(loopTokenHolder => tokenHolder.id === loopTokenHolder.id)) {
        await this.insertATokenToExistingTokensHolder(tokenHolder, storedTokensHolders);
      } else {
        await this.storeANewTokenHolderIntoExistingTokensHolders(storedTokensHolders, tokenHolder)
      }
    }
  }

  private async getStoredTokenHolders() {
    const tokenHoldersJSON = await readFile(this.authFilePath);
    let storedTokensHolders: tokensHolder[];
    if (tokenHoldersJSON) {
      storedTokensHolders = JSON.parse(tokenHoldersJSON);
      return storedTokensHolders;
    } else {
      return [];
    }
  }

  private async writeATokenHolderToBlankFile(tokenHolder: tokenHolder) {
    const tokenHolderArray: tokensHolder[] = [{
      id: tokenHolder.id,
      tokens: [tokenHolder.token]
    }]
    await writeFile(this.authFilePath, JSON.stringify(tokenHolderArray));
  }

  private async insertATokenToExistingTokensHolder(tokenHolder: tokenHolder, storedTokensHolders: tokensHolder[]) {
    const updatedTokenHolders = storedTokensHolders.map(loopTokenHolder => {
      if (loopTokenHolder.id === tokenHolder.id) {
        loopTokenHolder.tokens.push(tokenHolder.token);
      }
      return loopTokenHolder;
    });
    await writeFile(this.authFilePath, JSON.stringify(updatedTokenHolders));
  }

  private async storeANewTokenHolderIntoExistingTokensHolders(storedTokensHolders: tokensHolder[], tokenHolder: tokenHolder) {
    const newTokensHolder: tokensHolder = {
      id: tokenHolder.id,
      tokens: [tokenHolder.token]
    }
    storedTokensHolders.push(newTokensHolder);
    await writeFile(this.authFilePath, JSON.stringify(storedTokensHolders));
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

  public async deleteATokenOfUserId(id: number, token: string) {
    let storedTokensHolder = await this.getStoredTokenHolders();
    storedTokensHolder = storedTokensHolder.map(tokensHolder => {
      if (tokensHolder.id === id) {
        tokensHolder.tokens = tokensHolder.tokens.filter(loopToken => {
          return loopToken !== token;
        });
      }
      return tokensHolder;
    });

    await writeFile(this.authFilePath, JSON.stringify(storedTokensHolder));
  }

  public async deleteAllTokensOfUserId(id: number) {
    let storedTokensHolder = await this.getStoredTokenHolders();
    storedTokensHolder = storedTokensHolder.filter(tokenHolder => tokenHolder.id !== id);
    await writeFile(this.authFilePath, JSON.stringify(storedTokensHolder));
  }
}