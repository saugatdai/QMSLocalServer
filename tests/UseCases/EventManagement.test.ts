import * as EventEmitter from 'events';
import EventManagerSingleton from '../../src/UseCases/EventManagementComponent/EventManagerSingleton';
import EventTypes from '../../src/UseCases/EventManagementComponent/EventTypes';

describe('Testing of event management component', () => {
  const eventManager = EventManagerSingleton.getInstance();
  describe('Testing of EventManagerSingleton and EventTypes', () => {
    it('Should handle pre-call event', () => {
      const preCallEventHandler = jest.fn();
      eventManager.on(EventTypes.PRE_CALL_EVENT, preCallEventHandler);
      eventManager.emit(EventTypes.PRE_CALL_EVENT);
      expect(preCallEventHandler.mock.calls.length).toBe(1);
    });

    it('Should handle post-call event', () => {
      const postCallEventHandler = jest.fn();
      eventManager.on(EventTypes.POST_CALL_EVENT, postCallEventHandler);
      eventManager.emit(EventTypes.POST_CALL_EVENT);
      expect(postCallEventHandler.mock.calls.length).toBe(1);
    });

    it('EventManager instance is always singleton', () => {
      const anotherEventManager = EventManagerSingleton.getInstance();
      expect(anotherEventManager).toBe(eventManager);
    });
  });
});
