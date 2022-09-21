import { body, param, query } from "express-validator";

import BaseInvalidDataError from "@shared/error/BaseInvalidDataError";
import UserService from "@user/domain/UserService";
import RoutineService from "@user/domain/RoutineService";
import Routes from "@shared/routes/Routes";
import UserController from "@user/application/routes/v1/UserController";
import { validUserRoles } from "@user/domain/User";
import isAuthMiddleware from "@shared/middlewares/isAuthMiddleware";
import isValid from "@shared/middlewares/validationMiddleware";

class UserRoutes extends Routes {
    public path = "/users";
    private controller: UserController;

    constructor(userService: UserService, routineService: RoutineService) {
        super();
        this.controller = new UserController(userService, routineService);
        this.initializeRoutes();
    }

    private validations = {
        getOne: [param("id").notEmpty().isUUID()],
        getOneWithRoutine: [param("id").notEmpty().isUUID()],
        getAll: [
            query("page").isNumeric().optional({ nullable: true }),
            query("itemsPerPage").isNumeric().optional({ nullable: true }),
        ],
        signUpPost: [
            body("firstName").notEmpty().isString().trim(),
            body("lastName").notEmpty().isString().trim(),
            body("email").notEmpty().isEmail(),
            body("role")
                .notEmpty()
                .custom((value) => {
                    if (!validUserRoles.includes(value)) {
                        throw new BaseInvalidDataError("error.invalid_role_input");
                    }
                    return true;
                })
                .trim(),
            body("password").notEmpty().isLength({ min: 6 }),
        ],
        putOne: [
            body("firstName").isString().trim(),
            body("lastName").isString().trim(),
            body("email").isEmail(),
            body("role")
                .custom((value) => {
                    if (!validUserRoles.includes(value)) {
                        throw new BaseInvalidDataError("error.invalid_role_input");
                    }
                    return true;
                })
                .trim(),
        ],
        deleteOne: [param("id").notEmpty().isUUID()],
        signInPost: [body("email").notEmpty().isEmail(), body("password").notEmpty().isLength({ min: 6 })],
        forgotPasswordPost: [body("email").notEmpty().isEmail()],
        resetPasswordPost: [
            body("email").notEmpty().isEmail(),
            body("newPassword").notEmpty().isLength({ min: 6 }),
            body("resetPasswordToken").notEmpty().isString().trim(),
        ],
    };

    protected override initializeRoutes = (): void => {
        this.router.get(this.path, this.validations.getAll, isValid, this.controller.getUsers);
        this.router.get(`${this.path}/:id`, this.validations.getOne, isValid, this.controller.getUserById);
        this.router.get(
            `${this.path}/:id/routine`,
            this.validations.getOneWithRoutine,
            isValid,
            this.controller.getUserByIdWithRoutine
        );
        this.router.post(`${this.path}/sign-up`, this.validations.signUpPost, this.controller.createUser);
        this.router.put(
            `${this.path}/:id`,
            isAuthMiddleware,
            this.validations.putOne,
            isValid,
            this.controller.updateUserById
        );
        this.router.delete(
            `${this.path}/:id`,
            isAuthMiddleware,
            this.validations.deleteOne,
            isValid,
            this.controller.deleteUserById
        );
        this.router.post(`${this.path}/sign-in`, this.validations.signInPost, this.controller.signInUser);
    };
}

export default UserRoutes;
