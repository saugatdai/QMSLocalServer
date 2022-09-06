import * as path from 'path';
import * as util from 'util';
import * as fs from 'fs';

import { PrismaClient } from '@prisma/client';

import { UserData } from '../src/Entities/UserCore/User';
import User from '../src/Entities/UserCore/User';
import UserRoles from '../src/Entities/UserCore/UserRoles';
import UserFactory from '../src/Entities/UserCore/UserFactory';
import { Credentials } from '../src/InterfaceAdapters/UserStorageInteractorImplementation';
import UserStorageImplementation from '../src/FrameworksAndDrivers/Drivers/UserStorageImplementation';
import Operator from '../src/Entities/UserCore/Operator';

export const readFile = (filename: string) =>
  util.promisify(fs.readFile)(filename, 'utf-8');
export const writeFile = (filename: string, data: string) =>
  util.promisify(fs.writeFile)(filename, data, 'utf-8');

const prisma = new PrismaClient();

const usersJSON = `[
  {
      "id": 1,
      "username": "saugatdai",
      "role": "Administrator",
      "password": "123"
  },
  {
      "id": 2,
      "username": "lochandai",
      "role": "Registrator",
      "password": "abc",
      "counter": "8"
  },
  {
      "id": 3,
      "username": "Sangitdai",
      "role": "Operator",
      "counter": "7",
      "password": "def"
  },
  {
      "id": 4,
      "username": "mu*isdai",
      "password": "chutis",
      "role": "Registrator"
  },
  {
      "id": 5,
      "username": "holusdai",
      "role": "Registrator",
      "password": "jkl"
  }
]`;


const usersToBeInserted : UserData[] = JSON.parse(usersJSON);

let testUser: User | Operator;

const firstUserData: UserData = {
  id: 1,
  username: 'saugatdai',
  role: UserRoles.ADMIN,
  password: '123',
};

const lastUserData = {
  id: 5,
  username: 'holusdai',
  role: 'Registrator',
  password: 'jkl',
};

describe('Testing of UserStroageImplementation', () => {
  beforeAll(async () => {
    await prisma.userData.create({data: {...usersToBeInserted[0]}});
    await prisma.userData.create({data: {...usersToBeInserted[1]}});
    await prisma.userData.create({data: {...usersToBeInserted[2]}});
    await prisma.userData.create({data: {...usersToBeInserted[3]}});
    await prisma.userData.create({data: {...usersToBeInserted[4]}});
  });
  afterAll(async () => {
    await prisma.userData.deleteMany({});
  });

  describe('Testing of UserStorageAdapter', () => {
    it('Should get the next available id', async () => {
      const lastUser = await prisma.userData.findFirst({
        orderBy: {
          id: 'desc'
        }
      });
      const nextAvailableId = await UserStorageImplementation.getNextAvailableId();
      expect(nextAvailableId).toBe(lastUser.id + 1);
    });

    it('Should Create a User', async () => {
      const userData: UserData = {
        id: 6,
        username: 'ujjwaldai',
        role: UserRoles.OPERATOR,
        password: 'holusmolus',
      };
      const user = new UserFactory().getUser(userData);

      await UserStorageImplementation.createUser(user);
      const newUserGroup = await UserStorageImplementation.getAllUserDatas();

      expect(newUserGroup.length).toEqual(6);
    });

    it('Should delete a user', async () => {
      const allUsers = await prisma.userData.findMany({
        orderBy: {
          id: 'desc'
        }
      });
      const lastUser = allUsers[0]

      await UserStorageImplementation.deleteUser(lastUser.id);

      const updatedUsers = await prisma.userData.findMany();

      expect(updatedUsers.length).toBe(allUsers.length - 1);
    });
  });

  it('Should get all users', async () => {
    const allUsers = await UserStorageImplementation.getUsers();
    expect(allUsers.length).toBe(5);
  });

  it('Should get a user with id 1', async () => {
    let user: User | Operator ;

    const lastUser = await prisma.userData.findFirst({
      orderBy: {
        id: 'desc'
      }
    });

    testUser = await UserStorageImplementation.readUser(lastUser.id);

    expect(testUser.getUserInfo().id).toEqual(lastUser.id);
  });

  it('Should update a user with id 4', async () => {
    const newUserInfo: UserData = {
    
      ...testUser.getUserInfo(),
      username: 'Hola dola mola'
    };

    const user = await UserStorageImplementation.readUser(testUser.getUserInfo().id);

    user.userInfo = newUserInfo;

    await UserStorageImplementation.updateUser(user);

    const updatedUser = await UserStorageImplementation.readUser(testUser.getUserInfo().id);
    expect(updatedUser.getUserInfo()).toEqual(newUserInfo);
  });

  it('Should detect user exists with a username saugatdai', async () => {
    const userData: UserData = {
      username: "saugatdai",
      id: 2,
      role: UserRoles.ADMIN,
      password: "holusmolus"
    }
    const user = new UserFactory().getUser(userData);
    const checkResult = await UserStorageImplementation.checkUserExistsWithUsername(user);
    expect(checkResult).toBeTruthy();
  });

  it('Should set a counter for a user', async () => {
    const user = await UserStorageImplementation.readUser(3);
    user.userInfo = { ...user.getUserInfo(), counter: '12' };
    await UserStorageImplementation.setCounter(user);
    const userWithCounterSet = await UserStorageImplementation.readUser(3);
    expect(userWithCounterSet.getUserInfo().counter).toBe('12');
  });

  it('Should detect occupancy of a counter ', async () => {
    const occupancy = await UserStorageImplementation.isCounterOccupied('12');
    expect(occupancy).toBeTruthy();
  });

  it('Should get a user by a specific role', async () => {
    const admins = await UserStorageImplementation.getUsersByRole(UserRoles.ADMIN);
    admins.forEach((user) => {
      expect(user.getUserInfo().role).toBe(UserRoles.ADMIN);
    });

    const operators = await UserStorageImplementation.getUsersByRole(UserRoles.OPERATOR);
    operators.forEach((operator) => {
      expect(operator.getUserInfo().role).toBe(UserRoles.OPERATOR);
    });

    const registrators = await UserStorageImplementation.getUsersByRole(UserRoles.REGISTRATOR);
    registrators.forEach((registrator) => {
      expect(registrator.getUserInfo().role).toBe(UserRoles.REGISTRATOR);
    });
  });

  it('Should get a user by username and password ', async () => {
    const credentials: Credentials = {
      username: "saugatdai",
      password: "123"
    }
    const user = await UserStorageImplementation.getUserByUsernameAndPassword(credentials);
    if (user instanceof User) {
      expect(user.getUserInfo().id).toEqual(firstUserData.id);
    }
  });

  it('Should get falsy value because of unmatching username and password', async () => {
    const credentials: Credentials = {
      username: "saugatdai",
      password: "saugat123"
    }
    const user = await UserStorageImplementation.getUserByUsernameAndPassword(credentials);
    expect(user).toBeFalsy();
  });
});