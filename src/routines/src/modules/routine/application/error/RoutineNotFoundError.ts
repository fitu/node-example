import { ErrorCodes } from "@shared/error/BaseError";
import NotFoundError from "@shared/error/BaseNotFoundError";

class RoutineNotFoundError extends NotFoundError {
    constructor() {
        const errorCode = ErrorCodes.ROUTINE_NOT_FOUND.toString();
        const messageToRender = "error.routine_not_found";
        const detailsToRender = "";

        super(messageToRender, detailsToRender, errorCode);

        Error.captureStackTrace(this, this.constructor);
    }
}

export default RoutineNotFoundError;
