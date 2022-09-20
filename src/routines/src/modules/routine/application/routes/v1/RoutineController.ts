import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status";

import { Controller } from "@shared/controllers/Controller";
import { ErrorHandler } from "@shared/error/ErrorHandler";
import { getPageAndItemsPerPage } from "@shared/Page";
import RoutineService from "modules/routine/domain/RoutineService";
import RoutineNotFoundError from "modules/routine/application/error/RoutineNotFoundError";
import GetRoutineByUserIdInteractor, {
    GetRoutineByUserIdData,
} from "modules/routine/application/GetRoutineByUserIdInteractor";
import GetAllRoutinesInteractor, { GetAllRoutinesData } from "modules/routine/application/GetAllRoutinesInteractor";
import RoutineData from "modules/routine/application/RoutineData";
import CreateRoutineInteractor from "modules/routine/application/CreateRoutineInteractor";
import UpdateRoutineByIdInteractor, {
    UpdateRoutineByIdData,
} from "modules/routine/application/UpdateRoutineByIdInteractor";
import DeleteRoutineByIdInteractor, {
    DeleteRoutineByIdData,
} from "modules/routine/application/DeleteRoutineByIdInteractor";
import GetRoutineByIdInteractor, { GetRoutineByIdData } from "@routine/application/GetRoutineByIdInteractor";

class RoutineController implements Controller {
    constructor(private readonly routineService: RoutineService) {}

    getRoutineById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const { id } = req.params;
        const data: GetRoutineByIdData = { routineId: id };

        try {
            const interactor = new GetRoutineByIdInteractor(this.routineService);
            const result = await interactor.execute(data);
            const routine = result.toView();

            res.status(httpStatus.OK).json({ success: true, data: routine });
        } catch (error: any) {
            if (error instanceof RoutineNotFoundError) {
                next(new ErrorHandler(httpStatus.NOT_FOUND, error));
                return;
            }
            next(error);
        }
    };

    getRoutineByUserId = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const { id } = req.params;
        const data: GetRoutineByUserIdData = { userId: id };

        try {
            const interactor = new GetRoutineByUserIdInteractor(this.routineService);
            const result = await interactor.execute(data);
            const routine = result.toView();

            res.status(httpStatus.OK).json({ success: true, data: routine });
        } catch (error: any) {
            if (error instanceof RoutineNotFoundError) {
                next(new ErrorHandler(httpStatus.NOT_FOUND, error));
                return;
            }
            next(error);
        }
    };

    getRoutines = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const [page, itemsPerPage] = getPageAndItemsPerPage(req);
        const data: GetAllRoutinesData = { page, itemsPerPage };

        try {
            const interactor = new GetAllRoutinesInteractor(this.routineService);
            const routinesWithMetadata = await interactor.execute(data);

            const allRoutines = {
                ...routinesWithMetadata,
                data: routinesWithMetadata.data?.map((routine) => routine.toView()) ?? [],
            };

            res.status(httpStatus.OK).json({ success: true, ...allRoutines });
        } catch (error: any) {
            next(error);
        }
    };

    createRoutine = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const {
            description,
            userId,
        }: {
            description: string;
            userId: string;
        } = req.body;

        const routineData = RoutineData.newInstance({
            description,
            userId,
        });
        const data = { routineData };

        try {
            const interactor = new CreateRoutineInteractor(this.routineService);
            const result = await interactor.execute(data);
            const newRoutine = result.toView();

            res.status(httpStatus.OK).json({ success: true, data: newRoutine });
        } catch (error: any) {
            if (error instanceof RoutineNotFoundError) {
                next(new ErrorHandler(httpStatus.NOT_FOUND, error));
                return;
            }
            next(error);
        }
    };

    updateRoutineById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const { id } = req.params;
        const {
            description,
            userId,
        }: {
            description: string;
            userId: string;
        } = req.body;
        const routineData = RoutineData.newInstance({ id, description, userId });
        const data: UpdateRoutineByIdData = { routineData };

        try {
            const interactor = new UpdateRoutineByIdInteractor(this.routineService);
            const result = await interactor.execute(data);
            const updatedRoutine = result.toView();

            res.status(httpStatus.OK).json({ success: true, data: updatedRoutine });
        } catch (error: any) {
            if (error instanceof RoutineNotFoundError) {
                next(new ErrorHandler(httpStatus.NOT_FOUND, error));
            }
            next(new Error(error));
        }
    };

    deleteRoutineById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const { id } = req.params;
        const data: DeleteRoutineByIdData = { routineId: id };

        try {
            const interactor = new DeleteRoutineByIdInteractor(this.routineService);
            await interactor.execute(data);

            res.status(httpStatus.OK).json({ success: true });
        } catch (error: any) {
            if (error instanceof RoutineNotFoundError) {
                next(new ErrorHandler(httpStatus.NOT_FOUND, error));
                return;
            }
            next(new Error(error));
        }
    };
}

export default RoutineController;
