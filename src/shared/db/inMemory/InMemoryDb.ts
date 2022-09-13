import { createClient, RedisClientType } from "redis";

import Database, { DatabaseOptions } from "@shared/db/database";

const KEY_ROOT = "$";
const KEY_DELIMITER = ":";

class InMemoryDb implements Database {
    private instance: RedisClientType;

    constructor(private readonly env: any) {}

    public init = async (options?: DatabaseOptions): Promise<void> => {
        this.instance = await this.createDbConnection();
    };

    private createDbConnection = async (): Promise<RedisClientType> => {
        const client: RedisClientType = createClient({
            socket: {
                host: this.env.DB_IN_MEMORY_HOST,
                port: this.env.DB_IN_MEMORY_PORT,
            },
            username: this.env.DB_IN_MEMORY_USER_NAME,
            password: this.env.DB_IN_MEMORY_PASSWORD,
        });

        await client.connect();

        return client;
    };

    public getInstance = (): RedisClientType => this.instance;

    public clearDB = async (): Promise<void> => {
        await this.instance.flushDb();
    };
}

export { KEY_ROOT, KEY_DELIMITER };
export default InMemoryDb;
