import RoutineService from "@routine/domain/RoutineService";

type DeleteRoutineByIdData = {
    readonly routineId: string;
};

class DeleteRoutineByIdInteractor {
    constructor(private readonly routineService: RoutineService) {}

    public async execute({ routineId }: DeleteRoutineByIdData): Promise<void> {
        await this.routineService.deleteRoutineById(routineId);
    }
}

export type { DeleteRoutineByIdData };
export default DeleteRoutineByIdInteractor;
