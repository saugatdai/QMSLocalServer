import User from '../../Entities/UserCore/User';

export default interface UserStorageInteractorAdapter {
    addUser(user: User): void;
    getUserById(id: number): User;
    updateUser(user: User): void;
    deleteUserById(id: number): void;
    getAlLUsers(): User[];
    setCounterForOperator(user: User): void;
}