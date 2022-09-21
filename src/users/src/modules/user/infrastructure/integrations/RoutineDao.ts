import { IsUUID, validate } from "class-validator";

import Routine from "@user/domain/Routine";

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

    static async toModel({
        id,
        description,
        userId,
    }: {
        id?: string;
        description: string;
        userId: string;
    }): Promise<Routine> {
        const routine = await Routine.newInstance({ id, description, userId });

        await validate(routine);

        return routine;
    }
}

export default RoutineDao;
