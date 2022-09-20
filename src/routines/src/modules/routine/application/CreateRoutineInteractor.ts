import { validate } from "class-validator";
import { plainToInstance } from "class-transformer";

import Routine from "modules/routine/domain/Routine";
import RoutineService from "modules/routine/domain/RoutineService";
import RoutineData from "modules/routine/application/RoutineData";

type CreateRoutineData = {
    readonly routineData: RoutineData;
};

class CreateRoutineInteractor {
    constructor(private readonly routineService: RoutineService) {}

    public async execute({ routineData }: CreateRoutineData): Promise<RoutineData> {
        // TODO: check if the user has a routine
        const newRoutine = plainToInstance(Routine, routineData);

        await validate(newRoutine);

        const createdRoutine = await this.routineService.insert(newRoutine);

        return RoutineData.fromModel(createdRoutine);
    }
}

export type { CreateRoutineData };
export default CreateRoutineInteractor;
