import { Repository as UserRepository } from "@user/infrastructure/Repository";
import { DbType } from "@shared/db/database";
import SqlRepository from "@shared/repositories/sq/SqlRepository";
import NoSqlRepository from "@shared/repositories/noSql/NoSqlRepository";
import RoutineRepository from "@user/infrastructure/integrations/RoutineRepository";

type Repos = {
    userRepository: UserRepository;
};

type Integrations = {
    routineRepository: RoutineRepository;
};

interface Repository {
    getRepos: (dbQuery: string) => Repos;
}

const getRepositories = (db: any, dbType: string, dbQuery: string, routineIntegrationUrl): Repos & Integrations => {
    const repository: Repository = {
        [DbType.SQL]: new SqlRepository(db),
        [DbType.NO_SQL]: new NoSqlRepository(),
    }[dbType];

    const routineRepository = new RoutineRepository(routineIntegrationUrl);

    const allRepos = { ...repository.getRepos(dbQuery), routineRepository };

    return allRepos;
};

export type { Repos, Repository };
export default getRepositories;
