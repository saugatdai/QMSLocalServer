import * as util from 'util';
import * as fs from 'fs';

import request from 'supertest';
import server from '../../../../../src/FrameworksAndDrivers/Frameworks/expressServer/server';


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

export default () => describe('Testing of TokenCount Route', () => {
  beforeAll(async () => {
    await setTokens();
  });


  it('Should get the current cutomer token count', async () => {
    const res = await request(server).get('/tokencount').set('Authorization', `Bearer ${registratorToken}`).send();
    expect(res.statusCode).toBe(200);
  });

  it('Should get the token count of the last customer', async () => {
    const res = await request(server).get('/tokencount/lastcustomertokencount').set('Authorization', `Bearer ${registratorToken}`).send();
    expect(res.statusCode).toBe(200);
  });
});