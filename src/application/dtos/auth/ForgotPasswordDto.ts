export interface ForgotPasswordInputDto {
  email: string;
}

export interface VerifyResetOtpInputDto {
  email: string;
  otpCode: string;
}

export interface VerifyResetOtpResponseDto {
  resetToken: string;
}

export interface ResetPasswordInputDto {
  resetToken: string;
  newPassword: string;
}
