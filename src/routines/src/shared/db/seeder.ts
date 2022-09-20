import UserService from "@user/domain/UserService";
import { DbType } from "@shared/db/database";
import InMemorySeeder from "@shared/db/inMemory/InMemorySeeder";

const USERS_CSV_PATH = "src/modules/user/infrastructure/data/users.csv";

interface Seeder {
    seed: () => Promise<void>;
}

const getSeeder = (dbType: string, userService: UserService): Seeder => {
    const seeder: Seeder = {
        [DbType.IN_MEMORY]: new InMemorySeeder({ userService }),
    }[dbType];

    return seeder;
};

export { getSeeder, USERS_CSV_PATH };
export default Seeder;
