export interface RequestChangeEmailInputDto {
  newEmail: string;
  currentPassword?: string;
}

export interface RequestChangeEmailResponseDto {
  message: string;
}

export interface ConfirmChangeEmailInputDto {
  otpCode: string;
}
