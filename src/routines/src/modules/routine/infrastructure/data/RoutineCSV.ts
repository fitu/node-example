import Routine from "@routine/domain/Routine";

class RoutineCSV {
    constructor(public id: string, public description: string, public userId: string) {}

    static async toModel(routineCSV: RoutineCSV): Promise<Routine | null> {
        if (!routineCSV) {
            return null;
        }

        const routine = await Routine.newInstance({
            id: routineCSV.id,
            description: routineCSV.description,
            userId: routineCSV.userId,
        });

        return routine;
    }
}

export default RoutineCSV;
