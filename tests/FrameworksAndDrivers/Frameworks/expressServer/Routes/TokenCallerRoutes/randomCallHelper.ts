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

export const callRandomCategoryTokens = async (category: string) => {
  await setTokens();
  let res = await request(server).post('/tokencaller/callrandom').set('Authorization', `Bearer ${operatorToken}`).send({
    "category": `${category}`,
    "actedTokenNumber": 5
  });
  expect(res.body.tokenNumber).toBe(5);
  await setTokens();
  res = await request(server).post('/tokencaller/callrandom').set('Authorization', `Bearer ${operatorToken}`).send({
    "category": `${category}`,
    "actedTokenNumber": 500
  });

  expect(res.body).toHaveProperty('error');
}

export const callRandomNonCategoryTokens = async () => {
  await setTokens();
  let res = await request(server).post('/tokencaller/callrandom').set('Authorization', `Bearer ${operatorToken}`).send({
    "actedTokenNumber": 133
  });
  expect(res.body.tokenNumber).toBe(133);

  res = await request(server).post('/tokencaller/callrandom').set('Authorization', `Bearer ${operatorToken}`).send({
    "actedTokenNumber": 500
  });
  expect(res.body).toHaveProperty('error');
}