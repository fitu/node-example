import { Model, DataTypes, Optional, Sequelize } from "sequelize";
import { IsEmail, IsUUID } from "class-validator";

import { hashPasswordSync } from "@utils/hashUtils";
import { UserRole, validUserRoles } from "@user/domain/User";

const USER_TABLE = "users";
const USER_ID = "id";
const USER_FIRST_NAME = "firstName";
const USER_LAST_NAME = "lastName";
const USER_EMAIL = "email";
const USER_ROLE = "role";
const USER_PASSWORD = "password";
const USER_CREATED_AT = "createdAt";
const USER_UPDATED_AT = "updatedAt";

interface UserAttributes {
    readonly [USER_ID]: string;
    readonly [USER_FIRST_NAME]: string;
    readonly [USER_LAST_NAME]: string;
    readonly [USER_EMAIL]: string;
    readonly [USER_ROLE]: UserRole;
    readonly [USER_PASSWORD]: string;
}

type UserFullAttributes = UserAttributes;

type UserCreationAttributes = Optional<UserAttributes, "id">;

class UserDao extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
    @IsUUID()
    public [USER_ID]!: string;
    public [USER_FIRST_NAME]!: string;
    public [USER_LAST_NAME]!: string;
    @IsEmail()
    public [USER_EMAIL]!: string;
    public [USER_ROLE]!: UserRole;
    public [USER_PASSWORD]!: string;

    public readonly [USER_CREATED_AT]!: Date;
    public readonly [USER_UPDATED_AT]!: Date;
}

const init = (sequelize: Sequelize): void => {
    UserDao.init(
        {
            [USER_ID]: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                allowNull: false,
                primaryKey: true,
            },
            [USER_FIRST_NAME]: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    len: [2, 30],
                },
            },
            [USER_LAST_NAME]: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    len: [2, 30],
                },
            },
            [USER_EMAIL]: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    isEmail: true,
                },
                unique: true,
            },
            [USER_ROLE]: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    isIn: [validUserRoles],
                },
            },
            [USER_PASSWORD]: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    min: 8,
                },
                set(value: string) {
                    const hash = hashPasswordSync(value);
                    this.setDataValue(USER_PASSWORD, hash);
                },
            },
        },
        {
            tableName: USER_TABLE,
            sequelize,
        }
    );
};

export type { UserFullAttributes };
export {
    init,
    USER_TABLE,
    USER_ID,
    USER_FIRST_NAME,
    USER_LAST_NAME,
    USER_EMAIL,
    USER_ROLE,
    USER_PASSWORD,
    USER_CREATED_AT,
    USER_UPDATED_AT,
};
export default UserDao;
