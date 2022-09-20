import RoutineService from "modules/routine/domain/RoutineService";
import { DbType } from "@shared/db/database";
import InMemorySeeder from "@shared/db/inMemory/InMemorySeeder";

const ROUTINES_CSV_PATH = "src/modules/user/infrastructure/data/routines.csv";

interface Seeder {
    seed: () => Promise<void>;
}

const getSeeder = (dbType: string, routineService: RoutineService): Seeder => {
    const seeder: Seeder = {
        [DbType.IN_MEMORY]: new InMemorySeeder({ routineService }),
    }[dbType];

    return seeder;
};

export { getSeeder, ROUTINES_CSV_PATH };
export default Seeder;
