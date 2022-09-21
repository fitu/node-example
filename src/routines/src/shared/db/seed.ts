import RoutineService from "@routine/domain/RoutineService";
import validateEnv from "@shared/env/envUtils";
import getRepositories from "@shared/repositories/Repository";
import { getSeeder } from "@shared/db/seeder";
import { getDb } from "@shared/db/database";

const seedDb = async () => {
    // Validate env before start
    const env = validateEnv();

    // Initialize and connect to DB
    const db = getDb(env);
    await db.init({ force: true });

    // Clear data
    await db.clearDB();

    // Create Repositories
    const { routineRepository } = getRepositories(db.getInstance());

    // Create Services
    const routineService = new RoutineService(routineRepository);

    try {
        // Populate DB
        const seeder = getSeeder(routineService);
        await seeder.seed();
        console.log("DB fulfilled!");
    } catch (error: any) {
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        console.error(`There was an error populating the db: ${error}`);
    } finally {
        process.exit();
    }
};

// Populate db
void seedDb();
