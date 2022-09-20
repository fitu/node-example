import { Sequelize } from "sequelize";

import SqlUserRepository from "@user/infrastructure/sql/UserRepository";
import SqlUserRepositoryRaw from "@user/infrastructure/sql/UserRepositoryRaw";
import { DbQuery } from "@shared/db/database";
import { Repos, Repository } from "@shared/repositories/Repository";

class SqlRepository implements Repository {
    readonly db: Sequelize;

    constructor(db?: any) {
        this.db = db;
    }

    public getRepos(dbQuery: string): Repos {
        return dbQuery === DbQuery.ORM.toString()
            ? {
                  userRepository: new SqlUserRepository(),
              }
            : {
                  userRepository: new SqlUserRepositoryRaw(this.db),
              };
    }
}

export default SqlRepository;
