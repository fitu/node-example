import Page from "@shared/Page";
import RoutineService from "modules/routine/domain/RoutineService";
import RoutineData from "modules/routine/application/RoutineData";

type GetAllRoutinesData = {
    readonly page: number;
    readonly itemsPerPage: number;
};

class GetAllRoutinesInteractor {
    constructor(private readonly routineService: RoutineService) {}

    public async execute({ page, itemsPerPage }: GetAllRoutinesData): Promise<Page<Array<RoutineData>>> {
        const allRoutinesWithMetadata = await this.routineService.getAllRoutines(page, itemsPerPage);
        const routinesData = allRoutinesWithMetadata.data?.map(RoutineData.fromModel);

        return {
            ...allRoutinesWithMetadata,
            data: routinesData,
        };
    }
}

export type { GetAllRoutinesData };
export default GetAllRoutinesInteractor;
