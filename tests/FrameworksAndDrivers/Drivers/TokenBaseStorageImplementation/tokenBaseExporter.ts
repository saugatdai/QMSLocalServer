import { TokenBaseObject } from '../../../../src/UseCases/TokenBaseManagementComponent/TokenBaseModule';
import { TokenProcessing } from '../../../../src/UseCases/TokenBaseManagementComponent/TokenBaseModule';
import { TokenStatus } from '../../../../src/UseCases/TokenBaseManagementComponent/TokenBaseModule';
import Token from '../../../../src/Entities/TokenCore/Token';
import Operator from '../../../../src/Entities/UserCore/Operator';
import { UserData } from '../../../../src/Entities/UserCore/User';
import UserRoles from '../../../../src/Entities/UserCore/UserRoles';

// ********************** Define Operators ********************************
const operator1Info: UserData = {
  id: 1,
  password: 'holusmolus',
  role: UserRoles.OPERATOR,
  username: 'holusdai',
}
const operator1 = new Operator(operator1Info);

const operator2Info: UserData = {
  id: 2,
  password: 'cholusPolus',
  role: UserRoles.OPERATOR,
  username: 'cholusdai',
}
const operator2 = new Operator(operator2Info);

const operator3Info: UserData = {
  id: 3,
  password: 'mondus',
  role: UserRoles.OPERATOR,
  username: 'mondusdai',
  counter: '3'
}
const operator3 = new Operator(operator3Info);
// ***************** End Defining Operators *****************************

// ********************** Define Token Processing ***********************
const tokenProcessing1a = new TokenProcessing();
tokenProcessing1a.timeStamp = new Date();
tokenProcessing1a.operator = operator1;
tokenProcessing1a.status = TokenStatus.BYPASS;

const tokenProcessing1b = new TokenProcessing();
tokenProcessing1b.timeStamp = new Date();
tokenProcessing1b.operator = operator2;
tokenProcessing1b.status = TokenStatus.PROCESSED;

const tokenProcessing2a = new TokenProcessing();
tokenProcessing2a.timeStamp = new Date();
tokenProcessing2a.operator = operator2;
tokenProcessing2a.status = TokenStatus.PROCESSED;

const tokenProcessing3a = new TokenProcessing();
tokenProcessing3a.timeStamp = new Date();
tokenProcessing3a.operator = operator3;
tokenProcessing3a.status = TokenStatus.FORWARD;

const tokenProcessing3b = new TokenProcessing();
tokenProcessing3b.timeStamp = new Date();
tokenProcessing3b.operator = operator1;
tokenProcessing3b.status = TokenStatus.BYPASS;

const tokenProcessing3c = new TokenProcessing();
tokenProcessing3c.timeStamp = new Date();
tokenProcessing3c.operator = operator1;
tokenProcessing3c.status = TokenStatus.CALLAGAIN;

// ************ End Defining Token Processing **************************************

// ************** Defining Token Processing Arrays *********************************
const token1Processing = [tokenProcessing1a, tokenProcessing1b];
const token2Processing = [tokenProcessing2a];
const token3Processing = [tokenProcessing3a, tokenProcessing3b, tokenProcessing3c];
// *********** End Defining Token Processing Arrays ********************************

// ************** Create Tokens ****************************************************

const token1: Token = {
  date: new Date(),
  tokenId: 1,
  tokenNumber: 1,
  tokenCategory: 'A'
}

const token2: Token = {
  date: new Date(),
  tokenId: 2,
  tokenNumber: 2,
  tokenCategory: 'A'
}

const token3: Token = {
  date: new Date(),
  tokenId: 3,
  tokenNumber: 3,
  tokenCategory: 'C'
}

token2.date.setDate(12);
// ************** End Create Tokens ************************************************

// ************** Create Token Base Objects ****************************************
const tokenBaseObject1 = new TokenBaseObject(token1);
tokenBaseObject1.addTokenProcessingInfo(tokenProcessing1a);
tokenBaseObject1.addTokenProcessingInfo(tokenProcessing1b);

const tokenBaseObject2 = new TokenBaseObject(token2);
tokenBaseObject2.addTokenProcessingInfo(tokenProcessing2a);

const tokenBaseObject3 = new TokenBaseObject(token3);
tokenBaseObject3.addTokenProcessingInfo(tokenProcessing3a);
tokenBaseObject3.addTokenProcessingInfo(tokenProcessing3b);
tokenBaseObject3.addTokenProcessingInfo(tokenProcessing3c);

// ************** End Createing Token Base Objects *********************************

export { tokenBaseObject1, tokenBaseObject2, tokenBaseObject3 };
