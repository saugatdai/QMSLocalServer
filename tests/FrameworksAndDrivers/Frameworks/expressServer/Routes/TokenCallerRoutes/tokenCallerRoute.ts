import * as util from 'util';
import * as fs from 'fs';
import * as path from 'path';

import request from 'supertest';
import server from '../../../../../../src/FrameworksAndDrivers/Frameworks/expressServer/server';
import AppKernelSingleton from '../../../../../../src/FrameworksAndDrivers/Drivers/AppKernelSingleton';
import { callCategoryTokens, callNonCategoryTokens } from './callNextHelper';
import { createCustomers } from './customerCreator';
import { byPassCategoryTokens, bypassNonCategoryToken } from './byPassTokenHelper';
import { callAgainCategoryTokens, callAgainNonCategoryTokens } from './callAgainHelper';
import { callRandomCategoryTokens, callRandomNonCategoryTokens } from './randomCallHelper';
import { forwardCateogyrTokens, forwardNonCategoryTokens } from './forwardTokenHelper';


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

const pulginPath = path.join(__dirname, '/../../../../../../plugins');


export default () => describe('Testing of TokenCallerRoute Route', () => {
  beforeAll(async () => {
    await setTokens();
    const appKernelSingleton = AppKernelSingleton.getInstance();
    await appKernelSingleton.initializeCoreCallingActivities(pulginPath);
    server.set('appKernel', appKernelSingleton);
  });

  it('Should call next token', async () => {
    let res = await request(server).post('/tokencaller/nexttoken').set('Authorization', `Bearer ${operatorToken}`).send({
      "category": "",
      "actedTokenNumber": 0
    });

    expect(res.body).toHaveProperty('tokenNumber');
  });

  it('Should perform all calling functions', async () => {
    await createCustomers("M");
    await callCategoryTokens("M");
    await callNonCategoryTokens();
  });

  it('Should perform all byPass Functions', async () => {
    await createCustomers("G");
    await byPassCategoryTokens("G");
    await bypassNonCategoryToken();
  });

  it('Should perform all callAgainFunctions', async () => {
    await callAgainCategoryTokens("G");
    await callAgainNonCategoryTokens();
  });

  it('Should perform all callRandomFunctions', async () => {
    await callRandomCategoryTokens('G');
    await callRandomNonCategoryTokens();
  });

  it('Should perform all tokenForwardFunctions', async () => {
    await createCustomers("Z");
    await forwardCateogyrTokens("Z");
    await forwardNonCategoryTokens();
  });

});