import UserRoles from './UserRoles';

export interface UserData {
  id: number;
  username: string;
  role: UserRoles;
}

export default class User {
  constructor(private userInfo: UserData) {}

  public getUserInfo(): UserData {
    return this.userInfo;
  }
}
