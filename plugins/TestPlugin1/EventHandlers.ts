import EventTypes from '../../src/UseCases/EventManagementComponent/EventTypes';
import { EventHandler } from './Interfaces';

export const eventHandler1MockFunction = () => {
  // console.log('Event handler 1 of plugin 1')
};
export const eventHandler2MockFunction = () => {
  // console.log('Event handler 2 of plugin 1')
};

abstract class EventHandlerParent {
  eventType: string;
  constructor(eventType: EventTypes) {
    this.eventType = eventType;
  }

  abstract handleEvent(): void;
}

class EventHandler1
  extends EventHandlerParent
  implements EventHandler {
  constructor(eventType: EventTypes) {
    super(eventType);
  }

  public handleEvent() {
    eventHandler1MockFunction();
  }
}

class EventHandler2
  extends EventHandlerParent
  implements EventHandler {
  constructor(eventType: EventTypes) {
    super(eventType);
  }

  public handleEvent() {
    eventHandler2MockFunction();
  }
}

export const eventHandler1 = new EventHandler1(EventTypes.PRE_CALL_EVENT);
export const eventHandler2 = new EventHandler2(EventTypes.POST_CALL_EVENT);
