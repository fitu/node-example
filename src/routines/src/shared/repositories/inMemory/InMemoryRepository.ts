import { Repos, Repository } from "@shared/repositories/Repository";
import InMemoryRoutineRepository from "modules/routine/infrastructure/inMemory/RoutineRepository";

class InMemoryRepository implements Repository {
    readonly client: any;

    constructor(db: any) {
        this.client = db;
    }

    public getRepos(_: string): Repos {
        return {
            routineRepository: new InMemoryRoutineRepository(this.client),
        };
    }
}

export default InMemoryRepository;
