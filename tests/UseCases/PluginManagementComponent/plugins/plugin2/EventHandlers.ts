import { EventHandler } from './Interfaces';

class Plugin2EventHandlerParent {
  eventType: string;
  constructor(eventType: string) {}

  public getEventType(): string {
    return this.eventType;
  }
}

class Plugin2EventHandler1
  extends Plugin2EventHandlerParent
  implements EventHandler {
  constructor(eventType: string) {
    super(eventType);
  }

  public handleEvent() {
    console.log('Hello from Plugin1EventHandler1');
  }
}

class Plugin2EventHandler2
  extends Plugin2EventHandlerParent
  implements EventHandler {
  constructor(eventType: string) {
    super(eventType);
  }

  public handleEvent() {
    console.log('Hello from plugin1EventHandler2');
  }
}

export const plugin2EventHandler1 = new Plugin2EventHandler1('Plugin2Holus');
export const plugin2EventHandler2 = new Plugin2EventHandler2('Plugin2Mondus');
