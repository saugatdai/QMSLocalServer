import * as path from 'path';
import * as util from 'util';
import * as fs from 'fs';


import { UserData } from '../../src/Entities/UserCore/User';
import User from '../../src/Entities/UserCore/User';
import UserRoles from '../../src/Entities/UserCore/UserRoles';
import UserFactory from '../../src/Entities/UserCore/UserFactory';
import { Credentials } from '../../src/InterfaceAdapters/UserStorageInteractorImplementation';
import UserStorageImplementation from '../../src/FrameworksAndDrivers/Drivers/UserStorageImplementation';

export const readFile = (filename: string) =>
  util.promisify(fs.readFile)(filename, 'utf-8');
export const writeFile = (filename: string, data: string) =>
  util.promisify(fs.writeFile)(filename, data, 'utf-8');

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
    await writeFile(path.join(__dirname, '../../Data/users.json'), usersJSON);
  });
  afterAll(async () => {
    await writeFile(path.join(__dirname, '../../Data/users.json'), '');
  });

  describe('Testing of UserStorageAdapter', () => {
    it('Should get the next available id', async () => {
      const nextAvailableId = await UserStorageImplementation.getNextAvailableId();
      expect(nextAvailableId).toBe(6);
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

      expect(newUserGroup[newUserGroup.length - 1]).toEqual(userData);

      expect(true).toBeTruthy();
    });

    it('Should delete a user', async () => {
      await UserStorageImplementation.deleteUser(6);
      const newuserGroup = await UserStorageImplementation.getAllUserDatas();

      expect(newuserGroup[newuserGroup.length - 1]).toEqual(lastUserData);
    });
  });

  it('Should get all users', async () => {
    const allUsers = await UserStorageImplementation.getUsers();
    expect(allUsers[0].getUserInfo()).toEqual(firstUserData);
    expect(allUsers[allUsers.length - 1].getUserInfo()).toEqual(lastUserData);
  });

  it('Should get a user with id 1', async () => {
    const user = await UserStorageImplementation.readUser(1);
    expect(user.getUserInfo()).toEqual(firstUserData);
  });

  it('Should update a user with id 4', async () => {
    const newUserInfo = {
      id: 4,
      username: 'mu*isdai',
      password: 'chutis',
      role: UserRoles.OPERATOR,
    };
    const user = await UserStorageImplementation.readUser(4);
    user.userInfo = newUserInfo;

    await UserStorageImplementation.updateUser(user);

    const updatedUser = await UserStorageImplementation.readUser(4);
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
      expect(user.getUserInfo()).toEqual(firstUserData);
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
