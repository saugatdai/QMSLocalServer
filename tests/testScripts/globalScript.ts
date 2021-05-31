import * as util from 'util';
import * as path from 'path';
import * as fs from 'fs';

const customerFileStoragePaths = path.join(__dirname, '../../Data/customers.json');
const tokenBaseFileStoragePaths = path.join(__dirname, '../../Data/tokenBase.json');
const usersFileStoragePaths = path.join(__dirname, '../../Data/users.json');
const authTokenStoragePath = path.join(__dirname, '../../src/FrameworksAndDrivers/Frameworks/expressServer/Helpers/userRouteHelper/auths.json')

const writeFile = (filename: string, data: string) =>
  util.promisify(fs.writeFile)(filename, data, 'utf-8');


export default async () => {
  await writeFile(customerFileStoragePaths, '');
  await writeFile(tokenBaseFileStoragePaths, '');
  await writeFile(usersFileStoragePaths, '');
  await writeFile(authTokenStoragePath, '');
}