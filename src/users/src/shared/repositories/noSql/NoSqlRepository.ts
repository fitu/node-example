import NoSqlUserRepository from "@user/infrastructure/noSql/UserRepository";
import NoSqlUserRepositoryRaw from "@user/infrastructure/noSql/UserRepositoryRaw";
import { DbQuery } from "@shared/db/database";
import { Repos, Repository } from "@shared/repositories/Repository";

class NoSqlRepository implements Repository {
    public getRepos(dbQuery: string): Repos {
        return dbQuery === DbQuery.ORM.toString()
            ? {
                  userRepository: new NoSqlUserRepository(),
              }
            : {
                  userRepository: new NoSqlUserRepositoryRaw(),
              };
    }
}

export default NoSqlRepository;
