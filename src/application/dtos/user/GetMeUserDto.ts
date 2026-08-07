export interface GetMeUserDto {
  id?: string;
  roleId: string;
  email: string;
  phoneNumber?: string;
  fullName: string;
  avatarUrl?: string;
  dateOfBirth?: Date;
  gender: string;
  status?: string;
}
