import { IsUUID, validate } from "class-validator";

import { KEY_DELIMITER } from "@shared/db/inMemory/InMemoryDb";

const ROUTINE_KEY = "routine";
const ROUTINE_UNIQUE_KEY = "routine-unique";

// TODO: add "columns"

class RoutineDao {
    @IsUUID()
    readonly id?: string;
    readonly description: string;
    readonly userId: string;

    constructor(description: string, userId: string, id?: string) {
        this.id = id;
        this.description = description;
        this.userId = userId;
    }

    static async newInstance({
        id,
        description,
        userId,
    }: {
        id?: string;
        description: string;
        userId: string;
    }): Promise<RoutineDao> {
        const routineDao = new RoutineDao(description, userId, id);

        await validate(routineDao);

        return routineDao;
    }
}

const generateRoutineKey = (id: string): string => `${ROUTINE_KEY}${KEY_DELIMITER}${id}`;

const generateUniqueRoutineKey = () => ROUTINE_UNIQUE_KEY;

export { generateRoutineKey, generateUniqueRoutineKey };
export default RoutineDao;
