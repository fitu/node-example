import { UserRole } from "@user/domain/User";
import RoutineViewModel from "@user/application/model/RoutineViewModel";

class UserViewModel {
    readonly id: string;
    readonly firstName: string;
    readonly lastName: string;
    readonly email: string;
    readonly role: UserRole;
    readonly routine?: RoutineViewModel;

    constructor(
        id: string,
        firstName: string,
        lastName: string,
        email: string,
        role: UserRole,
        routine?: RoutineViewModel
    ) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.role = role;
        this.routine = routine;
    }

    static newInstance({
        id,
        firstName,
        lastName,
        email,
        role,
        routine,
    }: {
        id: string;
        firstName: string;
        lastName: string;
        email: string;
        role: UserRole;
        routine?: RoutineViewModel;
    }): UserViewModel {
        const userViewModel = new UserViewModel(id, firstName, lastName, email, role, routine);

        return userViewModel;
    }
}

export default UserViewModel;
