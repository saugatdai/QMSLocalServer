import Operator from '../../Entities/UserCore/Operator';
import User from '../../Entities/UserCore/User';

export default interface UserStorageInteractorAdapter {
    addUserIfIdUsernameCounterAvailable(user: User | Operator): void;
    getUserById(id: number): Promise<User | Operator>;
    updateUserIfUsernameAndCounterAvailable(user: User | Operator): void;
    deleteUserById(id: number): void;
    getAllUsers: () => Promise<User[] | Operator[]>;
    setCounterForOperator: (operator: Operator) => void;
}