import UserService from "@user/domain/UserService";
import UserNotFoundError from "@user/application/error/UserNotFoundError";
import UserData from "@user/application/model/UserData";
import RoutineService from "@user/domain/RoutineService";

type GetUserByIdWithRoutineData = {
    readonly userId: string;
};

class GetUserByIdWithRoutineInteractor {
    constructor(private readonly userService: UserService, private readonly routineService: RoutineService) {}

    public async execute({ userId }: GetUserByIdWithRoutineData): Promise<UserData> {
        const user = await this.userService.getUserById(userId);

        if (!user) {
            throw new UserNotFoundError();
        }

        const routine = await this.routineService.getRoutineByUserId(userId);
        const userWithRoutine = { ...user, routine };

        return UserData.fromModel(userWithRoutine);
    }
}

export type { GetUserByIdWithRoutineData };
export default GetUserByIdWithRoutineInteractor;
