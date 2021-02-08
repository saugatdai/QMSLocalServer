import UserRoles from './UserRoles';

export interface UserData {
  id: number;
  username: string;
  role: UserRoles;
}

export default class User {
  constructor(private _userInfo: UserData) {}

  public getUserInfo(): UserData {
    return this._userInfo;
  }

  public set userInfo(userInfo: UserData){
    this._userInfo = userInfo;
  }
}
