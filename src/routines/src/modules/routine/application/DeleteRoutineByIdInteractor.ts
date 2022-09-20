import RoutineService from "modules/routine/domain/RoutineService";

type DeleteRoutineByIdData = {
    readonly routineId: string;
};

class DeleteRoutineByIdInteractor {
    constructor(private readonly routineService: RoutineService) {}

    public async execute({ routineId }: DeleteRoutineByIdData): Promise<void> {
        // TODO: check permissions
        await this.routineService.deleteRoutineById(routineId);
    }
}

export type { DeleteRoutineByIdData };
export default DeleteRoutineByIdInteractor;
