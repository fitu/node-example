import { Repository as UserRepository } from "@user/infrastructure/Repository";
import { DbType } from "@shared/db/database";
import SqlRepository from "@shared/repositories/sq/SqlRepository";
import NoSqlRepository from "@shared/repositories/noSql/NoSqlRepository";

type Repos = {
    userRepository: UserRepository;
};

interface Repository {
    getRepos: (dbQuery: string) => Repos;
}

const getRepositories = (db: any, dbType: string, dbQuery: string): Repos => {
    const repository: Repository = {
        [DbType.SQL]: new SqlRepository(db),
        [DbType.NO_SQL]: new NoSqlRepository(),
    }[dbType];

    return repository.getRepos(dbQuery);
};

export type { Repos, Repository };
export default getRepositories;
