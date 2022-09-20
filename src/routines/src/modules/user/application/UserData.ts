import User, { UserRole } from "@user/domain/User";
import UserViewModel from "@user/application/UserViewModel";

class UserData {
    readonly id?: string;
    readonly firstName: string;
    readonly lastName: string;
    readonly email: string;
    readonly role: UserRole;
    readonly password?: string;

    constructor(firstName: string, lastName: string, email: string, role: UserRole, id?: string, password?: string) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.role = role;
        this.password = password;
    }

    static newInstance({
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
        password?: string;
    }): UserData {
        const userData = new UserData(firstName, lastName, email, role, id, password);

        return userData;
    }

    static fromModel(user: User | null): UserData | null {
        if (!user) {
            return null;
        }

        const userData = UserData.newInstance({
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role,
            password: user.password,
        });

        return userData;
    }

    toView(): UserViewModel {
        const userViewModel = UserViewModel.newInstance({
            id: this.id,
            firstName: this.firstName,
            lastName: this.lastName,
            email: this.email,
            role: this.role,
        });
        return userViewModel;
    }
}

export default UserData;
