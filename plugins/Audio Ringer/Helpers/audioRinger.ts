import TokenCallingState from "../../../src/UseCases/TokenCallingComponent/TokenCallingState";
import TokenCallingStateManagerSingleton from "../../../src/UseCases/TokenCallingComponent/TokenCallingStateManagerSingleton";
import { constants } from "./constants";

export const audioRinger = (tokenCallingState: TokenCallingState) => {
  if (tokenCallingState.endOfQueue) {
    return;
  } else {
    const operator = tokenCallingState.operator.getUserInfo().username;
    const coutner = tokenCallingState.operator.getCounter();
    const token = tokenCallingState.nextToken;

    TokenCallingStateManagerSingleton.getInstance()
      .addStateLockerForOperatorCallingState(operator, constants.LOCKER_NAME);
    console.log(`Token: ${token}, Counter: ${coutner}`)
  }
};