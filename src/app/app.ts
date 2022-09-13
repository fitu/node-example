import { Server } from "http";

import express, { Application } from "express";

import { handleAppErrors } from "@shared/error/errorController";
import Middleware from "@shared/middlewares/Middleware";
import Routes from "@shared/routes/Routes";

const BASE_VERSION = "/api/v1";

class App {
    private readonly app: Application;

    constructor(
        // private readonly io: Server,
        private readonly controllers: Array<Routes>,
        private readonly middlewares: Array<Middleware>
    ) {
        this.app = express();
        // this.io = io;
        this.controllers = controllers;
        this.middlewares = middlewares;
    }

    public async init(): Promise<void> {
        await this.initializeMiddlewares();
        this.initializeControllers();
    }

    private initializeMiddlewares = async (): Promise<void> => {
        const middlewarePromises = this.middlewares.map(async (middleware) => {
            return middleware.init(this.app);
        });

        await Promise.all(middlewarePromises);
    };

    private initializeControllers(): void {
        this.controllers.forEach((controller) => {
            this.app.use(BASE_VERSION, controller.router);
        });
        this.app.use(handleAppErrors);
    }

    // eslint-disable-next-line @typescript-eslint/require-await
    public async listen(isVerbose = true): Promise<Server> {
        const server = this.app.listen(process.env.PORT, () => {
            if (!isVerbose) {
                return;
            }

            console.log(`Server started on port ${process.env.PORT} in ${process.env.NODE_ENV} mode`);
        });

        return server;
    }
}

export { BASE_VERSION };
export default App;
