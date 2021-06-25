import request from 'supertest';
import { tokenForwardListStorageImplementation } from '../../../../../../src/FrameworksAndDrivers/Drivers/TokenForwardListStorageImplementation';
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

export const forwardCateogyrTokens = async (category: string) => {
  await setTokens();
  let res = await request(server).post('/tokencaller/forwardtoken').set('Authorization', `Bearer ${operatorToken}`).send({
    'category': `${category}`,
    'actedTokenNumber': 0,
    'counterToForward': '3'
  });
  runningToken = res.body.tokenNumber;
  expect(runningToken).toBe(1);
  let allTokenForwardedList = await tokenForwardListStorageImplementation.getTokenForwardList();
  expect(allTokenForwardedList[0].tokens.length).toBe(1);

  res = await request(server).post('/tokencaller/forwardtoken').set('Authorization', `Bearer ${operatorToken}`).send({
    'category': `${category}`,
    'actedTokenNumber': runningToken,
    'counterToForward': '3'
  });
  runningToken = res.body.tokenNumber;
  expect(runningToken).toBe(2);
  allTokenForwardedList = await tokenForwardListStorageImplementation.getTokenForwardList();
  expect(allTokenForwardedList[0].tokens.length).toBe(2);

  res = await request(server).post('/tokencaller/forwardtoken').set('Authorization', `Bearer ${operatorToken}`).send({
    'category': `${category}`,
    'actedTokenNumber': runningToken,
    'counterToForward': '3'
  });
  runningToken = res.body.tokenNumber;
  expect(runningToken).toBe(3);
  allTokenForwardedList = await tokenForwardListStorageImplementation.getTokenForwardList();
  expect(allTokenForwardedList[0].tokens.length).toBe(3);

  res = await request(server).post('/tokencaller/forwardtoken').set('Authorization', `Bearer ${operatorToken}`).send({
    'category': `${category}`,
    'actedTokenNumber': runningToken,
    'counterToForward': '3'
  });
  runningToken = res.body.tokenNumber;
  expect(runningToken).toBe(4);
  allTokenForwardedList = await tokenForwardListStorageImplementation.getTokenForwardList();
  expect(allTokenForwardedList[0].tokens.length).toBe(4);

  res = await request(server).post('/tokencaller/forwardtoken').set('Authorization', `Bearer ${operatorToken}`).send({
    'category': `${category}`,
    'actedTokenNumber': runningToken,
    'counterToForward': '3'
  });
  runningToken = res.body.tokenNumber;
  expect(runningToken).toBe(5);
  allTokenForwardedList = await tokenForwardListStorageImplementation.getTokenForwardList();
  expect(allTokenForwardedList[0].tokens.length).toBe(5);

  res = await request(server).post('/tokencaller/forwardtoken').set('Authorization', `Bearer ${operatorToken}`).send({
    'category': `${category}`,
    'actedTokenNumber': runningToken,
    'counterToForward': '3'
  });
  runningToken = res.body.tokenNumber;
  expect(runningToken).toBe(6);
  allTokenForwardedList = await tokenForwardListStorageImplementation.getTokenForwardList();
  expect(allTokenForwardedList[0].tokens.length).toBe(6);

  res = await request(server).post('/tokencaller/forwardtoken').set('Authorization', `Bearer ${operatorToken}`).send({
    'category': `${category}`,
    'actedTokenNumber': runningToken,
    'counterToForward': '3'
  });
  runningToken = res.body.tokenNumber;
  expect(runningToken).toBe(7);
  allTokenForwardedList = await tokenForwardListStorageImplementation.getTokenForwardList();
  expect(allTokenForwardedList[0].tokens.length).toBe(7);

  res = await request(server).post('/tokencaller/forwardtoken').set('Authorization', `Bearer ${operatorToken}`).send({
    'category': `${category}`,
    'actedTokenNumber': runningToken,
    'counterToForward': '3'
  });
  runningToken = res.body.tokenNumber;
  expect(res.body).toHaveProperty('error');
  allTokenForwardedList = await tokenForwardListStorageImplementation.getTokenForwardList();
  expect(allTokenForwardedList[0].tokens.length).toBe(8);
}

