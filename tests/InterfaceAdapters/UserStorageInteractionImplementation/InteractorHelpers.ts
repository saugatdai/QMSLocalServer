import * as path from 'path';
import * as fs from 'fs';
import * as util from 'util';

import { UserData } from '../../../src/Entities/UserCore/User';
import User from '../../../src/Entities/UserCore/User';
import Operator from '../../../src/Entities/UserCore/Operator';
import UserRoles from '../../../src/Entities/UserCore/UserRoles';
import UserFactory from '../../../src/Entities/UserCore/UserFactory';
import { Credentials } from '../../../src/InterfaceAdapters/UserStorageInteractorImplementation';

export const readFile = (filename: string) =>
  util.promisify(fs.readFile)(filename, 'utf-8');
export const writeFile = (filename: string, data: string) =>
  util.promisify(fs.writeFile)(filename, data, 'utf-8');

const testStoragePath = path.join(__dirname, '/users.json');

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
    return new UserFactory().getUser(userData);
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

const checkUserExistsWithUsername = async (user: User | Operator): Promise<boolean> => {
  const userDatas = await getAllUserDatas();
  return userDatas.some(userData => {
    return (
      userData.username === user.getUserInfo().username &&
      userData.id !== user.getUserInfo().id
    );
  });
};

const checkUserExistsWithId = async (userId: number): Promise<boolean> => {
  const users = await getAllUserDatas();
  return users.some((user) => user.id === userId);
};

const setCounter = async (operator: Operator | User) => {
  let allUserDatas: UserData[] = await getAllUserDatas();
  allUserDatas = allUserDatas.map((userData) => {
    if (userData.id === operator.getUserInfo().id) {
      userData.counter = operator.getUserInfo().counter;
    }
    return userData;
  });
  await writeFile(testStoragePath, JSON.stringify(allUserDatas));
};

const isCounterOccupied = async (counter: string): Promise<boolean> => {
  const allUserDatas = await getAllUserDatas();
  return counter && allUserDatas.some((userData) => {
    return userData.counter && userData.counter === counter;
  });
};

const getUsersByRole = async (role: UserRoles) => {
  const allUsers = await getUsers();
  return allUsers.filter((user) => user.getUserInfo().role === role);
};

const getNextAvailableId = async () => {
  let highestIdNumber = 0;

  const allUserDatas = await getAllUserDatas();
  allUserDatas.forEach(userData => {
    if (highestIdNumber < userData.id) {
      highestIdNumber = userData.id;
    }
  });
  return highestIdNumber + 1;
}

const getUserByUsernameAndPassword = async (credentials: Credentials) => {
  const allUserDatas = await getAllUserDatas();
  const userData = allUserDatas.find(userData => userData.username === credentials.username && userData.password === credentials.password);
  if (userData) {
    return new UserFactory().getUser(userData);
  }
  return false;
}

export {
  getAllUserDatas,
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
  getNextAvailableId,
  getUserByUsernameAndPassword
};
