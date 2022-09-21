import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status";

import { Controller } from "@shared/controllers/Controller";
import { ErrorHandler } from "@shared/error/ErrorHandler";
import { getPageAndItemsPerPage } from "@shared/Page";
import { generateJWTToken } from "@shared/utils/hashUtils";
import UserService from "@user/domain/UserService";
import RoutineService from "@user/domain/RoutineService";
import UserNotFoundError from "@user/application/error/UserNotFoundError";
import GetUserByIdInteractor, { GetUserByIdData } from "@user/application/GetUserByIdInteractor";
import GetAllUsersInteractor, { GetAllUsersData } from "@user/application/GetAllUsersInteractor";
import UserData from "@user/application/model/UserData";
import CreateUserInteractor from "@user/application/CreateUserInteractor";
import UserHasNotPermissionsError from "@user/application/error/UserHasNotPermissionsError";
import EmailAlreadyInUseError from "@user/application/error/EmailAlreadyInUseError";
import UpdateUserByIdInteractor, { UpdateUserByIdData } from "@user/application/UpdateUserByIdInteractor";
import DeleteUserByIdInteractor, { DeleteUserByIdData } from "@user/application/DeleteUserByIdInteractor";
import SignInUserInteractor from "@user/application/SignInUserInteractor";
import SignInError from "@user/application/error/SignInError";
import { UserRole } from "@user/domain/User";
import GetUserByIdWithRoutineInteractor, {
    GetUserByIdWithRoutineData,
} from "@user/application/GetUserByIdWithRoutineInteractor";

class UserController implements Controller {
    constructor(private readonly userService: UserService, private readonly routineService: RoutineService) {}

    getUserById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const { id } = req.params;
        const data: GetUserByIdData = { userId: id };

        try {
            const interactor = new GetUserByIdInteractor(this.userService);
            const result = await interactor.execute(data);
            const user = result.toView();

            res.status(httpStatus.OK).json({ success: true, data: user });
        } catch (error: any) {
            if (error instanceof UserNotFoundError) {
                next(new ErrorHandler(httpStatus.NOT_FOUND, error));
                return;
            }
            next(error);
        }
    };

    getUserByIdWithRoutine = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const { id } = req.params;
        const data: GetUserByIdWithRoutineData = { userId: id };

        try {
            const interactor = new GetUserByIdWithRoutineInteractor(this.userService, this.routineService);
            const result = await interactor.execute(data);
            const user = result.toView();

            res.status(httpStatus.OK).json({ success: true, data: user });
        } catch (error: any) {
            if (error instanceof UserNotFoundError) {
                next(new ErrorHandler(httpStatus.NOT_FOUND, error));
                return;
            }
            next(error);
        }
    };

    getUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const [page, itemsPerPage] = getPageAndItemsPerPage(req);
        const data: GetAllUsersData = { page, itemsPerPage };

        try {
            const interactor = new GetAllUsersInteractor(this.userService);
            const usersWithMetadata = await interactor.execute(data);

            const allUsers = {
                ...usersWithMetadata,
                data: usersWithMetadata.data?.map((user) => user.toView()) ?? [],
            };

            res.status(httpStatus.OK).json({ success: true, ...allUsers });
        } catch (error: any) {
            next(error);
        }
    };

    createUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const {
            firstName,
            lastName,
            email,
            role,
            password,
        }: {
            firstName: string;
            lastName: string;
            email: string;
            role: UserRole;
            password: string;
        } = req.body;

        const userData = UserData.newInstance({
            firstName,
            lastName,
            email,
            password,
            role,
            routine: null,
        });
        const data = { userData };

        try {
            const interactor = new CreateUserInteractor(this.userService);
            const result = await interactor.execute(data);
            const newUser = result.toView();

            res.status(httpStatus.OK).json({ success: true, data: newUser });
        } catch (error: any) {
            if (error instanceof UserNotFoundError) {
                next(new ErrorHandler(httpStatus.NOT_FOUND, error));
                return;
            }
            if (error instanceof UserHasNotPermissionsError) {
                next(new ErrorHandler(httpStatus.UNAUTHORIZED, error));
                return;
            }
            if (error instanceof EmailAlreadyInUseError) {
                next(new ErrorHandler(httpStatus.UNPROCESSABLE_ENTITY, error));
            }
            next(error);
        }
    };

    updateUserById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const { id } = req.params;
        const { userId } = req;
        const {
            firstName,
            lastName,
            email,
            role,
        }: {
            firstName: string;
            lastName: string;
            email: string;
            role: UserRole;
        } = req.body;
        const userData = UserData.newInstance({ id, firstName, lastName, email, role, routine: null });
        const data: UpdateUserByIdData = { userId, userData };

        try {
            const interactor = new UpdateUserByIdInteractor(this.userService);
            const result = await interactor.execute(data);
            const updatedUser = result.toView();

            res.status(httpStatus.OK).json({ success: true, data: updatedUser });
        } catch (error: any) {
            if (error instanceof UserNotFoundError) {
                next(new ErrorHandler(httpStatus.NOT_FOUND, error));
            }
            if (error instanceof UserHasNotPermissionsError) {
                next(new ErrorHandler(httpStatus.UNAUTHORIZED, error));
                return;
            }
            next(new Error(error));
        }
    };

    deleteUserById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const { id } = req.params;
        const { userId } = req;
        const data: DeleteUserByIdData = { userId, userToDelete: id };

        try {
            const interactor = new DeleteUserByIdInteractor(this.userService);
            await interactor.execute(data);

            res.status(httpStatus.OK).json({ success: true });
        } catch (error: any) {
            if (error instanceof UserNotFoundError) {
                next(new ErrorHandler(httpStatus.NOT_FOUND, error));
                return;
            }
            if (error instanceof UserHasNotPermissionsError) {
                next(new ErrorHandler(httpStatus.UNAUTHORIZED, error));
                return;
            }
            next(new Error(error));
        }
    };

    signInUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const { email, password }: { email: string; password: string } = req.body;
        const data = { email, password };

        const interactor = new SignInUserInteractor(this.userService);
        try {
            const result = await interactor.execute(data);
            const token = await generateJWTToken(result.email, result.id);

            res.status(httpStatus.OK).json({ success: true, data: token });
        } catch (error: any) {
            if (error instanceof UserNotFoundError) {
                next(new ErrorHandler(httpStatus.NOT_FOUND, error));
                return;
            }
            if (error instanceof SignInError) {
                next(new ErrorHandler(httpStatus.UNPROCESSABLE_ENTITY, error));
                return;
            }
            next(new Error(error));
        }
    };
}

export default UserController;
