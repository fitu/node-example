import { readFromCsv } from "@shared/data/csvUtils";
import Seeder, { USERS_CSV_PATH } from "@shared/db/seeder";
import UserCSV from "@user/infrastructure/data/UserCSV";
import UserService from "@user/domain/UserService";

class InMemorySeeder implements Seeder {
    readonly userService: UserService;

    constructor({ userService }: { userService: UserService }) {
        this.userService = userService;
    }

    public seed = async (): Promise<void> => {
        await this.createUsers();
    };

    private createUsers = async (): Promise<void> => {
        const usersCSV = await readFromCsv<UserCSV>(USERS_CSV_PATH);
        const usersPromises = usersCSV.map(UserCSV.toModel);
        const users = await Promise.all(usersPromises);

        await this.userService.insertBatch(users);
    };
}

export default InMemorySeeder;
