import RoutineService from "modules/routine/domain/RoutineService";
import RoutineData from "modules/routine/application/RoutineData";
import RoutineNotFoundError from "./error/RoutineNotFoundError";

type GetRoutineByIdData = {
    readonly routineId: string;
};

class GetRoutineByIdInteractor {
    constructor(private readonly routineService: RoutineService) {}

    public async execute({ routineId }: GetRoutineByIdData): Promise<RoutineData> {
        const routine = await this.routineService.getRoutineById(routineId);

        if (!routine) {
            throw new RoutineNotFoundError();
        }

        return RoutineData.fromModel(routine);
    }
}

export type { GetRoutineByIdData };
export default GetRoutineByIdInteractor;
