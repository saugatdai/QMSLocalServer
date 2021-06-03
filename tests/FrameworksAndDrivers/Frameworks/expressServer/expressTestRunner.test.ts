import tokenBaseRoute from "./Routes/tokenBaseRoute";
import userRoute from "./Routes/userRoute";

describe('Testing of express Routes', () => {
  describe('The user route test', () => {
    userRoute();
  })
  describe('The tokenbase route test', () => {
    tokenBaseRoute();
  });
});