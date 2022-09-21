import RoutineService from "@routine/domain/RoutineService";
import RoutineData from "@routine/application/RoutineData";
import UserHasNotRoutineError from "./error/UserHasNotRoutineError";

type GetRoutineByUserIdData = {
    readonly userId: string;
};

class GetRoutineByUserIdInteractor {
    constructor(private readonly routineService: RoutineService) {}

    public async execute({ userId }: GetRoutineByUserIdData): Promise<RoutineData> {
        const routine = await this.routineService.getRoutineByUserId(userId);

        if (!routine) {
            throw new UserHasNotRoutineError();
        }

        return RoutineData.fromModel(routine);
    }
}

export type { GetRoutineByUserIdData };
export default GetRoutineByUserIdInteractor;
