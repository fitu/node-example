import SqlDb from "@shared/db/sql/SqlDb";
import NoSqlDb from "@shared/db/noSql/NoSqlDb";

/* eslint-disable @typescript-eslint/naming-convention */
enum DbType {
    SQL = "sql",
    NO_SQL = "no_sql",
}

/* eslint-disable @typescript-eslint/naming-convention */
enum DbQuery {
    ORM = "orm",
    RAW = "raw",
}

interface DatabaseOptions {
    readonly force?: boolean;
}

interface Database {
    init: (options?: DatabaseOptions) => Promise<void>;
    clearDB: () => Promise<void>;
    getInstance: () => any;
}

const getDb = (env: any, dbType: string): Database => {
    const db: Database = {
        [DbType.SQL]: new SqlDb(env),
        [DbType.NO_SQL]: new NoSqlDb(env),
    }[dbType];

    return db;
};

export type { DatabaseOptions };
export { getDb, DbType, DbQuery };
export default Database;
