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

export const callCategoryTokens = async (category: string) => {
  await setTokens();
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
  setTokens();

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
