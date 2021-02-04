import User from './User';
import { UserData } from './User';

export default class Operator extends User {
  private counter: string;

  constructor(user: UserData) {
    super(user);
  }

  public setCounter(counter: string) {
    this.counter = counter;
  }

  public getCounter(): string {
    return this.counter;
  }
}
