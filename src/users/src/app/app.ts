/* eslint-disable @typescript-eslint/require-await */
import { Server } from "http";

import express, { Application } from "express";

import { handleAppErrors } from "@shared/error/errorController";
import Middleware from "@shared/middlewares/Middleware";
import Routes from "@shared/routes/Routes";

class App {
    private readonly app: Application;
    public readonly version: string;

    constructor(
        private readonly controllers: Array<Routes>,
        private readonly middlewares: Array<Middleware>,
        version: string
    ) {
        this.app = express();
        this.controllers = controllers;
        this.middlewares = middlewares;
        this.version = version;
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
            this.app.use(this.version, controller.router);
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

export default App;
