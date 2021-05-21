import * as Emitter from 'events';

export default class EventManagerSingleton extends Emitter {
  private static instance = new EventManagerSingleton();

  private constructor() {
    super();
  }

  public static getInstance() {
    return this.instance;
  }
}
