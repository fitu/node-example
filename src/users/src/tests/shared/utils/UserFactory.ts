import { faker } from "@faker-js/faker";

import User, { UserRole } from "@user/domain/User";

const getRandomUser = async (): Promise<User> => {
    const user = await User.newInstance({
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        email: faker.internet.email(),
        role: UserRole.USER,
        password: faker.random.alpha(10),
    });

    return user;
};

const getRandomUserWithId = async (userId: string): Promise<User> => {
    const randomUser = await getRandomUser();
    const user = await User.newInstance({
        ...randomUser,
        id: userId,
    });

    return user;
};

export { getRandomUser, getRandomUserWithId };
