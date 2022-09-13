import { isNil } from "lodash";

const filterNulls = <T>(data: T): T => {
    Object.keys(data).forEach((key) => {
        if (isNil(data[key])) {
            delete data[key];
        }
    });

    return data;
};

export { filterNulls };
