import { EventHandler } from './Interfaces';

class Plugin1EventHandlerParent {
  eventType: string;
  constructor(eventType: string) {}

  public getEventType(): string {
    return this.eventType;
  }
}

class Plugin1EventHandler1
  extends Plugin1EventHandlerParent
  implements EventHandler {
  constructor(eventType: string) {
    super(eventType);
  }

  public handleEvent() {
    console.log('Hello from Plugin1EventHandler1');
  }
}

class Plugin1EventHandler2
  extends Plugin1EventHandlerParent
  implements EventHandler {
  constructor(eventType: string) {
    super(eventType);
  }

  public handleEvent() {
    console.log('Hello from plugin1EventHandler2');
  }
}

export const plugin1EventHandler1 = new Plugin1EventHandler1('Holus');
export const plugin1EventHandler2 = new Plugin1EventHandler2('Mondus');
