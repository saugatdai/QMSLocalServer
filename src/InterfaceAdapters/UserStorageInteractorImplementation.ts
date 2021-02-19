import User from "../Entities/UserCore/User";
import UserStorageInteractorAdapter from "../UseCases/UserManagementComponent/UserStorageInteractorAdapter";
import Operator from "../Entities/UserCore/Operator";

export interface UserStorageAdapter {
  createUser: (user: User) => Promise<void>;
  readUser: (userId: number) => Promise<User>;
  updateUser: (user: User) => void;
  deleteUser: (userId: number) => void;
  getUsers: () => Promise<User[] | Operator[]>;
  checkUserExistsWithUsername: (userame: string) => Promise<boolean>;
  setCounter: (opearator: Operator) => Promise<void>;
  isCounterOccupied: (counterNumber: string) => Promise<boolean>;
  checkUserExistsWithId: (userId: number) => Promise<boolean>;
}

export default class UserStorageInteractorImplementation
  implements UserStorageInteractorAdapter {
  constructor(private userStorage: UserStorageAdapter) { }

  public async addUser(user: User | Operator) {
    if (
      await this.userStorage.checkUserExistsWithUsername(user.getUserInfo().username) ||
      await this.userStorage.checkUserExistsWithId(user.getUserInfo().id)
    ) {
      throw new Error(
        `User with username : ${user.getUserInfo().username} already exists
        or User with id: ${user.getUserInfo().id} already exists`
      );
    }
    await this.userStorage.createUser(user);
  }

  public async getUserById(userId: number) {
    const user = await this.userStorage.readUser(userId);
    return user;
  }

  public async updateUser(user: User | Operator) {
    if (
      this.userStorage.checkUserExistsWithUsername(user.getUserInfo().username)
    ) {
      throw new Error(
        `User with the given username : ${user.getUserInfo().username
        } already exists`
      );
    }
    this.userStorage.updateUser(user);
  }

  public async deleteUserById(userId: number) {
    this.userStorage.deleteUser(userId);
  }

  public async getAllUsers() {
    const users = await this.userStorage.getUsers();
    return users;
  }

  public async setCounterForOperator(operator: Operator) {
    if (this.userStorage.isCounterOccupied(operator.getCounter())) {
      throw new Error(
        `The counter : ${operator.getCounter()} is already occupied`
      );
    }
    this.userStorage.setCounter(operator);
  }
}
