import { User } from "../../../domain/entities/User";
import { IUserRepository } from "../../../domain/repositories/IUserRepository";

export class GetUsersPaginatedUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(
    page: number = 1,
    limit: number = 10,
    search?: string
  ): Promise<{
    users: User[];
    meta: { totalCount: number; totalPages: number; currentPage: number; limit: number };
  }> {
    const { users, totalCount } = await this.userRepository.findAndCount(
      page,
      limit,
      search
    );

    const totalPages = Math.ceil(totalCount / limit);

    return {
      users,
      meta: {
        totalCount,
        totalPages,
        currentPage: page,
        limit,
      },
    };
  }
}
