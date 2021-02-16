import * as path from "path";
import * as fs from "fs";
import * as util from "util";

import UserStorageInteractorImplementation from "../../../src/InterfaceAdapters/UserStorageInteractorImplementation";
import { UserStorageAdapter } from "../../../src/InterfaceAdapters/UserStorageInteractorImplementation";
import { UserData } from "../../../src/Entities/UserCore/User";
import User from "../../../src/Entities/UserCore/User";
import UserRoles from "../../../src/Entities/UserCore/UserRoles";

const readFile = (filename: string) =>
  util.promisify(fs.readFile)(filename, "utf-8");
const writeFile = (filename: string, data: string) =>
  util.promisify(fs.writeFile)(filename, data, "utf-8");

const testStoragePath = path.join(__dirname, "/users.json");

const getAllUserDatas = async (): Promise<UserData[]> => {
  const userDatasJson = await readFile(testStoragePath);
  const userDatas: UserData[] = JSON.parse(userDatasJson);
  return userDatas;
};

const createUser = async (user: User) => {
  let userDatas = await getAllUserDatas();
  userDatas.push(user.getUserInfo());
  await writeFile(testStoragePath, JSON.stringify(userDatas));
};

const getUsers = async (): Promise<User[]> => {
  let users: User[] = [];
  const allUserDatas = await getAllUserDatas();

  users = allUserDatas.map((userData) => {
    return new User(userData);
  });

  return users;
};

const deleteUser = async (userId: number) => {
  const allUsers = await getAllUserDatas();
  const rawUsers = allUsers.filter((user) => {
    if (user.id !== userId) {
      return user;
    }
  });

  await writeFile(testStoragePath, JSON.stringify(rawUsers));
};

const readUser = async (userId: number): Promise<User> => {
  const allUsers = await getUsers();

  const foundUser = allUsers.find((user) => user.getUserInfo().id === userId);
  return foundUser;
};

const updateUser = async (user: User): Promise<void> => {
  const initialUserDataGroup = await getAllUserDatas();

  const finalUserDataGroup: UserData[] = initialUserDataGroup.map(
    (loopUserData) => {
      if (loopUserData.id === user.getUserInfo().id) {
        loopUserData = user.getUserInfo();
      }

      return loopUserData;
    }
  );

  await writeFile(testStoragePath, JSON.stringify(finalUserDataGroup));
};

export { getAllUserDatas, createUser, getUsers, deleteUser, readUser, updateUser };
