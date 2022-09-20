import { faker } from "@faker-js/faker";

import Routine from "modules/routine/domain/Routine";

const getRandomRoutine = async (): Promise<Routine> => {
    // TODO: check this random values
    const routine = await Routine.newInstance({
        description: faker.name.firstName(),
        userId: faker.name.lastName(),
    });

    return routine;
};

const getRandomRoutineWithId = async (routineId: string): Promise<Routine> => {
    const randomRoutine = await getRandomRoutine();
    const routine = await Routine.newInstance({
        ...randomRoutine,
        id: routineId,
    });

    return routine;
};

export { getRandomRoutine, getRandomRoutineWithId };
