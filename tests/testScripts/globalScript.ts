import * as util from 'util';
import * as path from 'path';
import * as fs from 'fs';

const customerFileStoragePath = path.join(__dirname, '../../Data/customers.json');
const tokenBaseFileStoragePath = path.join(__dirname, '../../Data/tokenBase.json');
const usersFileStoragePath = path.join(__dirname, '../../Data/users.json');
const tokenCountFileStoragePath = path.join(__dirname, '../../Data/tokenCount.json');
const tokenCategoryCountFileStoragePath = path.join(__dirname, '../../Data/tokenCategoryCount.json');
const tokenForwardListStoragePath = path.join(__dirname, '../../Data/tokenForwardList.json');
const authTokenStoragePath = path.join(__dirname, '../../src/FrameworksAndDrivers/Frameworks/expressServer/Helpers/userRouteHelper/auths.json')

const writeFile = (filename: string, data: string) =>
  util.promisify(fs.writeFile)(filename, data, 'utf-8');

const temporaryCountData = {
  currentTokenCount: 0,
  latestCustomerTokenCount: 0
}

export default async () => {
  await writeFile(customerFileStoragePath, '');
  await writeFile(tokenBaseFileStoragePath, '');
  await writeFile(usersFileStoragePath, '');
  await writeFile(authTokenStoragePath, '');
  await writeFile(tokenCategoryCountFileStoragePath, '');
  await writeFile(tokenCountFileStoragePath, JSON.stringify(temporaryCountData));
  await writeFile(tokenForwardListStoragePath, '');
}