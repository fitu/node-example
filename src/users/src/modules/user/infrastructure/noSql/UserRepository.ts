/* eslint-disable @typescript-eslint/await-thenable */
import Page from "@shared/Page";
import User from "@user/domain/User";
import { Repository } from "@user/infrastructure/Repository";
import UserDocument, { UserDao, UserFullDocument } from "@user/infrastructure/noSql/UserDao";
import {
    fromModelToDao as fromUserModelToDao,
    updateDocument as updateUserDocument,
} from "@user/infrastructure/noSql/userParsers";

class UserRepository implements Repository {
    public async insert(user: User): Promise<User> {
        const userToSave: UserDao = fromUserModelToDao(user);

        const newUserDocument: UserFullDocument = await UserDocument.create(userToSave);

        const newUserModel: User = await newUserDocument.toModel();
        return newUserModel;
    }

    public async insertBatch(users: Array<User>): Promise<Array<User>> {
        const usersToSave: Array<UserDao> = users.map((user) => fromUserModelToDao(user));

        const newUserDocuments: Array<UserFullDocument> = await UserDocument.insertMany(usersToSave);

        const insertedUsersPromises = newUserDocuments.map((newUserDocument) => newUserDocument.toModel());
        const insertedUsers: Array<User> = await Promise.all(insertedUsersPromises);

        return insertedUsers;
    }

    public async updateUserById(userId: string, user: User): Promise<User | null> {
        const userDocument: UserFullDocument | null = await UserDocument.findOne({ remoteId: userId }).exec();

        if (!userDocument) {
            return null;
        }

        const userDocumentUpdated: UserFullDocument = updateUserDocument(userDocument, user);
        const updatedUserDocument: UserFullDocument = await userDocumentUpdated.save();

        const updatedUser: User = await updatedUserDocument.toModel();

        return updatedUser;
    }

    public async deleteUserById(userId: string): Promise<boolean> {
        const deletedUserDocument: UserFullDocument = await UserDocument.findOneAndDelete({
            remoteId: userId,
        }).exec();

        const success = !!deletedUserDocument;
        return success;
    }

    public async getAllUsers(page: number, itemsPerPage: number): Promise<Page<Array<User>>> {
        const userDocuments: Array<UserFullDocument> = await UserDocument.find()
            .skip((page - 1) * itemsPerPage)
            .limit(itemsPerPage);

        const usersPromises = userDocuments.map((userDocument) => userDocument.toModel());
        const users: Array<User> = await Promise.all(usersPromises);

        const totalDocuments: number = users.length;

        return new Page<Array<User>>({
            data: users,
            currentPage: page,
            totalNumberOfDocuments: totalDocuments,
            itemsPerPage,
        });
    }

    public async getUserById(userId: string): Promise<User | null> {
        const userDocument: UserFullDocument | null = await UserDocument.findOne({ remoteId: userId }).exec();

        const userModel: User = await userDocument?.toModel();

        return userModel;
    }

    public async getUserByEmail(email: string): Promise<User | null> {
        const userDocument: UserFullDocument | null = await UserDocument.findOne({ email }).exec();

        const userModel: User = await userDocument?.toModel();

        return userModel;
    }
}

export default UserRepository;
