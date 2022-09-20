import User, { UserRole } from "@user/domain/User";

class UserCSV {
    constructor(
        public id: string,
        public firstName: string,
        public lastName: string,
        public email: string,
        public role: UserRole,
        public password: string
    ) {}

    static async toModel(userCSV: UserCSV): Promise<User | null> {
        if (!userCSV) {
            return null;
        }

        const user = await User.newInstance({
            id: userCSV.id,
            firstName: userCSV.firstName,
            lastName: userCSV.lastName,
            email: userCSV.email,
            role: userCSV.role,
            password: userCSV.password,
        });

        return user;
    }
}

export default UserCSV;
