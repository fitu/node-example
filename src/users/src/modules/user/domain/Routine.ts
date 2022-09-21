import { IsUUID, validate } from "class-validator";

class Routine {
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
    }): Promise<Routine> {
        const routine = new Routine(description, userId, id);

        await validate(routine);

        return routine;
    }
}

export default Routine;
