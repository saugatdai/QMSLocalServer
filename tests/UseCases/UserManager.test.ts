import User from '../../src/Entities/UserCore/User';
import UserManager from '../../src/UseCases/UserManagementComponent/UserManager';
import UserRoles from '../../src/Entities/UserCore/UserRoles';
import UserStorageInteractorAdapter from '../../src/UseCases/UserManagementComponent/UserStorageInteractorAdapter';

describe('Testing of UserManagementComponent', () => {
    const userData = {
        id: 1,
        username: "Saugat Sigdel",
        role: UserRoles.ADMIN
    }

    const userData2 = {
        id: 2,
        username: "Sangit Sigdel",
        role: UserRoles.OPERATOR
    }

    const user = new User(userData);
    const user2 = new User(userData2);

    const userManager = new UserManager(user);

    const addUserMockFunction = jest.fn();
    const addUserFunction = (user: User) => {
        addUserMockFunction();
    } 

    const getUserByIdFunction = (id: number) => {
        return user;
    }

    const updateUserMockFunction = jest.fn();
    const updateUserFunction = (user: User) => {
        updateUserMockFunction();
    }

    const deleteUserByIdMockFunction = jest.fn();
    const deleteUserByIdFunction = (id: number) => {
        deleteUserByIdMockFunction();
    }

    const getAllUsersFunction = () => {
        return [user];
    }

    const setCounterForOperatorMockFunction = jest.fn();
    const setCounterForOperator = (user: User) => {
        setCounterForOperatorMockFunction();
    } 

    const userStorageInterface: UserStorageInteractorAdapter = {
        addUser: addUserFunction,
        getUserById: getUserByIdFunction,
        updateUser: updateUserFunction,
        deleteUserById: deleteUserByIdFunction,
        getAlLUsers: getAllUsersFunction,
        setCounterForOperator: setCounterForOperator,
    }

    userManager.userStorageInteractorAdapter = userStorageInterface;    

    it('should add user to storage', () => {
        userManager.store();
        expect(addUserMockFunction.mock.calls.length).toBe(1);
    });
    
    it('should update the user', () => {
        userManager.update();
        expect(updateUserMockFunction.mock.calls.length).toBe(1);
    });

    it('should delete the user', () => {
        userManager.delete();
        expect(deleteUserByIdMockFunction.mock.calls.length).toBe(1);
    });

    it('should get all users', () => {
        const obtainedUser = getAllUsersFunction();
        expect(obtainedUser).toEqual([user]);
    });

    it('should be true', () => {
        expect(true).toBeTruthy();
    });

    it('should validate the user successfully', () => {
        expect(userManager.validateInfo()).toBeUndefined();
    });

    it('Should throw user does not exist error', () => {
        userManager.user = user2;
        expect(() => {userManager.validateInfo()}).toThrow('User Unmatched');
    });

    it('Should set counter of user', () => {
        userManager.setCounter(user);
        expect(setCounterForOperatorMockFunction.mock.calls.length).toBe(1);
    });
});