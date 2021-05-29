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

  /* ###################### Superadmin Creation and Admin CRUD ###################### */

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

  it('Should not allow other users to view admins', async () => {
    const res1 = await request(server).get('/users/login').send({
      'username': 'shaggy',
      'password': 'mypassword'
    });

    token = res1.body.token;
    const res = await request(server).get('/users/admins').set('Authorization', `Bearer ${token}`).send();
    expect(res.statusCode).toBe(401);
  });

  it('Should allow superadmins to view admins', async () => {
    let res = await request(server).post('/users/login').send({
      'username': 'saugatdai',
      'password': 'mypassword'
    });
    token = res.body.token;
    res = await request(server).get('/users/admins').set('Authorization', `Bearer ${token}`).send();
    expect(res.statusCode).toBe(200);
  });

  it('Should allow superadmins to edit admins', async () => {
    await request(server).post('/users').set('Authorization', `Bearer ${token}`).send({
      'username': 'holus',
      'role': 'Administrator',
      'password': 'holusdai123'
    });

    let res = await request(server).patch('/users/admins/3').set('Authorization', `Bearer ${token}`).send({
      'username': 'shaggy1',
      'role': 'Administrator',
      'password': 'hello123'
    });
    expect(res.statusCode).toEqual(200);
  });

  it('Should not allow superadmins to edit admins with missing properties and values ', async () => {
    let res = await request(server).post('/users').set('Authorization', `Bearer ${token}`).send({
      'user': 'saugatsigdel',
      'role': 'Administrator',
      'password': 'helloworld'
    });
    expect(res.statusCode).toBe(400);

    res = await request(server).post('/users').set('Authorization', `Bearer ${token}`).send({
      'username': 'saugatsigdel',
      'rol': 'Administrator',
      'password': 'helloworld'
    });
    expect(res.statusCode).toBe(400);

    res = await request(server).post('/users').set('Authorization', `Bearer ${token}`).send({
      'username': 'saugatsigdel',
      'roll': 'Administrator',
      'passwod': 'helloworld'
    });
    expect(res.statusCode).toBe(400);

    res = await request(server).post('/users').set('Authorization', `Bearer ${token}`).send({
      'username': 'sa',
      'role': 'Administrator',
      'password': 'helloworld'
    });
    expect(res.statusCode).toBe(400);

    res = await request(server).post('/users').set('Authorization', `Bearer ${token}`).send({
      'username': 'saugatsigdel',
      'role': 'Adm',
      'password': 'helloworld'
    });
    expect(res.statusCode).toBe(400);

    res = await request(server).post('/users').set('Authorization', `Bearer ${token}`).send({
      'username': 'saugatsigdel',
      'role': 'Administrator',
      'password': 'held'
    });
    expect(res.statusCode).toBe(400);
  });

  it('Should not allow other users to update other admins', async () => {
    const res = await request(server).post('/users/login').send({
      'username': 'shaggy1',
      'password': 'hello123'
    });

    const tempToken = res.body.token;

    const res2 = await request(server).patch('/users/admins/:2').set('Authorization', `Bearer ${tempToken}`).send({
      'username': 'shaggy12345',
      'password': 'holusmondus',
      'role': 'Administrator'
    });
    expect(res2.status).toBe(401);
  });

  it('Should not allow other users to view an admin profile', async () => {
    let res = await request(server).post('/users/login').send({
      'username': 'shaggy',
      'password': 'hello123'
    });
    const tempToken = res.body.token;
    res = await request(server).get('/users/admins/2').set('Authorization', `Bearer ${tempToken}`).send();
    expect(res.statusCode).toBe(401)
  });

  it('Should allow superadmins to view an admin profile', async () => {
    let res = await request(server).get('/users/admins/2').set('Authorization', `Bearer ${token}`).send();
    expect(res.statusCode).toBe(200);
  });

  it('Should not allow other users to delete admins', async () => {
    const res1 = await request(server).post('/users/login').send({
      'username': 'shaggy1',
      'password': 'hello123'
    });

    const tempToken = res1.body.token;

    const res2 = await request(server).delete('/users/admins/:2').set('Authorization', `Bearer ${tempToken}`).send();
    expect(res2.statusCode).toBe(401);
  });



  it('Shuld allow superadmins to delete admins', async () => {
    const res = await request(server).delete('/users/admins/3').set('Authorization', `Bearer ${token}`).send();
    expect(res.statusCode).toBe(200);
  });





  /*################################### Admin Functionality and Users CRUD ######################################## */

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
    const res1 = await request(server).post('/users').set('Authorization', `Bearer ${token}`).send({
      'user': 'saugatdai',
      'role': 'Operator',
      'password': "mypassword"
    });
    expect(res1.statusCode).toEqual(400);
    expect(res1.body.error).toEqual('invalid userdata');
    const res2 = await request(server).post('/users').set('Authorization', `Bearer ${token}`).send({
      'username': 'saugatdai',
      'roll': 'Registrator',
      'password': "mypassword"
    });
    expect(res2.statusCode).toEqual(400);
    expect(res2.body.error).toEqual('invalid userdata');
    const res3 = await request(server).post('/users').set('Authorization', `Bearer ${token}`).send({
      'username': 'saugatdai',
      'role': 'Operator',
      'passwo': "mypassword"
    });
    expect(res3.statusCode).toEqual(400);
    expect(res3.body.error).toEqual('invalid userdata');
  });

  it('Should not allow other to view the general users', async () => {
    let res = await request(server).post('/users/login').send({
      'username': 'abcd',
      'password': 'mypassword'
    });
    token = res.body.token;

    res = await request(server).get('/users').set('Authorization', `Bearer ${token}`).send();
    expect(res.statusCode).toEqual(401);

    res = await request(server).post('/users/login').send({
      'username': 'saugatdai',
      'password': 'mypassword'
    });
    token = res.body.token;

    res = await request(server).get('/users').set('Authorization', `Bearer ${token}`).send();
    expect(res.statusCode).toEqual(401);
  });

  it('Should not allow a user to view another user profile ', async () => {
    const res = await request(server).get('/users/getuser/3').set('Authorization', `Bearer ${token}`).send();
    expect(res.statusCode).toEqual(401);
  });

  it('Should allow admin to view the general users', async () => {
    let res = await request(server).post('/users/login').send({
      'username': 'shaggy',
      'password': 'mypassword'
    });
    token = res.body.token;

    res = await request(server).get('/users').set('Authorization', `Bearer ${token}`).send();
    expect(res.statusCode).toEqual(200);
  });

  it('Should allow admin to view another user profile', async () => {
    const res = await request(server).get('/users/getuser/3').set('Authorization', `Bearer ${token}`).send();
    expect(res.statusCode).toBe(200);
  });

  it('Should allow admins to edit users', async () => {
    const res = await request(server).patch('/users/3').set('Authorization', `Bearer ${token}`).send({
      'username': 'saugatprasadsigdel',
      'password': 'holus12345',
      'role': 'Registrator'
    });
    expect(res.statusCode).toEqual(200);
  });

  it('Should not allow other users to edit users', async () => {
    let res = await request(server).post('/users/login').send({
      'username': 'saugatprasadsigdel',
      'password': 'holus12345'
    });
    const tempToken = res.body.token;
    res = await request(server).patch('/users/3').set('Authorization', `Bearer ${tempToken}`).send({
      'username': 'saugatprasadsigdel',
      'password': 'holus12345',
      'role': 'Registrator'
    });
    expect(res.statusCode).toEqual(401);
  });

  it('Should not allow admin to edit users with invalid properties or values', async () => {
    let res = await request(server).post('/users').set('Authorization', `Bearer ${token}`).send({
      'user': 'saugatsigdel',
      'role': 'Registrator',
      'password': 'helloworld'
    });
    expect(res.statusCode).toBe(400);

    res = await request(server).post('/users').set('Authorization', `Bearer ${token}`).send({
      'username': 'saugatsigdel',
      'rol': 'Registrator',
      'password': 'helloworld'
    });
    expect(res.statusCode).toBe(400);

    res = await request(server).post('/users').set('Authorization', `Bearer ${token}`).send({
      'username': 'saugatsigdel',
      'role': 'Registrator',
      'passwod': 'helloworld'
    });
    expect(res.statusCode).toBe(400);

    res = await request(server).post('/users').set('Authorization', `Bearer ${token}`).send({
      'username': 'sa',
      'role': 'Registrator',
      'password': 'helloworld'
    });
    expect(res.statusCode).toBe(400);

    res = await request(server).post('/users').set('Authorization', `Bearer ${token}`).send({
      'username': 'saugatsigdel',
      'role': 'Adm',
      'password': 'helloworld'
    });
    expect(res.statusCode).toBe(400);

    res = await request(server).post('/users').set('Authorization', `Bearer ${token}`).send({
      'username': 'saugatsigdel',
      'role': 'Administrator',
      'password': 'held'
    });
    expect(res.statusCode).toBe(400);
  });

  it('Should not allow superadmins to delete other users than admins', async () => {
    let res1 = await request(server).post('/users/login').send({
      'username': 'shaggy1',
      'password': 'hello123'
    });
    const tempToken = res1.body.token;
    res1 = await request(server).post('/users').set('Authorization', `Bearer ${tempToken}`).send({
      'username': 'holusdai',
      'password': 'holusmondus',
      'role': 'Operator'
    });

    res1 = await request(server).delete('/users/admins/4').set('Authorization', `Bearer ${token}`).send();
    expect(res1.statusCode).toEqual(401);
  });

  it('Should not allow other users to delete admin', async () => {
    let res = await request(server).post('/users/login').send({
      'username': 'saugatprasadsigdel',
      'password': 'holus12345'
    });
    const tempToken = res.body.token;
    res = await request(server).delete('/users/3').set('Authorization', `Bearer ${tempToken}`).send();

    expect(res.statusCode).toBe(401);
  });

  it('Should allow admin to delete other users', async () => {
    const res = await request(server).delete('/users/3').set('Authorization', `Bearer ${token}`).send();
    expect(res.statusCode).toBe(200);
  });

  it('Should not allow other users to delete other users', async () => {
    let res = await request(server).post('/users/login').send({
      'username': 'saugatprasadsigdel',
      'password': 'holus12345'
    });
    const tempToken = res.body.token;
    res = await request(server).delete('/users/4').set('Authorization', `Bearer ${tempToken}`).send();
    expect(res.statusCode).toBe(401);
  });

});