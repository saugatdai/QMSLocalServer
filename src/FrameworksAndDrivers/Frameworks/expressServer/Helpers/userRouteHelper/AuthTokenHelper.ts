import * as fs from 'fs';
import * as util from 'util';
import * as path from 'path';

const readFile = (filename: string) =>
  util.promisify(fs.readFile)(filename, 'utf-8');
const writeFile = (filename: string, data: string) =>
  util.promisify(fs.writeFile)(filename, data, 'utf-8');

const authFilePath = path.join(__dirname, '/auths.json');

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
    const tokenHoldersJSON = await readFile(authFilePath);
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
    await writeFile(authFilePath, JSON.stringify(tokenHolderArray));
  }

  private async insertATokenToExistingTokensHolder(tokenHolder: tokenHolder, storedTokensHolders: tokensHolder[]) {
    const updatedTokenHolders = storedTokensHolders.map(loopTokenHolder => {
      if (loopTokenHolder.id === tokenHolder.id) {
        loopTokenHolder.tokens.push(tokenHolder.token);
      }
      return loopTokenHolder;
    });
    await writeFile(authFilePath, JSON.stringify(updatedTokenHolders));
  }

  private async storeANewTokenHolderIntoExistingTokensHolders(storedTokensHolders: tokensHolder[], tokenHolder: tokenHolder) {
    const newTokensHolder: tokensHolder = {
      id: tokenHolder.id,
      tokens: [tokenHolder.token]
    }
    storedTokensHolders.push(newTokensHolder);
    await writeFile(authFilePath, JSON.stringify(storedTokensHolders));
  }

  public async getAllTokensById(id: number) {
    const storedTokensHolders = await this.getStoredTokenHolders();
    return storedTokensHolders.find(storedTokensHolder => storedTokensHolder.id === id);
  }
}