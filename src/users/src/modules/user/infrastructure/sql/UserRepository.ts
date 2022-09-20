import { omit } from "lodash";

import Page from "@shared/Page";
import User from "@user/domain/User";
import { Repository } from "@user/infrastructure/Repository";
import UserDao, { UserFullAttributes, USER_PASSWORD } from "@user/infrastructure/sql/UserDao";
import {
    fromModelToDao as fromUserModelToDao,
    fromDaoToModel as fromUserDaoToModel,
} from "@user/infrastructure/sql/userParsers";

class UserRepository implements Repository {
    public async insert(user: User): Promise<User> {
        const userToInsert: UserFullAttributes = await fromUserModelToDao(user);

        const newUser: UserDao = await UserDao.create(userToInsert, {
            include: [],
        });

        const newUserModel: User = await fromUserDaoToModel(newUser);
        return newUserModel;
    }

    public async insertBatch(users: Array<User>): Promise<Array<User>> {
        const usersToSavePromises = users.map(fromUserModelToDao);
        const usersToSave: Array<UserFullAttributes> = await Promise.all(usersToSavePromises);

        const newUsers = await UserDao.bulkCreate(usersToSave, {
            include: [],
        });

        const newUserModelsPromises = newUsers.map(fromUserDaoToModel);
        const newUserModels: Array<User> = await Promise.all(newUserModelsPromises);

        return newUserModels;
    }

    public async updateUserById(userId: string, user: User): Promise<User | null> {
        const userToUpdate: UserDao = await UserDao.findByPk(userId);

        if (!userToUpdate) {
            return null;
        }

        const userToSave: User = await fromUserModelToDao(user);
        const userWithoutPassword = omit(userToSave, USER_PASSWORD);
        const updatedUser: UserDao = await userToUpdate.update(userWithoutPassword);

        const updateUserModel: User = await fromUserDaoToModel(updatedUser);
        return updateUserModel;
    }

    public async deleteUserById(userId: string): Promise<boolean> {
        const userToDelete: UserDao = await UserDao.findByPk(userId);

        if (!userToDelete) {
            return false;
        }

        await userToDelete.destroy();

        return true;
    }

    public async getAllUsers(page: number, itemsPerPage: number): Promise<Page<Array<User>>> {
        const allUsersWithMetadata = await UserDao.findAndCountAll({
            limit: itemsPerPage,
            offset: (page - 1) * itemsPerPage,
        });

        const userModelsPromises = allUsersWithMetadata.rows.map(fromUserDaoToModel);
        const userModels: Array<User> = await Promise.all(userModelsPromises);
        const totalDocuments: number = allUsersWithMetadata.count;

        return new Page<Array<User>>({
            data: userModels,
            currentPage: page,
            totalNumberOfDocuments: totalDocuments,
            itemsPerPage,
        });
    }

    public async getUserById(userId: string): Promise<User | null> {
        const user: UserDao = await UserDao.findByPk(userId);

        if (!user) {
            return null;
        }

        const userModel: User = await fromUserDaoToModel(user);
        return userModel;
    }

    public async getUserByEmail(email: string): Promise<User | null> {
        const user: UserDao = await UserDao.findOne({ where: { email } });

        if (!user) {
            return null;
        }

        const userModel: User = await fromUserDaoToModel(user);
        return userModel;
    }
}

export default UserRepository;
