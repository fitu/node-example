import { Repos, Repository } from "@shared/repositories/Repository";
import InMemoryUserRepository from "@user/infrastructure/inMemory/UserRepository";

class InMemoryRepository implements Repository {
    readonly client: any;

    constructor(db: any) {
        this.client = db;
    }

    public getRepos(_: string): Repos {
        return {
            userRepository: new InMemoryUserRepository(this.client),
        };
    }
}

export default InMemoryRepository;
