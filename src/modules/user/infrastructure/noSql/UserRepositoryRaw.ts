import { isNil } from "lodash";
import mongoose from "mongoose";

import Page from "@shared/Page";
import { hashPassword, hashPasswordSync } from "@utils/hashUtils";
import User from "@user/domain/User";
import { Repository } from "@user/infrastructure/Repository";
import { UserDao, USER_DOCUMENT } from "@user/infrastructure/noSql/UserDao";
import {
    fromModelToDao as fromUserModelToDao,
    fromDaoToModel as fromUserDaoToModel,
} from "@user/infrastructure/noSql/userParsers";

class UserRepositoryRaw implements Repository {
    public async insert(user: User): Promise<User> {
        const hashedPassword: string = await hashPassword(user.password);
        const updatedUser = await User.newInstance({ ...user, password: hashedPassword });

        const userToSave: UserDao = fromUserModelToDao(updatedUser);
        await mongoose.connection.db.collection(USER_DOCUMENT).insertOne(userToSave);

        const insertedUser: User = await fromUserDaoToModel(userToSave);
        return insertedUser;
    }

    public async insertBatch(users: Array<User>): Promise<Array<User>> {
        const usersToSavePromises = users.map(async (user) => {
            const hashedPassword: string = hashPasswordSync(user.password);
            const updatedUser = await User.newInstance({ ...user, password: hashedPassword });

            const userDao: UserDao = fromUserModelToDao(updatedUser);

            return userDao;
        });
        const usersToSave: Array<UserDao> = await Promise.all(usersToSavePromises);

        await mongoose.connection.db.collection(USER_DOCUMENT).insertMany(usersToSave);

        const insertedUsersPromises = usersToSave.map(async (userToSave) => fromUserDaoToModel(userToSave));
        const insertedUsers: Array<User> = await Promise.all(insertedUsersPromises);

        return insertedUsers;
    }

    public async updateUserById(userId: string, user: User): Promise<User | null> {
        const userToUpdate: UserDao = fromUserModelToDao(user);

        const { modifiedCount } = await mongoose.connection.db
            .collection(USER_DOCUMENT)
            .replaceOne({ remoteId: userId }, userToUpdate);

        const success = modifiedCount > 0;
        if (!success) {
            return null;
        }

        return user;
    }

    public async deleteUserById(userId: string): Promise<boolean> {
        const { value: deletedProduct } = await mongoose.connection.db
            .collection(USER_DOCUMENT)
            .findOneAndDelete({ remoteId: userId });

        const success = !isNil(deletedProduct);

        return success;
    }

    public async getAllUsers(page: number, itemsPerPage: number): Promise<Page<Array<User>>> {
        const queryResults = await mongoose.connection.db
            .collection(USER_DOCUMENT)
            .find()
            .skip((page - 1) * itemsPerPage)
            .limit(itemsPerPage)
            .toArray();

        const usersPromises = queryResults.map(async (queryResult) => {
            const userDao = queryResult as UserDao;
            const user: User = await fromUserDaoToModel(userDao);

            return user;
        });
        const users: Array<User> = await Promise.all(usersPromises);
        const totalDocuments = users.length;

        return new Page<Array<User>>({
            data: users,
            currentPage: page,
            totalNumberOfDocuments: totalDocuments,
            itemsPerPage,
        });
    }

    public async getUserById(userId: string): Promise<User | null> {
        const queryResult = await mongoose.connection.db.collection(USER_DOCUMENT).findOne({ remoteId: userId });

        if (!queryResult) {
            return null;
        }

        const userDao = queryResult as UserDao;
        const user: User = await fromUserDaoToModel(userDao);

        return user;
    }

    public async getUserByEmail(email: string): Promise<User | null> {
        const queryResult = await mongoose.connection.db.collection(USER_DOCUMENT).findOne({ email });

        if (!queryResult) {
            return null;
        }

        const userDao = queryResult as UserDao;
        const user: User = await fromUserDaoToModel(userDao);

        return user;
    }
}

export default UserRepositoryRaw;
