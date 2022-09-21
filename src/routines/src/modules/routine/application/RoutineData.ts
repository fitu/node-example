import Routine from "@routine/domain/Routine";
import RoutineViewModel from "@routine/application/RoutineViewModel";

class RoutineData {
    readonly id?: string;
    readonly description: string;
    readonly userId: string;

    constructor(description: string, userId: string, id?: string) {
        this.id = id;
        this.description = description;
        this.userId = userId;
    }

    static newInstance({ id, description, userId }: { id?: string; description: string; userId: string }): RoutineData {
        const routineData = new RoutineData(description, userId, id);

        return routineData;
    }

    static fromModel(routine: Routine | null): RoutineData | null {
        if (!routine) {
            return null;
        }

        const routineData = RoutineData.newInstance({
            id: routine.id,
            description: routine.description,
            userId: routine.userId,
        });

        return routineData;
    }

    toView(): RoutineViewModel {
        const routineViewModel = RoutineViewModel.newInstance({
            id: this.id,
            description: this.description,
            userId: this.userId,
        });

        return routineViewModel;
    }
}

export default RoutineData;
