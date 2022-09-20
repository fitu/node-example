import yargs from "yargs";

import UserService from "@user/domain/UserService";
import validateEnv from "@shared/env/envUtils";
import getRepositories from "@shared/repositories/Repository";
import { getSeeder } from "@shared/db/seeder";
import { DbType, getDb } from "@shared/db/database";

const seedDb = async (dbType: string, dbQuery: string) => {
    // Validate env before start
    const env = validateEnv();

    // Initialize and connect to DB
    const db = getDb(env, dbType);
    await db.init({ force: true });

    // Clear data
    await db.clearDB();

    // Create Repositories
    const { userRepository } = getRepositories(db.getInstance(), dbType, dbQuery);

    // Create Services
    const userService = new UserService(userRepository);

    try {
        // Populate DB
        const seeder = getSeeder(dbType, userService);
        await seeder.seed();
        console.log("DB fulfilled!");
    } catch (error: any) {
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        console.error(`There was an error populating the db: ${error}`);
    } finally {
        process.exit();
    }
};

// Load the arguments
const argv = yargs
    .scriptName("seed")
    .usage("Usage: $0 -t DbType -q DbQuery")
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    .example(`$0 -t ${DbType.IN_MEMORY}`, "Populate IN MEMORY")
    .option("t", {
        alias: "type",
        describe: "DB type",
        type: "string",
        choices: Object.values(DbType),
    }).argv;

const { type, query } = argv;

// Populate db
void seedDb(type, query);
