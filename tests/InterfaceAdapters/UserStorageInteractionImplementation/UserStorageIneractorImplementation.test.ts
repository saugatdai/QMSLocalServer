import * as path from 'path';

import UserStorageInteractorImplementation from '../../../src/InterfaceAdapters/UserStorageInteractorImplementation';
import { UserStorageAdapter } from '../../../src/InterfaceAdapters/UserStorageInteractorImplementation';
import { UserData } from '../../../src/Entities/UserCore/User';
import User from '../../../src/Entities/UserCore/User';
import UserRoles from '../../../src/Entities/UserCore/UserRoles';
import UserFactory from '../../../src/Entities/UserCore/UserFactory';
import { Credentials } from '../../../src/InterfaceAdapters/UserStorageInteractorImplementation';

import {
  getAllUserDatas,
  createUser,
  getUsers,
  deleteUser,
  readUser,
  updateUser,
  checkUserExistsWithUsername,
  setCounter,
  isCounterOccupied,
  writeFile,
  checkUserExistsWithId,
  getUsersByRole,
  getNextAvailableId,
  getUserByUsernameAndPassword
} from './InteractorHelpers';
import Operator from '../../../src/Entities/UserCore/Operator';

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

const userStorageAdapter: UserStorageAdapter = {
  createUser,
  getUsers,
  deleteUser,
  readUser,
  updateUser,
  checkUserExistsWithUsername,
  setCounter,
  isCounterOccupied,
  checkUserExistsWithId,
  getUsersByRole,
  getAllUserDatas,
  getNextAvailableId,
  getUserByUsernameAndPassword
};

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

