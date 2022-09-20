class RoutineViewModel {
    readonly id: string;
    readonly description: string;
    readonly userId: string;

    constructor(id: string, description: string, userId: string) {
        this.id = id;
        this.description = description;
        this.userId = userId;
    }

    static newInstance({
        id,
        description,
        userId,
    }: {
        id: string;
        description: string;
        userId: string;
    }): RoutineViewModel {
        const routineViewModel = new RoutineViewModel(id, description, userId);

        return routineViewModel;
    }
}

export default RoutineViewModel;
