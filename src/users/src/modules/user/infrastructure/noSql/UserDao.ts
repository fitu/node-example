import mongoose, { Document, Types } from "mongoose";

import { hashPassword } from "@utils/hashUtils";
import User, { UserRole, validUserRoles } from "@user/domain/User";
import { fromDaoToModel } from "@user/infrastructure/noSql/userParsers";

const USER_SCHEMA = "User";
const USER_DOCUMENT = "users";
// TODO: add "columns"

interface UserDao {
    readonly _id?: Types.ObjectId;
    remoteId?: string;
    firstName: string;
    lastName: string;
    email: string;
    role: UserRole;
    password: string;
}

interface UserDocument extends Document {
    toModel: () => User;
    validatePassword(password: string): boolean;
}

type UserFullDocument = UserDao & UserDocument;

const userSchema = new mongoose.Schema({
    remoteId: {
        type: String,
        required: true,
    },
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        required: true,
        enum: {
            // TODO: remove hardcoded
            values: validUserRoles,
            message: "Please select correct role",
        },
    },
    password: {
        type: String,
        required: true,
    },
});

userSchema.methods.toModel = async function (): Promise<User> {
    return fromDaoToModel(this);
};

userSchema.pre("save", async function (next) {
    const user = this as unknown as UserFullDocument;

    // Only hash the password if it has been modified (or is new)
    if (!user.isModified("password")) {
        return next();
    }

    const hashedPassword = await hashPassword(user.password);
    user.password = hashedPassword;

    next();
});

/* eslint-disable prefer-arrow/prefer-arrow-functions */
userSchema.pre("insertMany", async function (next, docs) {
    const usersPromises = docs.map(async function (user) {
        const hashedPassword = await hashPassword(user.password);
        user.password = hashedPassword;
        return user;
    });

    docs = await Promise.all(usersPromises);

    next();
});

const model = mongoose.model<UserFullDocument>(USER_SCHEMA, userSchema);

export type { UserFullDocument, UserDao };
export { USER_SCHEMA, USER_DOCUMENT };
export default model;
