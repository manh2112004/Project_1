import { Request, Response } from "express";
import { RegisterUseCase } from "../../application/use-cases/auth/RegisterUseCase";
import { LoginUseCase } from "../../application/use-cases/auth/LoginUseCase";
import { RefreshTokenUseCase } from "../../application/use-cases/auth/RefreshTokenUseCase";
import { SendOtpUseCase } from "../../application/use-cases/auth/SendOtpUseCase";
import { GoogleAuthUseCase } from "../../application/use-cases/auth/GoogleAuthUseCase";
import { UserMapper } from "../../application/mappers/UserMapper";

export class AuthController {
  constructor(
    private readonly registerUseCase: RegisterUseCase,
    private readonly loginUseCase: LoginUseCase,
    private readonly refreshTokenUseCase: RefreshTokenUseCase,
    private readonly sendOtpUseCase?: SendOtpUseCase,
    private readonly googleAuthUseCase?: GoogleAuthUseCase,
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
}
