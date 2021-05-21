import EventTypes from '../../src/UseCases/EventManagementComponent/EventTypes';
import EventHandler from '../../src/UseCases/PluginManagementComponent/PluginModule/EventHandler';
import TokenCallingFacadeSingleton from '../../src/UseCases/TokenCallingComponent/TokenCallingFacadeSingleton';

class PreCallEventHandler implements EventHandler {
  eventType = EventTypes.PRE_CALL_EVENT;

  public handleEvent() {
    const currentToken = TokenCallingFacadeSingleton.getInstance().currentlyProcessingNumber;
    console.log(`Plugin4 PreCallEventHandler for ${currentToken}`);
  }
}

class PostCallEventHandler implements EventHandler {
  eventType = EventTypes.POST_CALL_EVENT;

  public handleEvent() {
    const currentToken = TokenCallingFacadeSingleton.getInstance().currentlyProcessingNumber;
    console.log(`Plugin 4 PostCallEventHandler for ${currentToken}`);
  }
}

const preCallEventHandler = new PreCallEventHandler();
const postCallEventHandler = new PostCallEventHandler();

export { preCallEventHandler, postCallEventHandler };