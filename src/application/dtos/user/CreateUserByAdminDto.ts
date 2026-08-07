export interface CreateUserByAdminDto {
  roleId: string;
  email: string;
  password: string;
  fullName: string;
  phoneNumber?: string;
  gender: string;
  avatarUrl?: string;
}
