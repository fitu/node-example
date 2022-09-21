import RoutineService from "@routine/domain/RoutineService";
import Routine from "@routine/domain/Routine";
import RoutineNotFoundError from "@routine/application/error/RoutineNotFoundError";
import RoutineData from "@routine/application/RoutineData";
import { filterNulls } from "@shared/utils/objectUtils";

type UpdateRoutineByIdData = {
    readonly routineData: RoutineData;
};

class UpdateRoutineByIdInteractor {
    constructor(private readonly routineService: RoutineService) {}

    public async execute({ routineData }: UpdateRoutineByIdData): Promise<RoutineData> {
        const routine = await this.routineService.getRoutineByUserId(routineData.userId);

        if (!routine) {
            throw new RoutineNotFoundError();
        }

        const routineDataWithoutNulls = filterNulls(routineData);
        const routineToUpdate = await Routine.newInstance({
            ...routine,
            ...routineDataWithoutNulls,
        });

        const updatedRoutine = await this.routineService.updateRoutineById(routineData.id, routineToUpdate);

        return RoutineData.fromModel(updatedRoutine);
    }
}

export type { UpdateRoutineByIdData };
export default UpdateRoutineByIdInteractor;