describe('Testing of UserStorageInteractorImplementation', () => {
  beforeAll(async () => {
    await writeFile(path.join(__dirname, '/users.json'), usersJSON);
  });
  afterAll(async () => {
    await writeFile(path.join(__dirname, '/users.json'), '');
  });

  describe('Testing of UserStorageAdapter', () => {
    it('Should get the next available id', async () => {
      const nextAvailableId = await getNextAvailableId();
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

      await createUser(user);
      const newUserGroup = await getAllUserDatas();

      expect(newUserGroup[newUserGroup.length - 1]).toEqual(userData);

      expect(true).toBeTruthy();
    });

    it('Should delete a user', async () => {
      await deleteUser(6);
      const newuserGroup = await getAllUserDatas();

      expect(newuserGroup[newuserGroup.length - 1]).toEqual(lastUserData);
    });
  });

  it('Should get all users', async () => {
    const allUsers = await getUsers();
    expect(allUsers[0].getUserInfo()).toEqual(firstUserData);
    expect(allUsers[allUsers.length - 1].getUserInfo()).toEqual(lastUserData);
  });

  it('Should get a user with id 1', async () => {
    const user = await readUser(1);
    expect(user.getUserInfo()).toEqual(firstUserData);
  });

  it('Should update a user with id 4', async () => {
    const newUserInfo = {
      id: 4,
      username: 'mu*isdai',
      password: 'chutis',
      role: UserRoles.OPERATOR,
    };
    const user = await readUser(4);
    user.userInfo = newUserInfo;

    await updateUser(user);

    const updatedUser = await readUser(4);
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
    const checkResult = await checkUserExistsWithUsername(user);
    expect(checkResult).toBeTruthy();
  });

  it('Should set a counter for a user', async () => {
    const user = await readUser(3);
    user.userInfo = { ...user.getUserInfo(), counter: '12' };
    await setCounter(user);
    const userWithCounterSet = await readUser(3);
    expect(userWithCounterSet.getUserInfo().counter).toBe('12');
  });

  it('Should detect occupancy of a counter ', async () => {
    const occupancy = await isCounterOccupied('12');
    expect(occupancy).toBeTruthy();
  });

  it('Should get a user by a specific role', async () => {
    const admins = await getUsersByRole(UserRoles.ADMIN);
    admins.forEach((user) => {
      expect(user.getUserInfo().role).toBe(UserRoles.ADMIN);
    });

    const operators = await getUsersByRole(UserRoles.OPERATOR);
    operators.forEach((operator) => {
      expect(operator.getUserInfo().role).toBe(UserRoles.OPERATOR);
    });

    const registrators = await getUsersByRole(UserRoles.REGISTRATOR);
    registrators.forEach((registrator) => {
      expect(registrator.getUserInfo().role).toBe(UserRoles.REGISTRATOR);
    });
  });

  it('Should get a user by username and password ', async () => {
    const credentials: Credentials = {
      username: "saugatdai",
      password: "123"
    }
    const user = await getUserByUsernameAndPassword(credentials);
    if (user instanceof User) {
      expect(user.getUserInfo()).toEqual(firstUserData);
    }
  });

  it('Should get falsy value because of unmatching username and password', async () => {
    const credentials: Credentials = {
      username: "saugatdai",
      password: "saugat123"
    }
    const user = await getUserByUsernameAndPassword(credentials);
    expect(user).toBeFalsy();
  });

  describe('Testing of UserStorageInteractorImplementation', () => {
    const userStorageInteractorImplementation = new UserStorageInteractorImplementation(
      userStorageAdapter
    );

    it('should add a new admin user', async () => {
      const userData: UserData = {
        id: 14,
        username: 'durga',
        password: 'holus',
        role: UserRoles.ADMIN,
      };
      const user = new UserFactory().getUser(userData);
      await userStorageInteractorImplementation.addUserIfIdUsernameCounterAvailable(user);
      const addedUser = await readUser(14);
      expect(addedUser).toEqual(user);
    });

    it('should add a new operator user ', async () => {
      const userData: UserData = {
        id: 16,
        username: 'durgesh',
        password: 'holus',
        role: UserRoles.OPERATOR,
        counter: '123',
      };

      const operator = new Operator(userData);
      await userStorageInteractorImplementation.addUserIfIdUsernameCounterAvailable(operator);
      const addedOperator = await readUser(16);
      expect(addedOperator).toEqual(operator);
    });

    it('Should throw an exception while creating operator indication the occupation of counter', async () => {
      const userData: UserData = {
        id: 17,
        username: 'durgesha',
        password: 'holus',
        role: UserRoles.OPERATOR,
        counter: "8",
      };


      const operator = new Operator(userData);
      await expect(async () => await userStorageInteractorImplementation.addUserIfIdUsernameCounterAvailable(operator)).rejects.toThrow();
    });

    it('Should throw an exception because username already exists', async () => {
      const userData = {
        id: 20,
        username: 'saugatdai',
        password: 'Nepal',
        role: UserRoles.ADMIN,
      };
      const user = new UserFactory().getUser(userData);
      await expect(async () => {
        await userStorageInteractorImplementation.addUserIfIdUsernameCounterAvailable(user);
      }).rejects.toThrow();
    });

    it('Should throw an execption because user with the id already exists ', async () => {
      const userData = {
        id: 1,
        username: 'shaughatdai',
        password: 'Nepal',
        role: UserRoles.ADMIN,
      };
      const user = new UserFactory().getUser(userData);
      await expect(async () => {
        await userStorageInteractorImplementation.addUserIfIdUsernameCounterAvailable(user);
      }).rejects.toThrow();
    });

    it('Should get a user with a specific id', async () => {
      const expectedUserInfo = {
        id: 1,
        username: 'saugatdai',
        role: 'Administrator',
        password: '123',
      };

      const user = await userStorageInteractorImplementation.getUserById(1);
      expect(user.getUserInfo()).toEqual(expectedUserInfo);
    });

    it('should update a user', async () => {
      const user = await userStorageInteractorImplementation.getUserById(1);

      const updatedUserData: UserData = {
        id: user.getUserInfo().id,
        username: 'saugatdai',
        password: 'nothing21',
        role: UserRoles.ADMIN,
        counter: null,
      };

      user.userInfo = updatedUserData;
      await userStorageInteractorImplementation.updateUserIfUsernameAndCounterAvailable(user);
      const updatedUser = await userStorageInteractorImplementation.getUserById(1);
      expect(updatedUser.getUserInfo()).toEqual(updatedUserData);
    });

    it('Should throw an exception saying the user with username already exists while updating a user', async () => {
      const user = await userStorageInteractorImplementation.getUserById(1);

      const updatedUserData: UserData = {
        id: user.getUserInfo().id,
        username: 'durga',
        password: 'nothing21',
        role: UserRoles.ADMIN,
        counter: null,
      };
      user.userInfo = updatedUserData;
      await expect(async () => await userStorageInteractorImplementation.updateUserIfUsernameAndCounterAvailable(user)).rejects.toThrow();
    });

    it('Should throw an exception saying a counter is already occupied while updating a user', async () => {
      const user = await userStorageInteractorImplementation.getUserById(1);

      const updatedUserData: UserData = {
        id: user.getUserInfo().id,
        username: 'prakash',
        password: 'nothing21',
        role: UserRoles.ADMIN,
        counter: '8',
      };
      user.userInfo = updatedUserData;
      await expect(async () => await userStorageInteractorImplementation.updateUserIfUsernameAndCounterAvailable(user)).rejects.toThrow();
    });

    it('Should delete a user from storage', async () => {
      await userStorageInteractorImplementation.deleteUserById(1);
      const user = await userStorageInteractorImplementation.getUserById(1);
      expect(user).toBeUndefined();
    });

    it('Should get all users', async () => {
      const allUsers = await userStorageInteractorImplementation.getAllUsers();
      expect(allUsers.length).toBe(6);
    });

    it('Should set counter for an operator', async () => {
      const user = await userStorageInteractorImplementation.getUserById(14) as Operator;
      user.userInfo = { ...user.getUserInfo(), counter: '1' }
      await userStorageInteractorImplementation.setCounterForOperator(user);
      const updatedUser = await userStorageInteractorImplementation.getUserById(14);
      expect(updatedUser.getUserInfo().counter).toBe(user.getUserInfo().counter);
    });

    it('Should throw an exception saying the counter is occupied', async () => {
      const user = await userStorageInteractorImplementation.getUserById(14) as Operator;
      user.userInfo = { ...user.getUserInfo(), counter: '12' }
      await expect(async () => await userStorageInteractorImplementation.setCounterForOperator(user)).rejects.toThrow();
    });

    it('Should get users by different roles', async () => {
      const adminUsers = await userStorageInteractorImplementation.getUsersByRole(UserRoles.ADMIN);
      expect(adminUsers.length).toBe(1);
      const operatorUsers = await userStorageInteractorImplementation.getUsersByRole(UserRoles.OPERATOR);
      expect(operatorUsers.length).toBe(3);
      const registratorUsrs = await userStorageInteractorImplementation.getUsersByRole(UserRoles.REGISTRATOR);
      expect(registratorUsrs.length).toBe(2);
    });

    it('Should careate a new user with a vaild userId', async () => {
      const newUserData: UserData = {
        role: UserRoles.OPERATOR,
        username: "holusmolus",
        password: "holusmolus",
        id: null
      }

      await userStorageInteractorImplementation.createANewUser(newUserData);
      const allUsers = await getUsers();
      expect(allUsers[allUsers.length - 1].getUserInfo().id).toBe(17);
    });

    it('Should login and return user', async () => {
      const credentials: Credentials = {
        username: "holusmolus",
        password: "holusmolus"
      }
      const user = await userStorageInteractorImplementation.loginAndGetUser(credentials);
      if (user instanceof User) {
        expect(user.getUserInfo().username).toEqual(credentials.username);
      }
    });

    it('Should throw an error saying invalid login info: ', async () => {
      const credentials: Credentials = {
        username: "holusmolus",
        password: "holusolus"
      }
      await expect(async () => { await userStorageInteractorImplementation.loginAndGetUser(credentials) }).rejects.toThrow();
    });

  });

});
