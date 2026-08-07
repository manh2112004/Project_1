import { User } from "../../../domain/entities/User";
import { IUserRepository } from "../../../domain/repositories/IUserRepository";

export class BlockUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(userId: string): Promise<User> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error("Không tìm thấy thông tin người dùng.");
    }

    user.block();
    user.updateRefreshToken("");
    return this.userRepository.save(user);
  }
}
