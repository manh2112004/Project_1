import { User } from "../../../domain/entities/User";
import { IUserRepository } from "../../../domain/repositories/IUserRepository";

export interface UpdateUserProfileDto {
  userId: string;
  fullName?: string;
  avatarUrl?: string;
  dateOfBirth?: Date;
  gender?: string;
  phoneNumber?: string;
}

export class UpdateUserProfileUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(dto: UpdateUserProfileDto): Promise<User> {
    const user = await this.userRepository.findById(dto.userId);
    if (!user) {
      throw new Error("Không tìm thấy thông tin người dùng.");
    }

    user.updateProfile({
      fullName: dto.fullName,
      avatarUrl: dto.avatarUrl,
      dateOfBirth: dto.dateOfBirth,
      gender: dto.gender,
      phoneNumber: dto.phoneNumber,
    });

    return this.userRepository.save(user);
  }
}
