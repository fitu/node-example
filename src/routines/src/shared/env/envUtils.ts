import { cleanEnv, str, port } from "envalid";
import dotenv from "dotenv";
import path from "path";

import { Versions } from "@shared/controllers/Versioner";

const SECRETS_FOLDER = "secrets";
const pathToSecrets = path.resolve(__dirname, "..", "..", "..", SECRETS_FOLDER);

const validateEnv = (): any => {
    // Load envs
    const ENV_FILENAME = ".env";
    const pathToEnv = path.join(pathToSecrets, ENV_FILENAME);

    dotenv.config({ path: pathToEnv });

    // Validate and clear envs
    /* eslint-disable @typescript-eslint/naming-convention */
    const env = cleanEnv(process.env, {
        DB_IN_MEMORY_USER_NAME: str(),
        DB_IN_MEMORY_PASSWORD: str(),
        DB_IN_MEMORY_HOST: str(),
        DB_IN_MEMORY_PORT: port(),

        VERSION: str({ choices: Object.values(Versions) }),

        JWT_SECRET: str(),
    });

    return env;
};

export { pathToSecrets };
export default validateEnv;
