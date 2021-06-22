import request from 'supertest';
import server from '../../../../../../src/FrameworksAndDrivers/Frameworks/expressServer/server';

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


export const createCustomers = async (category: string) => {
  await setTokens();
  let res = await request(server).post('/tokenbase/createtokencategory').set('Authorization', `Bearer ${adminToken}`).send({
    "category": `${category}`
  });

  res = await request(server).post('/customer').set('Authorization', `Bearer ${registratorToken}`).send({
    "customerName": "Saugat Sigdel",
    "tokenCategory": `${category}`,
    "remarks": "Normal Client"
  });

  res = await request(server).post('/customer').set('Authorization', `Bearer ${registratorToken}`).send({
    "customerName": "XYZ Sigdel",
    "tokenCategory": `${category}`,
    "remarks": "Normal Client"
  });

  res = await request(server).post('/customer').set('Authorization', `Bearer ${registratorToken}`).send({
    "customerName": "Lochan Thapa",
    "tokenCategory": `${category}`,
    "remarks": "Another Normal Client"
  });

  res = await request(server).post('/customer').set('Authorization', `Bearer ${registratorToken}`).send({
    "customerName": "Ummeed Kafle",
    "tokenCategory": `${category}`,
    "remarks": "Normal Client"
  });

  res = await request(server).post('/customer').set('Authorization', `Bearer ${registratorToken}`).send({
    "customerName": "Sangit Sigdel",
    "tokenCategory": `${category}`,
    "remarks": "Normal Client"
  });

  res = await request(server).post('/customer').set('Authorization', `Bearer ${registratorToken}`).send({
    "customerName": "Durga Sharma",
    "tokenCategory": `${category}`,
    "remarks": "Normal Client"
  });

  res = await request(server).post('/customer').set('Authorization', `Bearer ${registratorToken}`).send({
    "customerName": "Dia Sigdel",
    "tokenCategory": `${category}`,
    "remarks": "Normal Client"
  });

  res = await request(server).post('/customer').set('Authorization', `Bearer ${registratorToken}`).send({
    "customerName": "Saugat Sigdel",
    "tokenCategory": "",
    "remarks": "Normal Client"
  });

  res = await request(server).post('/customer').set('Authorization', `Bearer ${registratorToken}`).send({
    "customerName": "Saugat Sigdel",
    "tokenCategory": "",
    "remarks": "Normal Client"
  });

  res = await request(server).post('/customer').set('Authorization', `Bearer ${registratorToken}`).send({
    "customerName": "Lochan Thapa",
    "tokenCategory": "",
    "remarks": "Another Normal Client"
  });

  res = await request(server).post('/customer').set('Authorization', `Bearer ${registratorToken}`).send({
    "customerName": "Ummeed Kafle",
    "tokenCategory": "",
    "remarks": "Normal Client"
  });

  res = await request(server).post('/customer').set('Authorization', `Bearer ${registratorToken}`).send({
    "customerName": "Sangit Sigdel",
    "tokenCategory": "",
    "remarks": "Normal Client"
  });

  res = await request(server).post('/customer').set('Authorization', `Bearer ${registratorToken}`).send({
    "customerName": "Durga Sharma",
    "tokenCategory": "",
    "remarks": "Normal Client"
  });

  res = await request(server).post('/customer').set('Authorization', `Bearer ${registratorToken}`).send({
    "customerName": "Dia Sigdel",
    "tokenCategory": "",
    "remarks": "Normal Client"
  });
}