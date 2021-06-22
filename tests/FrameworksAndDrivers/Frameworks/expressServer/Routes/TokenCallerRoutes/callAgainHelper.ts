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

export const callAgainCategoryTokens = async (category: string) => {
  await setTokens();
  let res = await request(server).post('/tokencaller/callagaintoken').set('Authorization', `Bearer ${operatorToken}`).send({
    "category": `${category}`,
    "actedTokenNumber": 4
  });
  expect(res.body.tokenNumber).toBe(4);
  expect(res.body.tokenCategory).toBe(category);

  res = await request(server).post('/tokencaller/callagaintoken').set('Authorization', `Bearer ${operatorToken}`).send({
    "category": `${category}`,
    "actedTokenNumber": 123
  });
  expect(res.body).toHaveProperty('error');
}

export const callAgainNonCategoryTokens = async () => {
  let res = await request(server).post('/tokencaller/callagaintoken').set('Authorization', `Bearer ${operatorToken}`).send({
    "actedTokenNumber": 131
  });

  expect(res.body.tokenNumber).toBe(131);

  res = await request(server).post('/tokencaller/callagaintoken').set('Authorization', `Bearer ${operatorToken}`).send({
    "actedTokenNumber": 500
  });

  expect(res.body).toHaveProperty('error');
}