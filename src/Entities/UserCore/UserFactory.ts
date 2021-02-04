import UserRoles from './UserRoles';
import Operator from './Operator';
import User, { UserData } from './User';

export default class UserFactory {
  private user: User;

  public getUser(userInfo: UserData) {
    if (userInfo.role === UserRoles.OPERATOR) {
      this.user = new Operator(userInfo);
    } else {
      this.user = new User(userInfo);
    }
    return this.user;
  }
}
