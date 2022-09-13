import User from "@user/domain/User";
import UserDao, {
    UserFullAttributes,
    USER_EMAIL,
    USER_FIRST_NAME,
    USER_ID,
    USER_LAST_NAME,
    USER_PASSWORD,
    USER_ROLE,
} from "@user/infrastructure/sql/UserDao";

// eslint-disable-next-line @typescript-eslint/require-await
const fromModelToDao = async (user: User | null): Promise<UserFullAttributes | null> => {
    if (!user) {
        return null;
    }

    const userParsed: UserFullAttributes = {
        ...(<Required<User>>user),
    };

    return userParsed;
};

const fromDaoToModel = async (userDao: UserDao | null): Promise<User | null> => {
    const user = await User.newInstance({
        id: userDao[USER_ID],
        firstName: userDao[USER_FIRST_NAME],
        lastName: userDao[USER_LAST_NAME],
        email: userDao[USER_EMAIL],
        role: userDao[USER_ROLE],
        password: userDao[USER_PASSWORD],
    });

    return user;
};

export { fromModelToDao, fromDaoToModel };
