import { IsEmail, IsUUID, validate } from "class-validator";

import { KEY_DELIMITER } from "@shared/db/inMemory/InMemoryDb";
import { UserRole } from "@user/domain/User";

const USER_KEY = "user";
const USER_UNIQUE_KEY = "user-unique";
const USER_EMAIL_KEY = "user-email";

// TODO: add "columns"

class UserDao {
    @IsUUID()
    readonly id?: string;
    readonly firstName: string;
    readonly lastName: string;
    @IsEmail()
    readonly email: string;
    readonly role: UserRole;
    readonly password: string;

    constructor(firstName: string, lastName: string, email: string, role: UserRole, password: string, id?: string) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.role = role;
        this.password = password;
    }

    static async newInstance({
        id,
        firstName,
        lastName,
        email,
        role,
        password,
    }: {
        id?: string;
        firstName: string;
        lastName: string;
        email: string;
        role: UserRole;
        password: string;
    }): Promise<UserDao> {
        const userDao = new UserDao(firstName, lastName, email, role, password, id);

        await validate(userDao);

        return userDao;
    }
}

const generateUserKey = (id: string): string => `${USER_KEY}${KEY_DELIMITER}${id}`;

const generateUniqueUserKey = () => USER_UNIQUE_KEY;

const generateUserEmailKey = (email: string) => `${USER_EMAIL_KEY}${KEY_DELIMITER}${email}`;

export { generateUserKey, generateUniqueUserKey, generateUserEmailKey };
export default UserDao;
