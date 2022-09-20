import InMemoryDb from "@shared/db/inMemory/InMemoryDb";

/* eslint-disable @typescript-eslint/naming-convention */
enum DbType {
    IN_MEMORY = "in_memory",
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
        [DbType.IN_MEMORY]: new InMemoryDb(env),
    }[dbType];

    return db;
};

export type { DatabaseOptions };
export { getDb, DbType };
export default Database;
