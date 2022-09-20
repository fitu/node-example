import { omit } from "lodash";
import { v4 as uuidv4 } from "uuid";

import User from "@user/domain/User";
import { UserDao, UserFullDocument } from "@user/infrastructure/noSql/UserDao";

// TODO: use constants
const fromModelToDao = (user: User | null): UserDao | null => {
    if (!user) {
        return null;
    }

    const remoteId = user.id || uuidv4();
    const userWithoutId = omit(user, "id");

    const userDao: UserDao = {
        ...userWithoutId,
        remoteId,
    };

    return userDao;
};

// TODO: use constants
const fromDaoToModel = async (userDao: UserDao | null): Promise<User | null> => {
    if (!userDao) {
        return null;
    }

    const id = userDao.remoteId;

    const user = await User.newInstance({
        id,
        firstName: userDao.firstName,
        lastName: userDao.lastName,
        email: userDao.email,
        role: userDao.role,
        password: userDao.password,
    });

    return user;
};

// TODO: use constants
const updateDocument = (userDocument: UserFullDocument, user: User): UserFullDocument => {
    userDocument.remoteId = user.id;
    userDocument.firstName = user.firstName;
    userDocument.lastName = user.lastName;
    userDocument.email = user.email;
    userDocument.role = user.role;
    userDocument.password = user.password;

    return userDocument;
};

export { fromModelToDao, fromDaoToModel, updateDocument };
