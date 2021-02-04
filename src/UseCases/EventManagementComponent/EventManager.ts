import Emitter from 'events';

class EventManager extends Emitter {
  private static instance = new EventManager();

  private constructor() {
    super();
  }

  public static getInstance() {
    return this.instance;
  }
}
