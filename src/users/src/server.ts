import "reflect-metadata";

import UserService from "@user/domain/UserService";
import RoutineService from "@user/domain/RoutineService";
import validateEnv from "@shared/env/envUtils";
import getRepositories from "@shared/repositories/Repository";
import { getDb } from "@shared/db/database";
import App from "@app/app";
import ParserMiddleware from "@app/middlewares/ParserMiddleware";
import CORSMiddleware from "@app/middlewares/CORSMiddleware";
import HeadersMiddleware from "@app/middlewares/HeadersMiddleware";
import LogsMiddleware from "@app/middlewares/LogsMiddleware";
import I18nMiddleware from "@app/middlewares/I18nMiddleware";
import StaticResourcesMiddleware from "@app/middlewares/StaticResourcesMiddleware";
import { getRouters } from "@shared/controllers/Versioner";

void (async () => {
    try {
        // Validate env before start
        const env = validateEnv();
        const dbType = env.DB_TYPE;

        // Initialize and connect to DB
        const db = getDb(env, dbType);
        await db.init();

        // Create Repositories
        const dbQuery = env.DB_QUERIES;
        const routineIntegrationUrl = env.INTEGRATION_ROUTINE_URL;
        const { userRepository, routineRepository } = getRepositories(
            db.getInstance(),
            dbType,
            dbQuery,
            routineIntegrationUrl
        );

        // Create Services
        const userService = new UserService(userRepository);
        const routineService = new RoutineService(routineRepository);

        // Create Controllers
        const version = env.VERSION;
        const controllers = getRouters(version, userService, routineService);

        // Create Middlewares
        const middlewares = [
            new ParserMiddleware(),
            new CORSMiddleware(),
            new HeadersMiddleware(),
            new LogsMiddleware(),
            new I18nMiddleware(),
            new StaticResourcesMiddleware(),
        ];

        // Initialize Third Party Integrations

        // Create app and launch it!
        const app = new App(controllers, middlewares, version);
        await app.init();
        await app.listen();
    } catch (error: any) {
        console.error("Error while connecting to the database", error);
    }
})();
