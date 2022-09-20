import UserService from "@user/domain/UserService";
import { DbType } from "@shared/db/database";
import NoSqlSeeder from "@shared/db/noSql/NoSqlSeeder";
import SqlSeeder from "@shared/db/sql/SqlSeeder";

const USERS_CSV_PATH = "src/modules/user/infrastructure/data/users.csv";

interface Seeder {
    seed: () => Promise<void>;
}

const getSeeder = (dbType: string, userService: UserService): Seeder => {
    const seeder: Seeder = {
        [DbType.SQL]: new SqlSeeder({ userService }),
        [DbType.NO_SQL]: new NoSqlSeeder({ userService }),
    }[dbType];

    return seeder;
};

export { getSeeder, USERS_CSV_PATH };
export default Seeder;
