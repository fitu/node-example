/* eslint-disable @typescript-eslint/naming-convention */
enum ErrorCodes {
    UNKNOWN = "",

    NOT_FOUND = "nf-0",
    ROUTINE_NOT_FOUND = "nt-1",

    NOT_ALLOWED = "na-0",
    USER_HAS_NOT_ROUTINE = "na-1",

    INVALID_DATA = "id-0",
}

class BaseError {
    readonly code: string;
    readonly message: string;
    readonly details: string;

    constructor({ code, message, details }: { code: string; message: string; details: string }) {
        this.code = code;
        this.message = message;
        this.details = details;
    }
}

export { ErrorCodes };
export default BaseError;
