import User from '../../src/Entities/UserCore/User';
import UserManager from '../../src/UseCases/UserManagementComponent/UserManager';
import UserRoles from '../../src/Entities/UserCore/UserRoles';
import UserStorageInteractorAdapter from '../../src/UseCases/UserManagementComponent/UserStorageInteractorAdapter';
import * as util from 'util';

describe('Testing of UserManagementComponent', () => {
  const userData = {
    id: 1,
    username: 'Saugat Sigdel',
    role: UserRoles.ADMIN,
    password: 'abrakadabra',
  };

  const userData2 = {
    id: 2,
    username: 'Sangit Sigdel',
    role: UserRoles.OPERATOR,
    password: 'dabrakaabra',
  };

  const user = new User(userData);
  const user2 = new User(userData2);

  const userManager = new UserManager(user);

  const addUserMockFunction = jest.fn();
  const addUserFunction = (user: User) => {
    addUserMockFunction();
  };

  const getUserByIdFunction = async (id: number) => {
    return user;
  };

  const updateUserMockFunction = jest.fn();
  const updateUserFunction = (user: User) => {
    updateUserMockFunction();
  };

  const deleteUserByIdMockFunction = jest.fn();
  const deleteUserByIdFunction = (id: number) => {
    deleteUserByIdMockFunction();
  };

  const getAllUsersMockFunction = () => {
    return [user];
  };

  const getAllUsersMockFunctionPromise = util.promisify(
    getAllUsersMockFunction
  );

  const getAllUsersFunction = async (): Promise<User[]> => {
    const users = await getAllUsersMockFunction();
    return users;
  };

  const setCounterForOperatorMockFunction = jest.fn();
  const setCounterForOperator = (user: User) => {
    setCounterForOperatorMockFunction();
  };

  const userStorageInterface: UserStorageInteractorAdapter = {
    addUser: addUserFunction,
    getUserById: getUserByIdFunction,
    updateUser: updateUserFunction,
    deleteUserById: deleteUserByIdFunction,
    getAllUsers: getAllUsersFunction,
    setCounterForOperator: setCounterForOperator,
  };

  userManager.userStorageInteractorAdapter = userStorageInterface;

  it('should add user to storage', () => {
    userManager.store();
    expect(addUserMockFunction.mock.calls.length).toBe(1);
  });

  it('should update the user', () => {
    userManager.update();
    expect(updateUserMockFunction.mock.calls.length).toBe(1);
  });

  it('should delete the user', () => {
    userManager.delete();
    expect(deleteUserByIdMockFunction.mock.calls.length).toBe(1);
  });

  it('should get all users', async () => {
    const obtainedUser = await getAllUsersFunction();
    expect(obtainedUser).toEqual([user]);
  });

  it('should be true', () => {
    expect(true).toBeTruthy();
  });

  it('should validate the user successfully', async () => {
    const resultPromise = await userManager.validateInfo();
    expect(resultPromise).toBeUndefined();
  });

  it('Should throw user does not exist error', async () => {
    userManager.user = user2;
    await expect(async () => {
      await userManager.validateInfo();
    }).rejects.toThrow(Error);
  });

  it('Should set counter of user', () => {
    userManager.setCounter();
    expect(setCounterForOperatorMockFunction.mock.calls.length).toBe(1);
  });
});
