import RoutineService from "@routine/domain/RoutineService";
import InMemorySeeder from "@shared/db/inMemory/InMemorySeeder";

const ROUTINES_CSV_PATH = "src/modules/routine/infrastructure/data/routines.csv";

interface Seeder {
    seed: () => Promise<void>;
}

const getSeeder = (routineService: RoutineService): Seeder => {
    const seeder: Seeder = new InMemorySeeder({ routineService });

    return seeder;
};

export { getSeeder, ROUTINES_CSV_PATH };
export default Seeder;
