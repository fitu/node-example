import Page from "@shared/Page";
import Routine from "modules/routine/domain/Routine";

interface Repository {
    insert: (routine: Routine) => Promise<Routine>;
    insertBatch: (routines: Array<Routine>) => Promise<Array<Routine>>;
    updateRoutineById: (routineId: string, routine: Routine) => Promise<Routine | null>;
    deleteRoutineById: (routineId: string) => Promise<boolean>;
    getAllRoutines(page: number, itemsPerPage: number): Promise<Page<Array<Routine>>>;
    getRoutineByUserId: (userId: string) => Promise<Routine | null>;
}

export type { Repository };
