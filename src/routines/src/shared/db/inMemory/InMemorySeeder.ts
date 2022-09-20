import { readFromCsv } from "@shared/data/csvUtils";
import Seeder, { ROUTINES_CSV_PATH } from "@shared/db/seeder";
import RoutineCSV from "modules/routine/infrastructure/data/RoutineCSV";
import RoutineService from "modules/routine/domain/RoutineService";

class InMemorySeeder implements Seeder {
    readonly routineService: RoutineService;

    constructor({ routineService }: { routineService: RoutineService }) {
        this.routineService = routineService;
    }

    public seed = async (): Promise<void> => {
        await this.createRoutines();
    };

    private createRoutines = async (): Promise<void> => {
        const routinesCSV = await readFromCsv<RoutineCSV>(ROUTINES_CSV_PATH);
        const routinesPromises = routinesCSV.map(RoutineCSV.toModel);
        const routines = await Promise.all(routinesPromises);

        await this.routineService.insertBatch(routines);
    };
}

export default InMemorySeeder;
