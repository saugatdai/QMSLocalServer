import * as path from "path";
import * as fs from "fs";
import * as util from "util";

import UserStorageInteractorImplementation from "../../../src/InterfaceAdapters/UserStorageInteractorImplementation";
import { UserStorageAdapter } from "../../../src/InterfaceAdapters/UserStorageInteractorImplementation";
import { UserData } from "../../../src/Entities/UserCore/User";
import User from "../../../src/Entities/UserCore/User";
import UserRoles from "../../../src/Entities/UserCore/UserRoles";

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
  checkUserExistsWithId
} from "./InteractorHelpers";
import Operator from "../../../src/Entities/UserCore/Operator";


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
      "password": "abc"
  },
  {
      "id": 3,
      "username": "Sangitdai",
      "role": "Operator",
      "counter": "3",
      "password": "def"
  },
  {
      "id": 4,
      "username": "mu*isdai",
      "password": "chutis",
      "role": "Operator"
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
  checkUserExistsWithId
}

const firstUserData: UserData = {
  id: 1,
  username: "saugatdai",
  role: UserRoles.ADMIN,
  password: "123",
};

const lastUserData = {
  id: 5,
  username: "holusdai",
  role: "Registrator",
  password: "jkl",
};

describe("Testing of UserStorageInteractorImplementation", () => {
  beforeAll(async () => {
    await writeFile(path.join(__dirname, '/users.json'), usersJSON);
  });
  afterAll(async () => {
    await writeFile(path.join(__dirname, '/users.json'), '');
  });
  describe("Testing of UserStorageAdapter", () => {
    it("Should Create a User", async () => {
      const userData: UserData = {
        id: 6,
        username: "ujjwaldai",
        role: UserRoles.OPERATOR,
        password: "holusmolus",
      };
      const user = new User(userData);

      await createUser(user);
      const newUserGroup = await getAllUserDatas();

      expect(newUserGroup[newUserGroup.length - 1]).toEqual(userData);

      expect(true).toBeTruthy();
    });

    it("Should delete a user", async () => {
      await deleteUser(6);
      const newuserGroup = await getAllUserDatas();

      expect(newuserGroup[newuserGroup.length - 1]).toEqual(lastUserData);
    });
  });

  it("Should get all users", async () => {
    const allUsers = await getUsers();
    expect(allUsers[0].getUserInfo()).toEqual(firstUserData);
    expect(allUsers[allUsers.length - 1].getUserInfo()).toEqual(lastUserData);
  });

  it("Should get a user with id 1", async () => {
    const user = await readUser(1);
    expect(user.getUserInfo()).toEqual(firstUserData);
  });

  it("Should update a user with id 4", async () => {
    const newUserInfo = {
      id: 4,
      username: "mu*isdai",
      password: "chutis",
      role: UserRoles.OPERATOR
    };
    const user = await readUser(4);
    user.userInfo = newUserInfo;

    await updateUser(user);

    const updatedUser = await readUser(4);
    expect(updatedUser.getUserInfo()).toEqual(newUserInfo);
  });

  it("Should detect user exists with a username saugatdai", async () => {
    const checkResult = await checkUserExistsWithUsername("saugatdai");
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

  describe('Testing of UserStorageInteractorImplementation', () => {
    const userStorageInteractorImplementation = new UserStorageInteractorImplementation(userStorageAdapter);

    it('should add a new admin user', async () => {
      const userData: UserData = {
        id: 14,
        username: 'durga',
        password: 'holus',
        role: UserRoles.ADMIN,
      }
      const user = new User(userData);
      await userStorageInteractorImplementation.addUser(user);
      const addedUser = await readUser(14);
      expect(addedUser).toEqual(user);
    });

    it('should add a new operator user ', async () => {
      const userData: UserData = {
        id: 16,
        username: 'durgesh',
        password: 'holus',
        role: UserRoles.OPERATOR,
        counter: '123'
      };

      const operator = new Operator(userData);
      await userStorageInteractorImplementation.addUser(operator);
      const addedOperator = await readUser(16);
      expect(addedOperator).toEqual(operator);
    })
    it('Should throw an exception because username already exists', async () => {
      const userData = {
        id: 20,
        username: 'saugatdai',
        password: 'Nepal',
        role: UserRoles.ADMIN,
      }
      const user = new User(userData);
      await expect(async () => { await userStorageInteractorImplementation.addUser(user) }).rejects.toThrow();
    });

    it('Should throw an execption because user with the id already exists ', async () => {
      const userData = {
        id: 1,
        username: 'shaughatdai',
        password: 'Nepal',
        role: UserRoles.ADMIN,
      }
      const user = new User(userData);
      await expect(async () => { await userStorageInteractorImplementation.addUser(user) }).rejects.toThrow();
    });
  });
});
