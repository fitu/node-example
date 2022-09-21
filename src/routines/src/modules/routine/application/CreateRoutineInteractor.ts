import { validate } from "class-validator";
import { plainToInstance } from "class-transformer";

import Routine from "@routine/domain/Routine";
import RoutineService from "@routine/domain/RoutineService";
import RoutineData from "@routine/application/RoutineData";
import RoutineAlreadyExistsError from "@routine/application/error/RoutineAlreadyExists";

type CreateRoutineData = {
    readonly routineData: RoutineData;
};

class CreateRoutineInteractor {
    constructor(private readonly routineService: RoutineService) {}

    public async execute({ routineData }: CreateRoutineData): Promise<RoutineData> {
        const routine = await this.routineService.getRoutineByUserId(routineData.userId);

        if (routine) {
            throw new RoutineAlreadyExistsError();
        }

        const newRoutine = plainToInstance(Routine, routineData);

        await validate(newRoutine);

        const createdRoutine = await this.routineService.insert(newRoutine);

        return RoutineData.fromModel(createdRoutine);
    }
}

export type { CreateRoutineData };
export default CreateRoutineInteractor;
