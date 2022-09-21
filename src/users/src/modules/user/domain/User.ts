import { IsEmail, IsUUID, validate } from "class-validator";

import Routine from "@user/domain/Routine";

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
    readonly routine?: Routine;

    constructor(
        firstName: string,
        lastName: string,
        email: string,
        role: UserRole,
        password: string,
        id?: string,
        routine?: Routine
    ) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.role = role;
        this.password = password;
        this.routine = routine;
    }

    static async newInstance({
        id,
        firstName,
        lastName,
        email,
        role,
        password,
        routine,
    }: {
        id?: string;
        firstName: string;
        lastName: string;
        email: string;
        role: UserRole;
        password: string;
        routine?: Routine;
    }): Promise<User> {
        const user = new User(firstName, lastName, email, role, password, id, routine);

        await validate(user);

        return user;
    }
}

export { UserRole, validUserRoles };
export default User;
