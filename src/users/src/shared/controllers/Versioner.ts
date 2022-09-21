/* eslint-disable @typescript-eslint/naming-convention */
import Routes from "@shared/routes/Routes";
import UserService from "@user/domain/UserService";
import RoutineService from "@user/domain/RoutineService";
import UserRoutes from "@user/application/routes/v1/UserRoutes";

enum Versions {
    V1 = "v1",
    V2 = "v2",
    ALL = "all",
}

const getRouters = (version: string, userService: UserService, routineService: RoutineService): Array<Routes> =>
    ({
        [Versions.V1]: [new UserRoutes(userService, routineService)],
        [Versions.V2]: [],
        [Versions.ALL]: [new UserRoutes(userService, routineService)],
    }[version]);

export { Versions, getRouters };
