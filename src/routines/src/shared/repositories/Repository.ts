import { Repository as UserRepository } from "@user/infrastructure/Repository";
import { DbType } from "@shared/db/database";
import InMemoryRepository from "@shared/repositories/inMemory/InMemoryRepository";

type Repos = {
    userRepository: UserRepository;
};

interface Repository {
    getRepos: (dbQuery: string) => Repos;
}

const getRepositories = (db: any, dbType: string, dbQuery: string): Repos => {
    const repository: Repository = {
        [DbType.IN_MEMORY]: new InMemoryRepository(db),
    }[dbType];

    return repository.getRepos(dbQuery);
};

export type { Repos, Repository };
export default getRepositories;
