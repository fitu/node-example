import { IsEmail, IsUUID, validate } from "class-validator";

/* eslint-disable @typescript-eslint/naming-convention */
enum UserRole {
    USER = "user",
    ADMIN = "admin",
}

const validUserRoles: Array<string> = Object.values(UserRole);

class User {
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
    }): Promise<User> {
        const user = new User(firstName, lastName, email, role, password, id);

        await validate(user);

        return user;
    }
}

export { UserRole, validUserRoles };
export default User;
