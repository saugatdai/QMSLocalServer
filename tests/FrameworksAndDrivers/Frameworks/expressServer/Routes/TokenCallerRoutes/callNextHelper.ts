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

let runningToken: number;

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

export const callCategoryTokens = async (category: string) => {
  let res = await request(server).post('/tokencaller/nexttoken').set('Authorization', `Bearer ${operatorToken}`).send({
    "category": `${category}`,
    "actedTokenNumber": 0
  });
  runningToken = res.body.tokenNumber;
  expect(runningToken).toBe(1);

  res = await request(server).post('/tokencaller/nexttoken').set('Authorization', `Bearer ${operatorToken}`).send({
    "category": `${category}`,
    "actedTokenNumber": runningToken
  });
  runningToken = res.body.tokenNumber;
  expect(runningToken).toBe(2);

  res = await request(server).put('/tokencount/categorytokencount/categorycountpreset/5').set('Authorization', `Bearer ${registratorToken}`).send({
    "category": `${category}`
  });

  res = await request(server).post('/tokencaller/nexttoken').set('Authorization', `Bearer ${operatorToken}`).send({
    "category": `${category}`,
    "actedTokenNumber": runningToken
  });
  runningToken = res.body.tokenNumber;
  expect(runningToken).toBe(6);

  res = await request(server).post('/tokencaller/nexttoken').set('Authorization', `Bearer ${operatorToken}`).send({
    "category": `${category}`,
    "actedTokenNumber": runningToken
  });
  runningToken = res.body.tokenNumber;
  expect(runningToken).toBe(7);

  res = await request(server).post('/tokencaller/nexttoken').set('Authorization', `Bearer ${operatorToken}`).send({
    "category": `${category}`,
    "actedTokenNumber": runningToken
  });
  expect(res.body).toHaveProperty('error');
}

export const callNonCategoryTokens = async () => {

  let res = await request(server).post('/tokencaller/nexttoken').set('Authorization', `Bearer ${operatorToken}`).send({
    "category": "",
    "actedTokenNumber": 0
  });
  runningToken = res.body.tokenNumber;
  expect(runningToken).toBe(124);

  res = await request(server).post('/tokencaller/nexttoken').set('Authorization', `Bearer ${operatorToken}`).send({
    "category": "",
    "actedTokenNumber": runningToken
  });
  runningToken = res.body.tokenNumber;
  expect(runningToken).toBe(125);

  res = await request(server).post('/tokencaller/nexttoken').set('Authorization', `Bearer ${operatorToken}`).send({
    "category": "",
    "actedTokenNumber": runningToken
  });
  runningToken = res.body.tokenNumber;
  expect(runningToken).toBe(126);

  res = await request(server).post('/tokencaller/nexttoken').set('Authorization', `Bearer ${operatorToken}`).send({
    "category": "",
    "actedTokenNumber": runningToken
  });
  runningToken = res.body.tokenNumber;
  expect(runningToken).toBe(127);

  res = await request(server).post('/tokencaller/nexttoken').set('Authorization', `Bearer ${operatorToken}`).send({
    "category": "",
    "actedTokenNumber": runningToken
  });
  runningToken = res.body.tokenNumber;
  expect(runningToken).toBe(128);

  res = await request(server).post('/tokencaller/nexttoken').set('Authorization', `Bearer ${operatorToken}`).send({
    "category": "",
    "actedTokenNumber": runningToken
  });
  runningToken = res.body.tokenNumber;
  expect(runningToken).toBe(129);

  res = await request(server).post('/tokencaller/nexttoken').set('Authorization', `Bearer ${operatorToken}`).send({
    "category": "",
    "actedTokenNumber": runningToken
  });
  runningToken = res.body.tokenNumber;
  expect(runningToken).toBe(130);

  res = await request(server).post('/tokencaller/nexttoken').set('Authorization', `Bearer ${operatorToken}`).send({
    "category": "",
    "actedTokenNumber": runningToken
  });

  expect(res.body).toHaveProperty('error');

}

export const byPassCategoryTokens = async (category: string) => {
  let res = await request(server).post('/tokencaller/bypasstoken').set('Authorization', `Bearer ${operatorToken}`).send({
    "category": `${category}`,
    "actedTokenNumber": 0
  });
  runningToken = res.body.tokenNumber;
  expect(runningToken).toBe(1);

  res = await request(server).post('/tokencaller/bypasstoken').set('Authorization', `Bearer ${operatorToken}`).send({
    "category": `${category}`,
    "actedTokenNumber": runningToken
  });
  runningToken = res.body.tokenNumber;
  expect(runningToken).toBe(2);

  res = await request(server).put('/tokencount/categorytokencount/categorycountpreset/5').set('Authorization', `Bearer ${registratorToken}`).send({
    "category": `${category}`
  });

  res = await request(server).post('/tokencaller/bypasstoken').set('Authorization', `Bearer ${operatorToken}`).send({
    "category": `${category}`,
    "actedTokenNumber": runningToken
  });
  runningToken = res.body.tokenNumber;
  expect(runningToken).toBe(6);

  res = await request(server).post('/tokencaller/bypasstoken').set('Authorization', `Bearer ${operatorToken}`).send({
    "category": `${category}`,
    "actedTokenNumber": runningToken
  });
  runningToken = res.body.tokenNumber;
  expect(runningToken).toBe(7);

  res = await request(server).post('/tokencaller/bypasstoken').set('Authorization', `Bearer ${operatorToken}`).send({
    "category": `${category}`,
    "actedTokenNumber": runningToken
  });
  expect(res.body).toHaveProperty('error');

  res = await request(server).get('/tokenbase').set('Authorization', `Bearer ${adminToken}`).send();
  console.log(res.body);
}
