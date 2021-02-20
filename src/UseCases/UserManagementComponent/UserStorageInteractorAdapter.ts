import Operator from '../../Entities/UserCore/Operator';
import User from '../../Entities/UserCore/User';
import { UserData } from '../../Entities/UserCore/User';

export default interface UserStorageInteractorAdapter {
    addUserIfIdUsernameCounterAvailable(user: User | Operator): Promise<void>;
    getUserById(id: number): Promise<User | Operator>;
    updateUserIfUsernameAndCounterAvailable(user: User | Operator): Promise<void>;
    deleteUserById(id: number): Promise<void>;
    getAllUsers: () => Promise<User[] | Operator[]>;
    setCounterForOperator: (operator: Operator) => Promise<void>;
    createANewUser: (userData: UserData) => Promise<void>
}