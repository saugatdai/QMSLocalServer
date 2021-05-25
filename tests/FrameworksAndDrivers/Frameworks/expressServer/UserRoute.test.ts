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
const tokenFilePath = path.join(__dirname, '../../../../src/FrameworksAndDrivers/Frameworks/expressServer/Helpers/userRouteHelper/auths.json');

describe('Testing of the /users route with empty database', () => {

  beforeAll(async () => {
    await writeFile(filePath, '');
    await writeFile(tokenFilePath, '');
  });
  afterAll(async () => {
    await writeFile(filePath, '');
    await writeFile(tokenFilePath, '');
  });

  it('should get all users when userfile is empty', async () => {
    const res = await request(server).get('/users');
    expect(res.statusCode).toEqual(200);
  });

  it('Should deny creating SuperAdministrator because of a missing or invalid property', async () => {
    const res1 = await request(server).post('/users/superAdmin').send({
      'user': 'saugatdai',
      'role': 'SuperAdministrator',
      'password': "mypassword"
    });
    expect(res1.statusCode).toEqual(400);
    expect(res1.body.error).toEqual('invalid userdata');
    const res2 = await request(server).post('/users/superAdmin').send({
      'username': 'saugatdai',
      'roll': 'SuperAdministrator',
      'password': "mypassword"
    });
    expect(res2.statusCode).toEqual(400);
    expect(res2.body.error).toEqual('invalid userdata');
    const res3 = await request(server).post('/users/superAdmin').send({
      'username': 'saugatdai',
      'role': 'SuperAdministrator',
      'passwo': "mypassword"
    });
    expect(res3.statusCode).toEqual(400);
    expect(res3.body.error).toEqual('invalid userdata');
  });

  it('Should deny creating other user than superadmin', async () => {
    const res = await request(server).post('/users/superAdmin').send({
      'username': 'saugatdai',
      'role': 'Operator',
      'password': "mypassword"
    });
    expect(res.statusCode).toEqual(400);
    expect(res.body.error).toBe('This route is for creating superadmins only');
  })

  it('Should create a SuperAdministrator', async () => {
    const res = await request(server).post('/users/superAdmin').send({
      'username': 'saugatdai',
      'role': 'SuperAdministrator',
      'password': "mypassword"
    });
    expect(res.statusCode).toEqual(201);
  });

  it('Should deny creating a superadmin since it already exists', async () => {
    const res = await request(server).post('/users/superAdmin').send({
      'username': 'saugatdai',
      'role': 'SuperAdministrator',
      'password': "mypassword"
    });
    expect(res.statusCode).toEqual(400);
  });

  it('Should deny creating Adminsitrator because of the requirement of login and superadmin authority', async () => {
    const res = await request(server).post('/users').send({
      'username': 'shaggy',
      'role': 'Administrator',
      'password': "mypassword"
    });
    expect(res.statusCode).toEqual(401);
  });

  it('Should not login user with invalid username or password', async () => {
    const res = await request(server).post('/users/login').send({
      'username': 'jpt',
      'password': 'mypassword'
    });
    expect(res.statusCode).toBe(400);

    const res2 = await request(server).post('/users/login').send({
      'username': 'jpt',
      'password': 'mypassword'
    });
    expect(res2.statusCode).toBe(400);
  });

  let token: string = null;

  it('Should successfully login the Superadministrator', async () => {
    const res = await request(server).post('/users/login').send({
      'username': 'saugatdai',
      'password': 'mypassword'
    });
    expect(res.statusCode).toBe(200);
    token = res.body.token;
  });

  it('Should refuse to create administrator becuse it requires superadmin login authority', async () => {
    const res = await request(server).post('/users').send({
      'username': 'shaggy',
      'role': 'Administrator',
      'password': 'mypassword'
    });
    expect(res.statusCode).toBe(401);
  });

  it('It should create a new administrator if superadmin authority is possessed', async () => {
    const res = await request(server).post('/users').set('Authorization', `Bearer ${token}`).send({
      'username': 'shaggy',
      'role': 'Administrator',
      'password': 'mypassword'
    });
    expect(res.statusCode).toBe(201);
  });

  it('Should reject invalid token for an administrator creating a user', async () => {
    const newToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEifQ.5EUZWk745D-_yyLWlqRQqjv6ZmWv8gILqCH22g3O4tA';
    const res = await request(server).post('/users').set('Authorization', `Bearer ${newToken}`).send({
      'username': 'abcd',
      'role': 'Administrator',
      'password': 'mypassword'
    });
    expect(res.statusCode).toEqual(401);
  });

  it('Should reject create a normal user with superadmin authority', async () => {
    const res = await request(server).post('/users').set('Authorization', `Bearer ${token}`).send({
      'username': 'abcd',
      'role': 'Operator',
      'password': 'mypassword'
    });
    expect(res.statusCode).toEqual(400);
  });

  it('Should successfully log in as an admin', async () => {
    const res = await request(server).post('/users/login').send({
      'username': 'shaggy',
      'password': 'mypassword'
    });
    expect(res.statusCode).toBe(200);
    token = res.body.token;
  });

  it('Should successfully create an ordinary user with admin access', async () => {
    const res = await request(server).post('/users').set('Authorization', `Bearer ${token}`).send({
      'username': 'abcd',
      'role': 'Operator',
      'password': 'mypassword'
    });
    expect(res.statusCode).toEqual(201);
  })

  it('Should not allow admin create admins', async () => {
    const res = await request(server).post('/users').set('Authorization', `Bearer ${token}`).send({
      'username': 'defg',
      'role': 'Administrator',
      'password': 'helooworld'
    });
    expect(res.statusCode).toEqual(400);
  });

  it('Should not allow creation of super admin with user creation route', async () => {
    const res = await request(server).post('/users').set('Authorization', `Bearer ${token}`).send({
      'username': 'defg',
      'role': 'SuperAdministrator',
      'password': 'helooworld'
    });
    expect(res.statusCode).toEqual(400);
  });

  it('Should deny creating user because of a missing or invalid property', async () => {
    const res1 = await request(server).post('/users/superAdmin').send({
      'user': 'saugatdai',
      'role': 'Operator',
      'password': "mypassword"
    });
    expect(res1.statusCode).toEqual(400);
    expect(res1.body.error).toEqual('invalid userdata');
    const res2 = await request(server).post('/users/superAdmin').send({
      'username': 'saugatdai',
      'roll': 'Registrator',
      'password': "mypassword"
    });
    expect(res2.statusCode).toEqual(400);
    expect(res2.body.error).toEqual('invalid userdata');
    const res3 = await request(server).post('/users/superAdmin').send({
      'username': 'saugatdai',
      'role': 'Operator',
      'passwo': "mypassword"
    });
    expect(res3.statusCode).toEqual(400);
    expect(res3.body.error).toEqual('invalid userdata');
  });

  it('Should get all users', async () => {
    const res = await request(server).get('/users').send();
    console.log(res.body);
  });


});