import { ErrorCodes } from "@shared/error/BaseError";
import BaseNotAllowedError from "@shared/error/BaseNotAllowedError";

class RoutineAlreadyExistsError extends BaseNotAllowedError {
    constructor() {
        const errorCode = ErrorCodes.ROUTINE_ALREADY_EXISTS.toString();
        const messageToRender = "error.routine_already_exists";
        const detailsToRender = "";

        super(messageToRender, detailsToRender, errorCode);

        Error.captureStackTrace(this, this.constructor);
    }
}

export default RoutineAlreadyExistsError;