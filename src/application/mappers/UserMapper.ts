import { User } from "../../domain/entities/User";

export interface UserResponseDto {
  id: string;
  roleId: string;
  email: string;
  phoneNumber?: string;
  fullName: string;
  avatarUrl?: string;
  dateOfBirth?: Date;
  gender: string;
  status: string;
  emailVerifiedAt?: Date | null;
  phoneVerifiedAt?: Date | null;
  lastLoginAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export class UserMapper {
  public static toResponse(user: User): UserResponseDto {
    return {
      id: user.id,
      roleId: user.roleId,
      email: user.email,
      phoneNumber: user.phoneNumber,
      fullName: user.fullName,
      avatarUrl: user.avatarUrl,
      dateOfBirth: user.dateOfBirth,
      gender: user.gender,
      status: user.status,
      emailVerifiedAt: user.emailVerifiedAt,
      phoneVerifiedAt: user.phoneVerifiedAt,
      lastLoginAt: user.lastLoginAt,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  public static toResponseList(users: User[]): UserResponseDto[] {
    return users.map((user) => this.toResponse(user));
  }
}
