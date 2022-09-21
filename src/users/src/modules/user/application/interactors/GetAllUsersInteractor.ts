import Page from "@shared/Page";
import UserService from "@user/domain/UserService";
import UserData from "@user/application/model/UserData";

type GetAllUsersData = {
    readonly page: number;
    readonly itemsPerPage: number;
};

class GetAllUsersInteractor {
    constructor(private readonly userService: UserService) {}

    public async execute({ page, itemsPerPage }: GetAllUsersData): Promise<Page<Array<UserData>>> {
        const allUsersWithMetadata = await this.userService.getAllUsers(page, itemsPerPage);
        const usersData = allUsersWithMetadata.data?.map(UserData.fromModel);

        return {
            ...allUsersWithMetadata,
            data: usersData,
        };
    }
}

export type { GetAllUsersData };
export default GetAllUsersInteractor;
