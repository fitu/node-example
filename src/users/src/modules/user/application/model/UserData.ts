import User, { UserRole } from "@user/domain/User";
import UserViewModel from "@user/application/model/UserViewModel";
import RoutineData from "@user/application/model/RoutineData";
import RoutineViewModel from "@user/application/model/RoutineViewModel";

class UserData {
    readonly id?: string;
    readonly firstName: string;
    readonly lastName: string;
    readonly email: string;
    readonly role: UserRole;
    readonly password?: string;
    readonly routine?: RoutineData;

    constructor(
        firstName: string,
        lastName: string,
        email: string,
        role: UserRole,
        id?: string,
        password?: string,
        routine?: RoutineData
    ) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.role = role;
        this.password = password;
        this.routine = routine;
    }

    static newInstance({
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
        password?: string;
        routine: RoutineData;
    }): UserData {
        const userData = new UserData(firstName, lastName, email, role, id, password, routine);

        return userData;
    }

    static fromModel(user: User | null): UserData | null {
        if (!user) {
            return null;
        }

        const routine = RoutineData.newInstance({
            id: user.routine.id,
            description: user.routine.description,
            userId: user.routine.userId,
        });

        const userData = UserData.newInstance({
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role,
            password: user.password,
            routine,
        });

        return userData;
    }

    toView(): UserViewModel {
        const routine = RoutineViewModel.newInstance({
            id: this.routine.id,
            description: this.routine.description,
            userId: this.routine.userId,
        });

        const userViewModel = UserViewModel.newInstance({
            id: this.id,
            firstName: this.firstName,
            lastName: this.lastName,
            email: this.email,
            role: this.role,
            routine,
        });
        return userViewModel;
    }
}

export default UserData;
