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
  updateUser
} from "./InteractorHelpers";

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

  it("Should updata a user with id 4", async () => {
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
});
