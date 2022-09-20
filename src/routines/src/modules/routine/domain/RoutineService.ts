import Page from "@shared/Page";
import RoutineNotFoundError from "modules/routine/application/error/RoutineNotFoundError";
import { Repository as RoutineRepository } from "modules/routine/infrastructure/Repository";
import Routine from "modules/routine/domain/Routine";

class RoutineService {
    constructor(private readonly routineRepository: RoutineRepository) {}

    public async insert(routine: Routine): Promise<Routine> {
        return this.routineRepository.insert(routine);
    }

    public async insertBatch(routines: Array<Routine>): Promise<Array<Routine>> {
        return this.routineRepository.insertBatch(routines);
    }

    public async getAllRoutines(page: number, itemsPerPage: number): Promise<Page<Array<Routine>>> {
        return this.routineRepository.getAllRoutines(page, itemsPerPage);
    }

    public async getRoutineByUserId(userId: string): Promise<Routine | null> {
        return this.routineRepository.getRoutineByUserId(userId);
    }

    public async deleteRoutineById(routineId: string): Promise<void> {
        const success = await this.routineRepository.deleteRoutineById(routineId);

        if (!success) {
            throw new RoutineNotFoundError();
        }
    }

    public async updateRoutineById(routineId: string, routine: Routine): Promise<Routine> {
        const updatedRoutine = await this.routineRepository.updateRoutineById(routineId, routine);

        if (!updatedRoutine) {
            throw new RoutineNotFoundError();
        }

        return updatedRoutine;
    }
}

export default RoutineService;
