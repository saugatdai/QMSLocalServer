import * as util from 'util';
import * as fs from 'fs';
import * as path from 'path';

import request from 'supertest';
import server from '../../../../src/FrameworksAndDrivers/Frameworks/expressServer/server';
import { response } from 'express';
import { changeStoragePath, testStoragePath } from '../../../../src/FrameworksAndDrivers/Drivers/UserStorageImplementation';

const writeFile = (filename: string, data: string) =>
  util.promisify(fs.writeFile)(filename, data, 'utf-8');

const createUsers = async () => {
  const superAdminResponse = await request(server).post('/users/superAdmin').send({
    'username': 'shaggydai',
    'role': 'SuperAdministrator',
    'password': 'helloworld!!'
  });

  console.log(superAdminResponse.body);
}

describe('Testing of tokenbaseroute', () => {
  it('sdf', async () => {
    expect(true).toBeTruthy();
  })
});