export const forwardNonCategoryTokens = async () => {
  await setTokens();

  let res = await request(server).post('/tokencaller/forwardtoken').set('Authorization', `Bearer ${operatorToken}`).send({
    'actedTokenNumber': 0,
    'counterToForward': '3'
  });
  runningToken = res.body.tokenNumber;
  expect(runningToken).toBe(138);
  let allTokenForwardedList = await tokenForwardListStorageImplementation.getTokenForwardList();
  expect(allTokenForwardedList[0].tokens.length).toBe(9);

  res = await request(server).post('/tokencaller/forwardtoken').set('Authorization', `Bearer ${operatorToken}`).send({
    'actedTokenNumber': runningToken,
    'counterToForward': '3'
  });
  runningToken = res.body.tokenNumber;
  expect(runningToken).toBe(139);
  allTokenForwardedList = await tokenForwardListStorageImplementation.getTokenForwardList();
  expect(allTokenForwardedList[0].tokens.length).toBe(10);

  res = await request(server).post('/tokencaller/forwardtoken').set('Authorization', `Bearer ${operatorToken}`).send({
    'actedTokenNumber': runningToken,
    'counterToForward': '3'
  });
  runningToken = res.body.tokenNumber;
  expect(runningToken).toBe(140);
  allTokenForwardedList = await tokenForwardListStorageImplementation.getTokenForwardList();
  expect(allTokenForwardedList[0].tokens.length).toBe(11);

  res = await request(server).post('/tokencaller/forwardtoken').set('Authorization', `Bearer ${operatorToken}`).send({
    'actedTokenNumber': runningToken,
    'counterToForward': '3'
  });
  runningToken = res.body.tokenNumber;
  expect(runningToken).toBe(141);
  allTokenForwardedList = await tokenForwardListStorageImplementation.getTokenForwardList();
  expect(allTokenForwardedList[0].tokens.length).toBe(12);

  res = await request(server).post('/tokencaller/forwardtoken').set('Authorization', `Bearer ${operatorToken}`).send({
    'actedTokenNumber': runningToken,
    'counterToForward': '3'
  });
  runningToken = res.body.tokenNumber;
  expect(runningToken).toBe(142);
  allTokenForwardedList = await tokenForwardListStorageImplementation.getTokenForwardList();
  expect(allTokenForwardedList[0].tokens.length).toBe(13);

  res = await request(server).post('/tokencaller/forwardtoken').set('Authorization', `Bearer ${operatorToken}`).send({
    'actedTokenNumber': runningToken,
    'counterToForward': '3'
  });
  runningToken = res.body.tokenNumber;
  expect(runningToken).toBe(143);
  allTokenForwardedList = await tokenForwardListStorageImplementation.getTokenForwardList();
  expect(allTokenForwardedList[0].tokens.length).toBe(14);

  res = await request(server).post('/tokencaller/forwardtoken').set('Authorization', `Bearer ${operatorToken}`).send({
    'actedTokenNumber': runningToken,
    'counterToForward': '3'
  });
  runningToken = res.body.tokenNumber;
  expect(runningToken).toBe(144);
  allTokenForwardedList = await tokenForwardListStorageImplementation.getTokenForwardList();
  expect(allTokenForwardedList[0].tokens.length).toBe(15);

  res = await request(server).post('/tokencaller/forwardtoken').set('Authorization', `Bearer ${operatorToken}`).send({
    'actedTokenNumber': runningToken,
    'counterToForward': '3'
  });
  expect(res.body).toHaveProperty('error');
  allTokenForwardedList = await tokenForwardListStorageImplementation.getTokenForwardList();
  expect(allTokenForwardedList[0].tokens.length).toBe(16);

}