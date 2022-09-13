/* eslint-disable @typescript-eslint/naming-convention */
import { RedisClientType } from "redis";

import Page from "@shared/Page";
import User from "@user/domain/User";
import { Repository } from "@user/infrastructure/Repository";
import UserDao, {
    generateUniqueUserKey,
    generateUserEmailKey,
    generateUserKey,
} from "@user/infrastructure/inMemory/UserDao";
import {
    fromDaoToModel as fromUserDaoToModel,
    fromModelToDao as fromModelToUserDao,
} from "@user/infrastructure/inMemory/userParsers";
import { KEY_ROOT } from "@shared/db/inMemory/InMemoryDb";
import { hashPassword } from "@shared/utils/hashUtils";

class UserRepository implements Repository {
    readonly client: RedisClientType;

    constructor(db: RedisClientType) {
        this.client = db;
    }

    public async insert(user: User): Promise<User> {
        const hashedPassword = await hashPassword(user.password);
        const userWithHashedPassword: User = { ...user, password: hashedPassword };

        const userToSave: UserDao = await fromModelToUserDao(userWithHashedPassword);

        await this.client.sAdd(generateUniqueUserKey(), userToSave.email);
        await this.client.json.set(generateUserEmailKey(userToSave.email), KEY_ROOT, userToSave.id);
        await this.client.json.set(generateUserKey(userToSave.id), KEY_ROOT, userToSave as any);

        const newUser: User = await fromUserDaoToModel(userToSave);

        return newUser;
    }

    public async insertBatch(users: Array<User>): Promise<Array<User>> {
        const usersPromises = users.map(async (user) => this.insert(user));
        const insertedUsers = await Promise.all(usersPromises);

        return insertedUsers;
    }

    public async updateUserById(userId: string, user: User): Promise<User | null> {
        const userToUpdate = await this.getUserById(userId);

        if (!userToUpdate) {
            return null;
        }

        if (user.email !== userToUpdate.email) {
            await this.client.sRem(generateUniqueUserKey(), userToUpdate.email);
            await this.client.sAdd(generateUniqueUserKey(), user.email);
        }

        if (userId !== userToUpdate.id) {
            await this.client.json.del(generateUserEmailKey(userToUpdate.email), KEY_ROOT);
            await this.client.json.set(generateUserEmailKey(user.email), KEY_ROOT, userId);
        }

        const userDao: UserDao = await fromModelToUserDao(user);

        await this.client.json.set(generateUserKey(userId), KEY_ROOT, userDao as any);

        const updatedUser: User = await fromUserDaoToModel(userDao);

        return updatedUser;
    }


    public async deleteUserById(userId: string): Promise<boolean> {
        const user = await this.getUserById(userId);

        if (!user) {
            return false;
        }

        const userDao: UserDao = await fromModelToUserDao(user);

        await this.client.sRem(generateUniqueUserKey(), userDao.email);
        await this.client.json.del(generateUserEmailKey(userDao.email), KEY_ROOT);
        await this.client.json.del(generateUserKey(userId), KEY_ROOT);

        return true;
    }

    public async getAllUsers(page: number, itemsPerPage: number): Promise<Page<Array<User>>> {
        const userEmails: Array<string> = await this.client.sort(generateUniqueUserKey(), {
            BY: "nosort",
            DIRECTION: "ASC",
            LIMIT: {
                offset: page - 1,
                count: itemsPerPage,
            },
        });

        const usersPromises = userEmails?.map(async (userEmail) => this.getUserByEmail(userEmail)) ?? [];
        const users: Array<User> = await Promise.all(usersPromises);

        return new Page<Array<User>>({
            data: users,
            currentPage: page,
            totalNumberOfDocuments: users.length,
            itemsPerPage,
        });
    }

    public async getUserById(userId: string): Promise<User | null> {
        const usersDao: Array<UserDao> = (await this.client.json.get(generateUserKey(userId), {
            path: KEY_ROOT,
        })) as unknown as Array<UserDao>;

        if (!usersDao) {
            return null;
        }

        const user: User = await fromUserDaoToModel(usersDao[0]);

        return user;
    }

    public async getUserByEmail(email: string): Promise<User | null> {
        const userIds: Array<string> = (await this.client.json.get(generateUserEmailKey(email), {
            path: KEY_ROOT,
        })) as unknown as Array<string>;

        if (!userIds) {
            return null;
        }

        const user = await this.getUserById(userIds[0]);

        return user;
    }
}

export default UserRepository;
