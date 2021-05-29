import User, { UserData } from '../Entities/UserCore/User';
import UserStorageInteractorAdapter from '../UseCases/UserManagementComponent/UserStorageInteractorAdapter';
import Operator from '../Entities/UserCore/Operator';
import UserRoles from '../Entities/UserCore/UserRoles';
import UserFactory from '../Entities/UserCore/UserFactory';

export interface UserStorageAdapter {
  createUser: (user: User) => Promise<void>;
  readUser: (userId: number) => Promise<User | Operator>;
  updateUser: (user: User) => Promise<void>;
  deleteUser: (userId: number) => void;
  getUsers: () => Promise<User[] | Operator[]>;
  checkUserExistsWithUsername: (user: User | Operator) => Promise<boolean>;
  setCounter: (opearator: Operator | User) => Promise<void>;
  isCounterOccupied: (counterNumber: string) => Promise<boolean>;
  checkUserExistsWithId: (userId: number) => Promise<boolean>;
  getUsersByRole: (role: UserRoles) => Promise<User[] | Operator[]>;
  getAllUserDatas: () => Promise<UserData[]>;
  getNextAvailableId: () => Promise<number>;
  getUserByUsernameAndPassword: (credentials: Credentials) => Promise<User | false>;
}

export interface Credentials {
  username: string;
  password: string;
}

export default class UserStorageInteractorImplementation
  implements UserStorageInteractorAdapter {
  constructor(private userStorage: UserStorageAdapter) { }

  public async addUserIfIdUsernameCounterAvailable(user: User | Operator) {
    if (await this.isUsernameAndIdAvailable(user)) {
      throw new Error(
        `User with username : ${user.getUserInfo().username} already exists
        or User with id: ${user.getUserInfo().id} already exists`
      );
    }
    const counterOccupancy = await this.userStorage.isCounterOccupied(user.getUserInfo().counter);
    if (counterOccupancy) {
      throw new Error(`Counter : ${user.getUserInfo().counter} is already occupied`);
    }
    await this.userStorage.createUser(user);
  }

  private async isUsernameAndIdAvailable(user: User) {
    return (await this.userStorage.checkUserExistsWithUsername(user))
      || (await this.userStorage.checkUserExistsWithId(user.getUserInfo().id));
  }

  public async getUserById(userId: number) {
    const user = await this.userStorage.readUser(userId);
    return user;
  }

  public async updateUserIfUsernameAndCounterAvailable(user: User | Operator) {
    if (await this.userStorage.checkUserExistsWithUsername(user)) {
      throw new Error(
        `User with the given username : ${user.getUserInfo().username
        } already exists`
      );
    }
    if (await this.userStorage.isCounterOccupied(user.getUserInfo().counter)) {
      throw new Error(`Counter : ${user.getUserInfo().counter} is occupied`);
    }
    await this.userStorage.updateUser(user);
  }

  public async deleteUserById(userId: number) {
    await this.userStorage.deleteUser(userId);
  }

  public async getAllUsers() {
    const users = await this.userStorage.getUsers();
    return users;
  }

  public async setCounterForOperator(operator: Operator) {
    if (await this.userStorage.isCounterOccupied(operator.getUserInfo().counter)) {
      throw new Error(
        `The counter : ${operator.getUserInfo().counter} is already occupied`
      );
    }
    await this.userStorage.setCounter(operator);
  }

  public async getUsersByRole(role: UserRoles) {
    const users = await this.userStorage.getUsersByRole(role);
    return users;
  }

  public async createANewUser(userData: UserData) {
    const nextAvailableId = await this.userStorage.getNextAvailableId();
    userData.id = nextAvailableId;
    const user = new UserFactory().getUser(userData);
    await this.addUserIfIdUsernameCounterAvailable(user);
  }

  public async loginAndGetUser(credentials: Credentials) {
    const user = await this.userStorage.getUserByUsernameAndPassword(credentials);
    if (!(user instanceof User)) {
      throw new Error("Login Failed");
    }
    return user;
  }
}
