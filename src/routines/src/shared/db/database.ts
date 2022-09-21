import InMemoryDb from "@shared/db/inMemory/InMemoryDb";

interface DatabaseOptions {
    readonly force?: boolean;
}

interface Database {
    init: (options?: DatabaseOptions) => Promise<void>;
    clearDB: () => Promise<void>;
    getInstance: () => any;
}

const getDb = (env: any): Database => {
    const db: Database = new InMemoryDb(env);

    return db;
};

export type { DatabaseOptions };
export { getDb };
export default Database;
