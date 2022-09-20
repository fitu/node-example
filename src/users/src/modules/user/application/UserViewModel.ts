import { UserRole } from "@user/domain/User";

class UserViewModel {
    readonly id: string;
    readonly firstName: string;
    readonly lastName: string;
    readonly email: string;
    readonly role: UserRole;

    constructor(id: string, firstName: string, lastName: string, email: string, role: UserRole) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.role = role;
    }

    static newInstance({
        id,
        firstName,
        lastName,
        email,
        role,
    }: {
        id: string;
        firstName: string;
        lastName: string;
        email: string;
        role: UserRole;
    }): UserViewModel {
        const userViewModel = new UserViewModel(id, firstName, lastName, email, role);

        return userViewModel;
    }
}

export default UserViewModel;
