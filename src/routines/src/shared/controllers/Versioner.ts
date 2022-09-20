/* eslint-disable @typescript-eslint/naming-convention */
import Routes from "@shared/routes/Routes";
import RoutineService from "modules/routine/domain/RoutineService";
import RoutineRoutes from "modules/routine/application/routes/v1/RoutineRoutes";

enum Versions {
    V1 = "v1",
    V2 = "v2",
    ALL = "all",
}

const getRouters = (version: string, routineService: RoutineService): Array<Routes> =>
    ({
        [Versions.V1]: [new RoutineRoutes(routineService)],
        [Versions.V2]: [],
        [Versions.ALL]: [new RoutineRoutes(routineService)],
    }[version]);

export { Versions, getRouters };
