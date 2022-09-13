import { isEmpty } from "lodash";
import { Sequelize } from "sequelize";
import { v4 as uuidv4 } from "uuid";

import Page from "@shared/Page";
import { wasDeletionSuccessful } from "@utils/sqlUtils";
import { hashPassword } from "@utils/hashUtils";
import User from "@user/domain/User";
import { Repository } from "@user/infrastructure/Repository";
import UserDao, {
    USER_TABLE,
    USER_ID,
    USER_FIRST_NAME,
    USER_LAST_NAME,
    USER_EMAIL,
    USER_ROLE,
    USER_PASSWORD,
    USER_CREATED_AT,
    USER_UPDATED_AT,
} from "@user/infrastructure/sql/UserDao";
import { fromDaoToModel as fromUserDaoToModel } from "@user/infrastructure/sql/userParsers";

class UserRepositoryRaw implements Repository {
    readonly instance: Sequelize;

    constructor(db: Sequelize) {
        this.instance = db;
    }

    public async insert(user: User): Promise<User> {
        const userId: string = user.id || uuidv4();
        const hashedPassword = await hashPassword(user.password);

        await this.instance.query(
            `
                INSERT INTO ${USER_TABLE} (
                    "${USER_ID}",
                    "${USER_FIRST_NAME}",
                    "${USER_LAST_NAME}",
                    "${USER_EMAIL}",
                    "${USER_ROLE}",
                    "${USER_PASSWORD}",
                    "${USER_CREATED_AT}",
                    "${USER_UPDATED_AT}"
                )
                VALUES (
                    :${USER_ID},
                    :${USER_FIRST_NAME},
                    :${USER_LAST_NAME},
                    :${USER_EMAIL},
                    :${USER_ROLE},
                    :${USER_PASSWORD},
                    :${USER_CREATED_AT},
                    :${USER_UPDATED_AT}
                );
            `,
            {
                replacements: {
                    [USER_ID]: userId,
                    [USER_FIRST_NAME]: user.firstName,
                    [USER_LAST_NAME]: user.lastName,
                    [USER_EMAIL]: user.email,
                    [USER_ROLE]: user.role,
                    [USER_PASSWORD]: hashedPassword,
                    [USER_CREATED_AT]: new Date().toISOString(),
                    [USER_UPDATED_AT]: new Date().toISOString(),
                },
            }
        );

        // TODO: is this required
        const newUser = await User.newInstance({ ...user, id: userId, password: undefined });
        return newUser;
    }

    public async insertBatch(users: Array<User>): Promise<Array<User>> {
        const usersPromises = users.map(async (user) => {
            return this.insert(user);
        });
        const userModels: Array<User> = await Promise.all(usersPromises);

        return userModels;
    }

    public async updateUserById(userId: string, user: User): Promise<User | null> {
        await this.instance.query(
            `
                UPDATE "${USER_TABLE}"
                SET 
                    "${USER_ID}" = :${USER_ID},
                    "${USER_FIRST_NAME}" = :${USER_FIRST_NAME},
                    "${USER_LAST_NAME}" = :${USER_LAST_NAME},
                    "${USER_EMAIL}" = :${USER_EMAIL},
                    "${USER_ROLE}" = :${USER_ROLE},
                    "${USER_UPDATED_AT}" = :${USER_UPDATED_AT}
                WHERE "${USER_ID}" = '${userId}';
            `,
            {
                replacements: {
                    [USER_ID]: userId,
                    [USER_FIRST_NAME]: user.firstName,
                    [USER_LAST_NAME]: user.lastName,
                    [USER_EMAIL]: user.email,
                    [USER_ROLE]: user.role,
                    [USER_UPDATED_AT]: new Date().toISOString(),
                },
            }
        );

        const updatedUser = await User.newInstance({ ...user, password: undefined });
        return updatedUser;
    }

    public async deleteUserById(userId: string): Promise<boolean> {
        const [_, metadata] = await this.instance.query(
            `
                DELETE FROM "${USER_TABLE}"
                WHERE "${USER_ID}" = '${userId}';
            `
        );

        return wasDeletionSuccessful(metadata);
    }

    public async getAllUsers(page: number, itemsPerPage: number): Promise<Page<Array<User>>> {
        const users = await this.instance.query(
            `
                SELECT *
                FROM "${USER_TABLE}"
                LIMIT ${itemsPerPage} OFFSET ${(page - 1) * itemsPerPage};
            `,
            {
                model: UserDao,
                mapToModel: true,
            }
        );

        const userModelsPromises = users.map(fromUserDaoToModel);
        const userModels: Array<User> = await Promise.all(userModelsPromises);

        return new Page<Array<User>>({
            data: userModels,
            currentPage: page,
            totalNumberOfDocuments: users.length,
            itemsPerPage,
        });
    }

    public async getUserById(userId: string): Promise<User | null> {
        const [user] = await this.instance.query(
            `
                SELECT *
                FROM "${USER_TABLE}"
                WHERE "${USER_ID}" = '${userId}';
            `,
            {
                model: UserDao,
                mapToModel: true,
            }
        );

        if (isEmpty(user)) {
            return null;
        }

        const userModel = await fromUserDaoToModel(user);
        return userModel;
    }

    public async getUserByEmail(email: string): Promise<User | null> {
        const [user] = await this.instance.query(
            `
                SELECT *
                FROM "${USER_TABLE}"
                WHERE "${USER_EMAIL}" = '${email}';
            `,
            {
                model: UserDao,
                mapToModel: true,
            }
        );

        if (isEmpty(user)) {
            return null;
        }

        const userModel = await fromUserDaoToModel(user);
        return userModel;
    }
}

export default UserRepositoryRaw;
