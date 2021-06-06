import tokenBaseRoute from "./Routes/tokenBaseRoute";
import userRoute from "./Routes/userRoute";
import customerRoute from './Routes/customerRoute';

describe('Testing of express Routes', () => {
  describe('The user route test', () => {
    userRoute();
  })
  describe('The tokenbase route test', () => {
    tokenBaseRoute();
  });
  describe('The customer route test', () => {
    customerRoute();
  });

});