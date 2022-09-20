import { body, param, query } from "express-validator";

import RoutineService from "modules/routine/domain/RoutineService";
import Routes from "@shared/routes/Routes";
import RoutineController from "modules/routine/application/routes/v1/RoutineController";
import isValid from "@shared/middlewares/validationMiddleware";

class RoutineRoutes extends Routes {
    public path = "/routines";
    private controller: RoutineController;

    constructor(routineService: RoutineService) {
        super();
        this.controller = new RoutineController(routineService);
        this.initializeRoutes();
    }

    private validations = {
        getOne: [param("id").notEmpty().isUUID()],
        getAll: [
            query("page").isNumeric().optional({ nullable: true }),
            query("itemsPerPage").isNumeric().optional({ nullable: true }),
        ],
        signUpPost: [body("description").notEmpty().isString().trim(), body("userId").notEmpty().isString().trim()],
        putOne: [body("description").isString().trim(), body("userId").isString().trim()],
        deleteOne: [param("id").notEmpty().isUUID()],
    };

    protected override initializeRoutes = (): void => {
        this.router.get(this.path, this.validations.getAll, isValid, this.controller.getRoutines);
        this.router.get(`${this.path}/:id`, this.validations.getOne, isValid, this.controller.getRoutineByUserId);
        this.router.post(`${this.path}`, this.validations.signUpPost, this.controller.createRoutine);
        this.router.put(`${this.path}/:id`, this.validations.putOne, isValid, this.controller.updateRoutineById);
        this.router.delete(`${this.path}/:id`, this.validations.deleteOne, isValid, this.controller.deleteRoutineById);
    };
}

export default RoutineRoutes;
