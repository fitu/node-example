import RoutineService from "modules/routine/domain/RoutineService";
import Routine from "modules/routine/domain/Routine";
import RoutineNotFoundError from "modules/routine/application/error/RoutineNotFoundError";
import RoutineData from "modules/routine/application/RoutineData";
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

        // TODO: check permissions

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