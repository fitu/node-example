import { validate } from "class-validator";
import { plainToInstance } from "class-transformer";

import User from "@user/domain/User";
import UserService from "@user/domain/UserService";
import EmailAlreadyInUseError from "@user/application/error/EmailAlreadyInUseError";
import UserData from "@user/application/model/UserData";

type CreateUserData = {
    readonly userData: UserData;
};

class CreateUserInteractor {
    constructor(private readonly userService: UserService) {}

    public async execute({ userData }: CreateUserData): Promise<UserData> {
        const user: User = await this.userService.getUserByEmail(userData.email);

        if (user) {
            throw new EmailAlreadyInUseError();
        }

        const newUser = plainToInstance(User, userData);

        await validate(newUser);

        const createdUser = await this.userService.insert({ ...newUser });

        return UserData.fromModel(createdUser);
    }
}

export type { CreateUserData };
export default CreateUserInteractor;
