import * as util from 'util';
import * as fs from 'fs';
import * as path from 'path';

import request from 'supertest';
import server from '../../../../src/FrameworksAndDrivers/Frameworks/expressServer/server';
import { UserData } from '../../../../src/Entities/UserCore/User';
import UserRoles from '../../../../src/Entities/UserCore/UserRoles';


const readFile = (filename: string) =>
  util.promisify(fs.readFile)(filename, 'utf-8');
const writeFile = (filename: string, data: string) =>
  util.promisify(fs.writeFile)(filename, data, 'utf-8');

const usersJSON = `[
  {
      "id": 1,
      "username": "saugatdai",
      "role": "Administrator",
      "password": "123"
  },
  {
      "id": 2,
      "username": "lochandai",
      "role": "Registrator",
      "password": "abc",
      "counter": "8"
  },
  {
      "id": 3,
      "username": "Sangitdai",
      "role": "Operator",
      "counter": "7",
      "password": "def"
  },
  {
      "id": 4,
      "username": "mu*isdai",
      "password": "chutis",
      "role": "Registrator"
  },
  {
      "id": 5,
      "username": "holusdai",
      "role": "Registrator",
      "password": "jkl"
  }
]`;

const firstUserData: UserData = {
  id: 1,
  username: 'saugatdai',
  role: UserRoles.ADMIN,
  password: '123',
};

const lastUserData = {
  id: 5,
  username: 'holusdai',
  role: 'Registrator',
  password: 'jkl',
};

const filePath = path.join(__dirname, '../../../../Data/users.json');

describe('Testing of the /users route with empty database', () => {

  beforeAll(async () => {
    await writeFile(filePath, '');
  });
  afterAll(async () => {
    await writeFile(filePath, '');
  });

  it('should get all users when userfile is empty', async () => {
    const res = await request(server).get('/users');
    expect(res.statusCode).toEqual(200);
  });

  it('Should create a SuperAdministrator', async () => {
    const res = await request(server).post('/users').send({
      'username': 'saugatdai',
      'role': 'SuperAdministrator',
      'password': "mypassword"
    });
    expect(res.statusCode).toEqual(201);
  });

  it('Should reject creating a SuperAdministrator if already exists', async () => {
    const res = await request(server).post('/users').send({
      'username': 'shaggy',
      'role': 'SuperAdministrator',
      'password': "mypassword"
    });
    expect(res.statusCode).toEqual(400);
  });

  it('Should login a user successfully', async () => {
    const res = await request(server).post('/users/login').send({
      'username': 'saugatdai',
      'password': 'mypassword'
    });
    console.log(res.body);
    expect(res.statusCode).toEqual(200);
  });

});