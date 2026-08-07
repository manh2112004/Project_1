import { Request, Response } from "express";
import { RegisterUseCase } from "../../application/use-cases/auth/RegisterUseCase";
import { LoginUseCase } from "../../application/use-cases/auth/LoginUseCase";
import { RefreshTokenUseCase } from "../../application/use-cases/auth/RefreshTokenUseCase";
import { SendOtpUseCase } from "../../application/use-cases/auth/SendOtpUseCase";
import { GoogleAuthUseCase } from "../../application/use-cases/auth/GoogleAuthUseCase";
import { ForgotPasswordUseCase } from "../../application/use-cases/auth/ForgotPasswordUseCase";
import { VerifyResetOtpUseCase } from "../../application/use-cases/auth/VerifyResetOtpUseCase";
import { ResetPasswordUseCase } from "../../application/use-cases/auth/ResetPasswordUseCase";
import { UserMapper } from "../../application/mappers/UserMapper";

export class AuthController {
  constructor(
    private readonly registerUseCase: RegisterUseCase,
    private readonly loginUseCase: LoginUseCase,
    private readonly refreshTokenUseCase: RefreshTokenUseCase,
    private readonly sendOtpUseCase?: SendOtpUseCase,
    private readonly googleAuthUseCase?: GoogleAuthUseCase,
    private readonly forgotPasswordUseCase?: ForgotPasswordUseCase,
    private readonly verifyResetOtpUseCase?: VerifyResetOtpUseCase,
    private readonly resetPasswordUseCase?: ResetPasswordUseCase,
  ) {}

  async googleLogin(req: Request, res: Response): Promise<void> {
    try {
      const { idToken } = req.body;
      if (!this.googleAuthUseCase) {
        throw new Error("Tính năng đăng nhập Google chưa được khởi tạo.");
      }
      const result = await this.googleAuthUseCase.execute(idToken);
      res.status(200).json({
        success: true,
        message: "Đăng nhập Google thành công",
        data: result,
      });
    } catch (error: any) {
      res.status(401).json({
        success: false,
        message: error.message || "Đăng nhập bằng Google thất bại",
      });
    }
  }

  async sendOtp(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.body;
      if (!this.sendOtpUseCase) {
        throw new Error("Tính năng gửi OTP chưa được khởi tạo.");
      }

      await this.sendOtpUseCase.execute(email);

      res.status(200).json({
        success: true,
        message:
          "Mã OTP xác thực đã được gửi đến email của bạn. Mã có hiệu lực trong 5 phút.",
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || "Gửi mã OTP thất bại",
      });
    }
  }

  async register(req: Request, res: Response): Promise<void> {
    try {
      const { email, password, fullName, phoneNumber, gender, otp } = req.body;
      const user = await this.registerUseCase.execute({
        email,
        password,
        fullName,
        phoneNumber,
        gender,
        otp,
      });

      res.status(201).json({
        success: true,
        message: "Đăng ký tài khoản thành công",
        data: UserMapper.toResponse(user),
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || "Đăng ký không thành công",
      });
    }
  }

  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      const result = await this.loginUseCase.execute({ email, password });

      res.status(200).json({
        success: true,
        message: "Đăng nhập thành công",
        data: result,
      });
    } catch (error: any) {
      res.status(401).json({
        success: false,
        message: error.message || "Đăng nhập thất bại",
      });
    }
  }

  async refreshToken(req: Request, res: Response): Promise<void> {
    try {
      const { refreshToken } = req.body;
      const result = await this.refreshTokenUseCase.execute(refreshToken);

      res.status(200).json({
        success: true,
        message: "Làm mới Access Token thành công",
        data: result,
      });
    } catch (error: any) {
      res.status(401).json({
        success: false,
        message: error.message || "Làm mới Token thất bại",
      });
    }
  }

  async forgotPassword(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.body;
      if (!this.forgotPasswordUseCase) {
        throw new Error("Tính năng quên mật khẩu chưa được khởi tạo.");
      }
      await this.forgotPasswordUseCase.execute({ email });

      res.status(200).json({
        success: true,
        message:
          "Nếu địa chỉ Email của bạn tồn tại trong hệ thống, chúng tôi đã gửi mã xác thực OTP khôi phục mật khẩu.",
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || "Yêu cầu khôi phục mật khẩu thất bại.",
      });
    }
  }

  async verifyResetOtp(req: Request, res: Response): Promise<void> {
    try {
      const { email, otpCode } = req.body;
      if (!this.verifyResetOtpUseCase) {
        throw new Error("Tính năng xác thực OTP chưa được khởi tạo.");
      }
      const result = await this.verifyResetOtpUseCase.execute({
        email,
        otpCode,
      });

      res.status(200).json({
        success: true,
        message: "Xác thực mã OTP thành công!",
        data: result,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || "Xác thực mã OTP thất bại.",
      });
    }
  }

  async resetPassword(req: Request, res: Response): Promise<void> {
    try {
      const { resetToken, newPassword } = req.body;
      if (!this.resetPasswordUseCase) {
        throw new Error("Tính năng đặt lại mật khẩu chưa được khởi tạo.");
      }
      await this.resetPasswordUseCase.execute({ resetToken, newPassword });

      res.status(200).json({
        success: true,
        message:
          "Đặt lại mật khẩu thành công! Vui lòng đăng nhập bằng mật khẩu mới.",
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || "Đặt lại mật khẩu thất bại.",
      });
    }
  }
}
