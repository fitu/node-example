import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { v4 as uuidv4 } from "uuid";

import User from "@user/domain/User";
import UserDao from "@user/infrastructure/inMemory/UserDao";

const fromModelToDao = async (user: User | null): Promise<UserDao | null> => {
    if (!user) {
        return null;
    }

    const userId: string = user.id || uuidv4();

    const userDao = plainToInstance(UserDao, {
        ...user,
        id: userId,
    });
    await validate(userDao);

    const userDaoWithDependencies = await UserDao.newInstance({
        ...userDao,
    });

    return userDaoWithDependencies;
};

const fromDaoToModel = async (userDao: UserDao | null): Promise<User | null> => {
    if (!userDao) {
        return null;
    }

    const user = plainToInstance(User, userDao);
    await validate(user);

    const userWithDependencies = await User.newInstance({ ...user });

    return userWithDependencies;
};

export { fromModelToDao, fromDaoToModel };
