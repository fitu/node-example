import { Repository as RoutineRepository } from "modules/routine/infrastructure/Repository";
import InMemoryRepository from "@shared/repositories/inMemory/InMemoryRepository";

type Repos = {
    routineRepository: RoutineRepository;
};

interface Repository {
    getRepos: () => Repos;
}

const getRepositories = (db: any): Repos => {
    const repository: Repository = new InMemoryRepository(db);

    return repository.getRepos();
};

export type { Repos, Repository };
export default getRepositories;
