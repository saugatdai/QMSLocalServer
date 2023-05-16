import * as path from 'path';
import * as fs from 'fs';
import * as util from 'util';
import { TokenForwardListStorageAdapter } from '../../../src/InterfaceAdapters/TokenForwardListStorageInteractorImplementation';
import { TokenForwardObject } from '../../../src/UseCases/TokenForwardListManagement/TokenForwardListManager';

export const readFile = (filename: string) =>
  util.promisify(fs.readFile)(filename, 'utf-8');
export const writeFile = (filename: string, data: string) =>
  util.promisify(fs.writeFile)(filename, data, 'utf-8');

const tokenForwardListStoragePath = path.join(__dirname, '../../../Data/tokenForwardList.json');

export const tokenForwardListStorageImplementation: TokenForwardListStorageAdapter = {
  async getTokenForwardList() {
    const tokenForwardObjectsString = await readFile(tokenForwardListStoragePath);
    if (!tokenForwardObjectsString)
      return [];
    else {
      const tokenForwardObjects: TokenForwardObject[] = JSON.parse(tokenForwardObjectsString);
      return tokenForwardObjects;
    }
  },
  async writeTokenForwardList(tokenForwardList: TokenForwardObject[]) {
    if (tokenForwardList.length === 0) {
      await writeFile(tokenForwardListStoragePath, '');
    } else {
      const tokenForwardListString = JSON.stringify(tokenForwardList);
      await writeFile(tokenForwardListStoragePath, tokenForwardListString);
    }
  }
}