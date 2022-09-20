import { Sequelize } from "sequelize";

import UserDao, { init as initUser } from "@user/infrastructure/sql/UserDao";
import Database, { DatabaseOptions } from "@shared/db/database";

class SqlDb implements Database {
    private instance: Sequelize;

    constructor(private readonly env: any) {}

    public init = async (options?: DatabaseOptions): Promise<void> => {
        this.instance = this.createDbConnection();

        this.initializeTables();
        // this.initializeRelationships();

        const forceSync = options?.force ?? false;
        await this.instance.sync({ force: forceSync });
    };

    private createDbConnection = (): Sequelize => {
        const dbName = this.env.DB_SQL_NAME;
        const dbUserName = this.env.DB_SQL_USER_NAME;
        const dbPassword = this.env.DB_SQL_PASSWORD;
        const dbHost = this.env.DB_SQL_HOST;
        const dbPort = this.env.DB_SQL_PORT;

        const sequelize = new Sequelize(dbName, dbUserName, dbPassword, {
            dialect: "postgres",
            host: dbHost,
            port: dbPort,
        });

        return sequelize;
    };

    private initializeTables = (): void => {
        initUser(this.instance);
    };

    public getInstance = (): any => this.instance;

    public clearDB = async (): Promise<void> => {
        console.log("Delete users");
        await UserDao.destroy({ where: {} });
    };
}

export default SqlDb;
