import { IUserRepository } from "../../../domain/repositories/IUserRepository";

export class DeleteUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(id: string): Promise<void> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new Error("Không tìm thấy người dùng để xóa.");
    }

    // Sử dụng trực tiếp phương thức delete() kế thừa từ Entity trong Domain
    user.delete();
    await this.userRepository.save(user);
  }
}
