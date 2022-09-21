/* eslint-disable @typescript-eslint/require-await */
import Routine from "@user/domain/Routine";
import RoutineRepository from "@user/infrastructure/integrations/RoutineRepository";

class RoutineService {
    constructor(private readonly routineRepository: RoutineRepository) {}

    public async getRoutineByUserId(userId: string): Promise<Routine | null> {
        return this.routineRepository.getRoutineByUserId(userId);
    }
}

export default RoutineService;
