import * as util from 'util';
import * as fs from 'fs';

import request from 'supertest';
import server from '../../../../../src/FrameworksAndDrivers/Frameworks/expressServer/server';
import TokenBaseStorageInteractorImplementation from '../../../../../src/InterfaceAdapters/TokenBaseStorageInteractorImplementation';
import TokenBaseStorageImplementation from '../../../../../src/FrameworksAndDrivers/Drivers/TokenBaseStorageImplementation';
import TokenBaseManager from '../../../../../src/UseCases/TokenBaseManagementComponent/TokenBaseManager';


const readFile = (filename: string) =>
  util.promisify(fs.readFile)(filename, 'utf-8');
const writeFile = (filename: string, data: string) =>
  util.promisify(fs.writeFile)(filename, data, 'utf-8');

let adminToken: string, registratorToken: string;

const setTokens = async () => {
  const adminResponse = await request(server).post('/users/login').send({
    'username': 'shaggy',
    'password': 'mypassword'
  });
  adminToken = adminResponse.body.token;

  const registratorResponse = await request(server).post('/users/login').send({
    'username': 'saugatprasadsigdel',
    'password': 'holus12345'
  });

  registratorToken = registratorResponse.body.token;
}
export default () => describe('Testing of tokenBaseRoute', () => {
  beforeAll(async () => {
    await setTokens();
  });
  it('Should get an empty tokenbase error message for requesting all tokenbases', async () => {
    const res = await request(server).get('/tokenbase').set('Authorization', `Bearer ${adminToken}`).send();
    expect(res.statusCode).toBe(500);
  });
  it('Should create a new tokenBase with no tokenCategory', async () => {
    const res = await request(server).get('/tokenbase/createatokenbase').set('Authorization', `Bearer ${registratorToken}`).send();
    expect(res.statusCode).toBe(200);
  });
  it('Should get existing tokenbase', async () => {
    const res = await request(server).get('/tokenbase').set('Authorization', `Bearer ${registratorToken}`).send();
    expect(res.statusCode).toBe(200);
  });
});