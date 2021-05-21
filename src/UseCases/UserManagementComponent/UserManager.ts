import UserStorageInteractorAdapter from "./UserStorageInteractorAdapter";
import User from "../../Entities/UserCore/User";
import Operator from "../../Entities/UserCore/Operator";

export default class UserManager {
  private _userStorageInteractorAdapter: UserStorageInteractorAdapter;
  constructor(private _user: User) { }

  public set user(user: User) {
    this._user = user;
  }

  public set userStorageInteractorAdapter(
    userStorageInteractorAdapter: UserStorageInteractorAdapter
  ) {
    this._userStorageInteractorAdapter = userStorageInteractorAdapter;
  }
  public async store() {
    await this._userStorageInteractorAdapter.createANewUser(this._user.getUserInfo());
  }

  public async update() {
    await this._userStorageInteractorAdapter.updateUserIfUsernameAndCounterAvailable(this._user);
  }

  public async validateInfo() {
    return this._userStorageInteractorAdapter
      .getUserById(this._user.getUserInfo().id)
      .then((user) => {
        if (!user) {
          throw new Error("User not found");
        }
        const comparisonResult =
          user.getUserInfo().username === this._user.getUserInfo().username &&
          user.getUserInfo().role === this._user.getUserInfo().role &&
          user.getUserInfo().id === this._user.getUserInfo().id;

        if (!comparisonResult) {
          throw new Error("User Unmatched");
        }
      });
  }

  public async delete() {
    await this._userStorageInteractorAdapter.deleteUserById(
      this._user.getUserInfo().id
    );
  }

  public async setCounter() {
    await this._userStorageInteractorAdapter.setCounterForOperator(
      this._user as Operator
    );
  }
}
