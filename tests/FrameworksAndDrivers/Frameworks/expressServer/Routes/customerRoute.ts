import request from 'supertest';
import server from '../../../../../src/FrameworksAndDrivers/Frameworks/expressServer/server';
import TokenCategoryCountStorageImplementation from '../../../../../src/FrameworksAndDrivers/Drivers/TokenCategoryCountStorageImplementation';
import TokenCategoryCountStorateInteractorImplementation from '../../../../../src/InterfaceAdapters/TokenCategoryCountStorageInteractorImplementation';


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

export default () => describe('Testing of Customer Route', () => {
  beforeAll(async () => {
    await setTokens();
  })

  it('Should get the empty customer base', async () => {
    const res = await request(server).get('/customer').set('Authorization', `Bearer ${registratorToken}`).send();
    expect(res.statusCode).toBe(500);
    expect(res.body).toHaveProperty('error');
  });

  it('Should create a new customer', async () => {
    const res = await request(server).post('/customer').set('Authorization', `Bearer ${registratorToken}`).send({
      "customerName": "Saugat Sigdel",
      "remarks": "Hello he is a good man.. service him soon. Thank You!!"
    });
    expect(res.statusCode).toBe(201);
  });

  it('Should create a new customer with token category', async () => {
    const tokenCategoryCountStorageInteractorImplementation = new TokenCategoryCountStorateInteractorImplementation(TokenCategoryCountStorageImplementation);
    await tokenCategoryCountStorageInteractorImplementation.registerANewCategory("X");
    const res = await request(server).post('/customer').set('Authorization', `Bearer ${registratorToken}`).send({
      "customerName": "Holus Mondus",
      "tokenCategory": "X",
      "remarks": "Holus mondus cholus"
    });
    expect(res.statusCode).toBe(201);
  });

  it('Should get all customers', async () => {
    const res = await request(server).get('/customer').set('Authorization', `Bearer ${registratorToken}`).send();
    expect(res.statusCode).toBe(200);
  });

  it('Should get customer by id', async () => {
    const res = await request(server).get('/customer/1').set('Authorization', `Bearer ${registratorToken}`).send();
    expect(res.statusCode).toBe(200);
  });

  it('Should update a customer by id', async () => {
    const res = await request(server).patch('/customer/1').set('Authorization', `Bearer ${registratorToken}`).send({
      "customerName": "Holumulu Golu",
      "remarks": "haahahh"
    });
    expect(res.statusCode).toBe(200);
  });

  it('Should delete a customer by ID ', async () => {
    let res = await request(server).delete('/customer/1').set('Authorization', `Bearer ${registratorToken}`).send();
    expect(res.statusCode).toBe(200);
  });

  it('Should reset the customer base', async () => {
    let res = await request(server).delete('/customer/delete/allcustomers').set('Authorization', `Bearer ${registratorToken}`).send();
    expect(res.statusCode).toBe(200);

    res = await request(server).get('/customer').set('Authorization', `Bearer ${registratorToken}`).send();
    expect(res.statusCode).toBe(500);
  });

});