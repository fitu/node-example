import { ErrorCodes } from "@shared/error/BaseError";
import BaseNotAllowedError from "@shared/error/BaseNotAllowedError";

class UserHasNotRoutineError extends BaseNotAllowedError {
    constructor() {
        const errorCode = ErrorCodes.USER_HAS_NOT_ROUTINE.toString();
        const messageToRender = "error.user_has_not_routine";
        const detailsToRender = "";

        super(messageToRender, detailsToRender, errorCode);

        Error.captureStackTrace(this, this.constructor);
    }
}

export default UserHasNotRoutineError;
