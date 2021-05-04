import * as path from 'path';
import * as fs from 'fs';
import * as util from 'util';

export const readFile = (filename: string) =>
  util.promisify(fs.readFile)(filename, 'utf-8');
export const writeFile = (filename: string, data: string) =>
  util.promisify(fs.writeFile)(filename, data, 'utf-8');

type TokenStatusObject = {
  currentTokenCount: number;
  latestCustomerTokenCount: number;
}
const tokenCountStatusStoragePath = path.join(__dirname, '/tokenCount.json');

const getTokenStatusObject = async () => {
  const tokenStatusJSON = await readFile(tokenCountStatusStoragePath);
  const tokenStatusObject = await JSON.parse(tokenStatusJSON) as TokenStatusObject;
  return tokenStatusObject;
}

const getCurrentCount = async () => {
  const tokenStatusObject = await getTokenStatusObject();
  return tokenStatusObject.currentTokenCount;
}

const resetCount = async () => {
  const tokenStatusObject = await getTokenStatusObject();
  tokenStatusObject.currentTokenCount = 0;
  await writeFile(tokenCountStatusStoragePath, JSON.stringify(tokenStatusObject));
}

const updateCurrentCount = async (newCount: number) => {
  const tokenStatusObject = await getTokenStatusObject();
  tokenStatusObject.currentTokenCount = newCount;
  await writeFile(tokenCountStatusStoragePath, JSON.stringify(tokenStatusObject));
}

export {
  updateCurrentCount,
  getCurrentCount,
  resetCount
}