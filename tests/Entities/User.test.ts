import UserFactory from '../../src/Entities/UserCore/UserFactory';
import UserRoles from '../../src/Entities/UserCore/UserRoles';
import User from '../../src/Entities/UserCore/User';
import Operator from '../../src/Entities/UserCore/Operator';

describe('Test of Entities', () => {
  describe('Test of User', () => {
    const adminInfo = {
      id: 1,
      username: 'saugatdai',
      role: UserRoles.ADMIN,
    };
    const operatorInfo = {
      id: 1,
      username: 'saugatdai',
      role: UserRoles.OPERATOR,
    };
    const registratorInfo = {
      id: 1,
      username: 'saugatdai',
      role: UserRoles.REGISTRATOR,
    };

    describe('Test for operator', () => {
      const factory = new UserFactory();
      const operator = factory.getUser(operatorInfo);
      it('Should Create an Operator', () => {
        expect(operator).toBeInstanceOf(User);
        expect(operator).toBeInstanceOf(Operator);
      });
      it('Should set and get operator counter', () => {
        if (operator instanceof Operator) {
          operator.setCounter('2');
          expect(operator.getCounter()).toBe('2');
        }
      });
    });

    describe('Test for admin', () => {
      it('Should Create an Admin', () => {
        const factory = new UserFactory();
        const admin = factory.getUser(adminInfo);
        expect(admin).toBeInstanceOf(User);
        expect(admin.getUserInfo().role).toBe(UserRoles.ADMIN);
      });
    });

    describe('Test for Registrator', () => {
      it('Should create a registrator', () => {
        const factory = new UserFactory();
        const registrator = factory.getUser(registratorInfo);
        expect(registrator).toBeInstanceOf(User);
        expect(registrator.getUserInfo().role).toEqual(UserRoles.REGISTRATOR);
      });
    });
  });
});
