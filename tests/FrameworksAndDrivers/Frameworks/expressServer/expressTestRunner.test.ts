import tokenBaseRoute from "./Routes/tokenBaseRoute";
import userRoute from "./Routes/userRoute";
import customerRoute from './Routes/customerRoute';
import tokenCountRoute from './Routes/tokenCountRoute';
import tokenCallerRoute from './Routes/TokenCallerRoutes/tokenCallerRoute';
import pluginsRoute from "./Routes/pluginsRoute";

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
  describe('The token count route test', () => {
    tokenCountRoute();
  });
  describe('The token caller route test', () => {
    tokenCallerRoute();
  });
  describe('The plugin route test', () => {
    pluginsRoute();
  })
});