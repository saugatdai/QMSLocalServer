import User from './User';
import { UserData } from './User';

export default class Operator extends User {

  constructor(user: UserData) {
    super(user);
  }

  public setCounter(counter: string) {
    this.userInfo = { ...this.getUserInfo(), counter }
  }

  public getCounter(): string {
    return this.getUserInfo().counter;
  }
}
