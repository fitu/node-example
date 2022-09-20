import { Router } from "express";

abstract class Routes {
    path: string;
    router: Router = Router();

    protected abstract initializeRoutes: () => void;
}

export default Routes;
