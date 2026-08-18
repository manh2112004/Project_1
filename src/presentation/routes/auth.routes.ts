import { Router } from "express";
import { AppDataSource } from "../../infrastructure/database/data-source";
import { UserOrmEntity } from "../../infrastructure/database/entities/UserOrmEntity";
import { RoleOrmEntity } from "../../infrastructure/database/entities/RoleOrmEntity";
import { TypeOrmUserRepository } from "../../infrastructure/repositories/user/TypeOrmUserRepository";
import { TypeOrmRoleRepository } from "../../infrastructure/repositories/role/TypeOrmRoleRepository";
import { BcryptPasswordService } from "../../infrastructure/services/BcryptPasswordService";
import { JwtService } from "../../infrastructure/services/JwtService";
import { EmailService } from "../../infrastructure/services/EmailService";
import { redisClient } from "../../infrastructure/cache/redisClient";
import { RegisterUseCase } from "../../application/use-cases/auth/RegisterUseCase";
import { SendOtpUseCase } from "../../application/use-cases/auth/SendOtpUseCase";
import { LoginUseCase } from "../../application/use-cases/auth/LoginUseCase";
import { RefreshTokenUseCase } from "../../application/use-cases/auth/RefreshTokenUseCase";
import { GoogleAuthUseCase } from "../../application/use-cases/auth/GoogleAuthUseCase";
import { ForgotPasswordUseCase } from "../../application/use-cases/auth/ForgotPasswordUseCase";
import { VerifyResetOtpUseCase } from "../../application/use-cases/auth/VerifyResetOtpUseCase";
import { ResetPasswordUseCase } from "../../application/use-cases/auth/ResetPasswordUseCase";
import { AuthController } from "../controllers/AuthController";
import { loginRateLimiter, registerRateLimiter } from "../middlewares/rateLimiter";

export const authRouter = (): Router => {
  const router = Router();

  const userOrmRepository = AppDataSource.getRepository(UserOrmEntity);
  const roleOrmRepository = AppDataSource.getRepository(RoleOrmEntity);

  const userRepository = new TypeOrmUserRepository(userOrmRepository);
  const roleRepository = new TypeOrmRoleRepository(roleOrmRepository);
  const passwordService = new BcryptPasswordService();
  const jwtService = new JwtService();
  const emailService = new EmailService();

  const sendOtpUseCase = new SendOtpUseCase(
    userRepository,
    redisClient,
    emailService,
  );

  const registerUseCase = new RegisterUseCase(
    userRepository,
    roleRepository,
    passwordService,
    redisClient,
  );

  const loginUseCase = new LoginUseCase(
    userRepository,
    roleRepository,
    passwordService,
    jwtService,
  );

  const refreshTokenUseCase = new RefreshTokenUseCase(
    userRepository,
    roleRepository,
    jwtService,
  );

  const googleAuthUseCase = new GoogleAuthUseCase(
    userRepository,
    roleRepository,
    passwordService,
    jwtService,
  );

  const forgotPasswordUseCase = new ForgotPasswordUseCase(
    userRepository,
    redisClient,
    emailService,
  );

  const verifyResetOtpUseCase = new VerifyResetOtpUseCase(
    userRepository,
    redisClient,
  );

  const resetPasswordUseCase = new ResetPasswordUseCase(
    userRepository,
    passwordService,
    redisClient,
  );

  const authController = new AuthController(
    registerUseCase,
    loginUseCase,
    refreshTokenUseCase,
    sendOtpUseCase,
    googleAuthUseCase,
    forgotPasswordUseCase,
    verifyResetOtpUseCase,
    resetPasswordUseCase,
  );

  // Endpoint Đăng nhập qua Google OAuth2
  router.post("/google", (req, res) => authController.googleLogin(req, res));

  // Endpoint Gửi mã OTP xác thực qua Email khi đăng ký
  router.post("/send-otp", (req, res) => authController.sendOtp(req, res));

  // Endpoint Đăng ký tài khoản Khách hàng public
  router.post("/register", registerRateLimiter, (req, res) => authController.register(req, res));

  // Endpoint Đăng nhập tài khoản
  router.post("/login", loginRateLimiter, (req, res) => authController.login(req, res));

  // Endpoint Làm mới Access Token
  router.post("/refresh-token", (req, res) =>
    authController.refreshToken(req, res),
  );

  // Endpoint Quên Mật Khẩu & Đặt Lại Mật Khẩu
  router.post("/forgot-password", (req, res) =>
    authController.forgotPassword(req, res),
  );
  router.post("/verify-reset-otp", (req, res) =>
    authController.verifyResetOtp(req, res),
  );
  router.post("/reset-password", (req, res) =>
    authController.resetPassword(req, res),
  );

  return router;
};
