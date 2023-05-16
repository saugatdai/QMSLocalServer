import EventEmitter from 'events';


export default class EventManagerSingleton extends EventEmitter {
  private static instance = new EventManagerSingleton();

  private constructor() {
    super();
  }

  public static getInstance() {
    return this.instance;
  }
}
