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

  it('Should set the token count of the last customer', async () => {
    let res = await request(server).put('/tokencount/setlastcustomertokencount/123').set('Authorization', `Bearer ${registratorToken}`).send();
    res = await request(server).get('/tokencount/lastcustomertokencount').set('Authorization', `Bearer ${registratorToken}`).send();
    expect(res.body.lastCustomerTokenCount).toBe(123);
  });

  it('Should preset the current token count', async () => {
    let res = await request(server).put('/tokencount/presettokencount/120').set('Authorization', `Bearer ${registratorToken}`).send();
    res = await request(server).get('/tokencount').set('Authorization', `Bearer ${registratorToken}`).send();
    expect(res.body.currentCustomerTokenCount).toBe(120);
  });

  it('Should rest the current token count', async () => {
    let res = await request(server).put('/tokencount/resettokencount').set('Authorization', `Bearer ${registratorToken}`).send();
    res = await request(server).get('/tokencount').set('Authorization', `Bearer ${registratorToken}`).send();
    expect(res.body.currentCustomerTokenCount).toBe(0);
  });

  it('Should get the current customer token count of a category', async () => {
    let res = await request(server).post('/tokenbase/createtokencategory').set('Authorization', `Bearer ${adminToken}`).send({
      "category": "T"
    });
    res = await request(server).get('/tokencount/categorytokencount/T').set('Authorization', `Bearer ${registratorToken}`).send();
    expect(res.body.currentCustomerCountOfCategory).toBe(0);
  });

  it('Should preset token count of a category', async () => {
    let res = await request(server).put('/tokencount/categorytokencount/categorycountpreset/123').set('Authorization', `Bearer ${registratorToken}`).send({
      "category": "T"
    });
    res = await request(server).get('/tokencount/categorytokencount/T').set('Authorization', `Bearer ${registratorToken}`).send();
    expect(res.body.currentCustomerCountOfCategory).toBe(123);
  });

  it('Should reset token count of a category', async () => {
    let res = await request(server).put('/tokencount/categorytokencount/categorycountreset').set('Authorization', `Bearer ${registratorToken}`).send({
      "category": "T"
    });
    res = await request(server).get('/tokencount/categorytokencount/T').set('Authorization', `Bearer ${registratorToken}`).send();
    expect(res.body.currentCustomerCountOfCategory).toBe(0);
  });

  it('Should get the latestcustomertokencount of a category', async () => {
    const res = await request(server).get('/tokencount/categorytokencount/latestcustomercount/T').set('Authorization', `Bearer ${registratorToken}`).send();
    expect(res.statusCode).toBe(200);
  });

  it('Should set the latestcustomertokencount of a category', async () => {
    let res = await request(server).put('/tokencount/categorytokencount/latestcustomercountset/123').set('Authorization', `Bearer ${registratorToken}`).send({
      "category": "T"
    });
    expect(res.statusCode).toBe(200);
  });

});