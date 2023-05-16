import { UserData } from '../../Entities/UserCore/User';
import User from '../../Entities/UserCore/User';
import Operator from '../../Entities/UserCore/Operator';
import UserRoles from '../../Entities/UserCore/UserRoles';
import UserFactory from '../../Entities/UserCore/UserFactory';
import { Credentials } from '../../InterfaceAdapters/UserStorageInteractorImplementation';
import { UserStorageAdapter } from '../../InterfaceAdapters/UserStorageInteractorImplementation';

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const getAllUserDatas = async (): Promise<UserData[]> => {
  const prismaUserDatas = await prisma.userData.findMany({});

  const allUserDatas: UserData[] = prismaUserDatas.map(prismaUserData => {
    const userData: UserData = {
      id: prismaUserData.id,
      password: prismaUserData.password,
      role: prismaUserData.role as UserRoles,
      username: prismaUserData.username,
      counter: prismaUserData.counter
    }

    return userData;
  });

  return allUserDatas;
};

const createUser = async (user: User) => {
  await prisma.userData.create({
    data: {
      password: user.getUserInfo().password,
      username: user.getUserInfo().username,
      role: user.getUserInfo().role,
      counter: user.getUserInfo().counter
    }
  });
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
  await prisma.userData.delete({
    where: {
      id: userId
    }
  });
};

const readUser = async (userId: number): Promise<User> => {
  const allUsers = await getUsers();

  const foundUser = allUsers.find((user) => user.getUserInfo().id === userId);
  return foundUser;
};

const updateUser = async (user: User): Promise<void> => {
  await prisma.userData.update({
    where: {
      id: user.getUserInfo().id
    },
    data: {
      counter: user.getUserInfo().counter,
      id: user.getUserInfo().id,
      password: user.getUserInfo().password,
      role: user.getUserInfo().role,
      username: user.getUserInfo().username
    }
  });
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
  await prisma.userData.update({
    where: {
      id: operator.getUserInfo().id
    },
    data: {
      counter: operator.getUserInfo().counter
    }
  });
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

const UserStorageImplementation: UserStorageAdapter = {
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

export default UserStorageImplementation;