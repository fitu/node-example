import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { v4 as uuidv4 } from "uuid";

import Routine from "@routine/domain/Routine";
import RoutineDao from "@routine/infrastructure/inMemory/RoutineDao";

const fromModelToDao = async (routine: Routine | null): Promise<RoutineDao | null> => {
    if (!routine) {
        return null;
    }

    const routineId: string = routine.id || uuidv4();

    const routineDao = plainToInstance(RoutineDao, {
        ...routine,
        id: routineId,
    });
    await validate(routineDao);

    const routineDaoWithDependencies = await RoutineDao.newInstance({
        ...routineDao,
    });

    return routineDaoWithDependencies;
};

const fromDaoToModel = async (routineDao: RoutineDao | null): Promise<Routine | null> => {
    if (!routineDao) {
        return null;
    }

    const routine = plainToInstance(Routine, routineDao);
    await validate(routine);

    const routineWithDependencies = await Routine.newInstance({ ...routine });

    return routineWithDependencies;
};

export { fromModelToDao, fromDaoToModel };
