import * as util from 'util';
import * as fs from 'fs';
import * as path from 'path';

import request from 'supertest';
import server from '../../../../../src/FrameworksAndDrivers/Frameworks/expressServer/server';
import AppKernelSingleton from '../../../../../src/FrameworksAndDrivers/Drivers/AppKernelSingleton';


const readFile = (filename: string) =>
  util.promisify(fs.readFile)(filename, 'utf-8');
const writeFile = (filename: string, data: string) =>
  util.promisify(fs.writeFile)(filename, data, 'utf-8');


let adminToken: string, registratorToken: string, operatorToken: string;

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

  const operatorResponse = await request(server).post('/users/login').send({
    'username': 'holusdai',
    'password': 'holusmondus'
  });

  operatorToken = operatorResponse.body.token;
}

const pulginPath = path.join(__dirname, '/../../../../../plugins');

export default () => describe('Testing of TokenCount Route', () => {
  beforeAll(async () => {
    await setTokens();
    const appKernelSingleton = AppKernelSingleton.getInstance();
    await appKernelSingleton.initializeCoreCallingActivities(pulginPath);
    server.set('appKernel', appKernelSingleton);
  });

  it('Should call again next token', async () => {
    const res = await request(server).post('/tokencaller/nexttoken').set('Authorization', `Bearer ${operatorToken}`).send({
      "category": "",
      "actedTokenNumber": 0
    });

    console.log(res.body);
  });

});