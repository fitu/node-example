// /* eslint-disable @typescript-eslint/require-await */
// import { expect } from "chai";

// import NotFoundError from "@shared/error/BaseNotFoundError";
// import { Repository as UserRepository } from "modules/routine/infrastructure/Repository";
// import UserService from "modules/routine/domain/UserService";

// describe("UserService", () => {
//     let repository: UserRepository;
//     let service: UserService;

//     beforeEach(() => {
//         repository = <UserRepository>{};
//         service = new UserService(repository);
//     });

//     it("deleteUserById should throw an error if there is an error deleting the user", async () => {
//         // Given
//         const userId = "foo";

//         repository.deleteUserById = async (_: string): Promise<boolean> => {
//             return false;
//         };

//         try {
//             // When
//             await service.deleteUserById(userId);
//         } catch (error: any) {
//             // Then
//             expect(error).instanceOf(NotFoundError);
//         }
//     });

//     it("deleteUserById should return without any error if there is no error deleting the user", async () => {
//         // Given
//         const userId = "foo";

//         repository.deleteUserById = async (_userId: string): Promise<boolean> => {
//             return true;
//         };

//         // When
//         await service.deleteUserById(userId);
//     });
// });
