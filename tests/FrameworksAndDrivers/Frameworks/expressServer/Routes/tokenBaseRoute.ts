import * as util from 'util';
import * as fs from 'fs';

import request from 'supertest';
import server from '../../../../../src/FrameworksAndDrivers/Frameworks/expressServer/server';


const readFile = (filename: string) =>
  util.promisify(fs.readFile)(filename, 'utf-8');
const writeFile = (filename: string, data: string) =>
  util.promisify(fs.writeFile)(filename, data, 'utf-8');

let adminToken: string, registratorToken: string, workingTokenBaseNumber: number, workingTokenBaseId: number;

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

  it('Should create a new category', async () => {
    const res = await request(server).post('/tokenbase/createtokencategory').set('Authorization', `Bearer ${adminToken}`).send({
      "category": "A"
    });
    expect(res.statusCode).toBe(200);
  });

  it('Should create a new tokenBase with a category', async () => {
    const res = await request(server).get('/tokenbase/createatokenbase/A').set('Authorization', `Bearer ${registratorToken}`).send();
    expect(res.statusCode).toBe(200);
  });

  it('Should get existing tokenbase', async () => {
    const res = await request(server).get('/tokenbase').set('Authorization', `Bearer ${registratorToken}`).send();
    expect(res.statusCode).toBe(200);
  });

  it('Should get the token base by status', async () => {
    const res = await request(server).get('/tokenbase/filterbystatus/Unprocessed').set('Authorization', `Bearer ${adminToken}`).send();
    expect(res.statusCode).toBe(200);
  });

  it('Should get the token base by status and date', async () => {
    const today = new Date().toString();
    const res = await request(server).get(`/tokenbase/filterbystatusanddate/Unprocessed/${today}`).set('Authorization', `Bearer ${adminToken}`).send();
    expect(res.statusCode).toBe(200);
  });

  it('Should get the token base by date', async () => {
    const today = new Date().toString();
    const res = await request(server).get(`/tokenbase/filterbydate/${today}`).set('Authorization', `Bearer ${adminToken}`).send();
    expect(res.statusCode).toBe(200);
  });

  it('Should get the token base by token category', async () => {
    const res = await request(server).get('/tokenbase/filterbycategory/A').set('Authorization', `Bearer ${adminToken}`).send();
    expect(res.statusCode).toBe(200);
  });

  it('Should get the token bases with no category', async () => {
    const res = await request(server).get('/tokenbase/filterbycategory').set('Authorization', `Berare ${adminToken}`).send();
    expect(res.statusCode).toBe(200);
  });

  it('Should get todays token base by token number', async () => {
    workingTokenBaseNumber = 1;
    const res = await request(server).get(`/tokenbase/todaystokenbase/${workingTokenBaseNumber}`).set('Authorization', `Bearer ${adminToken}`).send();
    expect(res.statusCode).toBe(200);
  });

  it('Should get a tokenbase by tokenId', async () => {
    const res = await request(server).get('/tokenbase/tokenbasebytokenid/2').set('Authorization', `Bearer ${adminToken}`).send();
    expect(res.statusCode).toBe(200);
  });

  it('Should reset all token bases', async () => {
    let res = await request(server).delete('/tokenbase').set('Authorization', `Bearer ${adminToken}`).send();
    expect(res.statusCode).toBe(200);
    res = await request(server).get('/tokenbase').set('Authorization', `Bearer ${adminToken}`).send();
    expect(res.body).toHaveProperty('error');
  });
});