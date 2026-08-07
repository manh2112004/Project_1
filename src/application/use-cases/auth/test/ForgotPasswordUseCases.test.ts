import { describe, it, expect, beforeEach, vi } from "vitest";
import { User } from "../../../../domain/entities/User";
import { IUserRepository } from "../../../../domain/repositories/IUserRepository";
import { IPasswordService } from "../../../services/IPasswordService";
import { EmailService } from "../../../../infrastructure/services/EmailService";
import { ForgotPasswordUseCase } from "../ForgotPasswordUseCase";
import { VerifyResetOtpUseCase } from "../VerifyResetOtpUseCase";
import { ResetPasswordUseCase } from "../ResetPasswordUseCase";
import { Redis } from "ioredis";

describe("Forgot Password 3-Stage Flow (Redis OTP & Reset Token)", () => {
  let mockUserRepository: Partial<IUserRepository>;
  let mockPasswordService: Partial<IPasswordService>;
  let mockRedis: Partial<Redis>;
  let mockEmailService: Partial<EmailService>;

  let forgotPasswordUseCase: ForgotPasswordUseCase;
  let verifyResetOtpUseCase: VerifyResetOtpUseCase;
  let resetPasswordUseCase: ResetPasswordUseCase;

  let existingUser: User;
  let redisStore: Map<string, string>;

  beforeEach(() => {
    redisStore = new Map<string, string>();

    existingUser = User.create({
      roleId: "role-1",
      email: "khachhang@gmail.com",
      passwordHash: "hashed_old_password",
      fullName: "Nguyễn Văn B",
      phoneNumber: "0908888888",
      gender: "MALE",
    });

    mockUserRepository = {
      findByEmail: vi.fn().mockImplementation(async (email: string) => {
        if (email === "khachhang@gmail.com") return existingUser;
        return null;
      }),
      save: vi.fn().mockImplementation(async (user: User) => user),
    };

    mockPasswordService = {
      hash: vi.fn().mockImplementation(async (plain: string) => `hashed_${plain}`),
    };

    mockRedis = {
      get: vi.fn().mockImplementation(async (key: string) => redisStore.get(key) || null),
      set: vi.fn().mockImplementation(async (key: string, val: string) => {
        redisStore.set(key, val);
        return "OK";
      }),
      ttl: vi.fn().mockResolvedValue(55),
      incr: vi.fn().mockResolvedValue(1),
      expire: vi.fn().mockResolvedValue(1),
      del: vi.fn().mockImplementation(async (key: string) => {
        redisStore.delete(key);
        return 1;
      }),
    };

    mockEmailService = {
      sendForgotPasswordOtpEmail: vi.fn().mockResolvedValue(undefined),
    };

    forgotPasswordUseCase = new ForgotPasswordUseCase(
      mockUserRepository as IUserRepository,
      mockRedis as Redis,
      mockEmailService as EmailService,
    );

    verifyResetOtpUseCase = new VerifyResetOtpUseCase(
      mockUserRepository as IUserRepository,
      mockRedis as Redis,
    );

    resetPasswordUseCase = new ResetPasswordUseCase(
      mockUserRepository as IUserRepository,
      mockPasswordService as IPasswordService,
      mockRedis as Redis,
    );
  });

  describe("ForgotPasswordUseCase (Stage 1)", () => {
    it("should generate OTP and save to Redis for existing user", async () => {
      await forgotPasswordUseCase.execute({ email: "khachhang@gmail.com" });

      const otpKey = `otp:forgot_pass:khachhang@gmail.com`;
      expect(redisStore.has(otpKey)).toBe(true);

      const otpCode = redisStore.get(otpKey);
      expect(otpCode).toHaveLength(6);
      expect(mockEmailService.sendForgotPasswordOtpEmail).toHaveBeenCalledWith(
        "khachhang@gmail.com",
        otpCode,
      );
    });

    it("should return gracefully without throwing error when email does not exist", async () => {
      await expect(
        forgotPasswordUseCase.execute({ email: "nonexistent@gmail.com" }),
      ).resolves.not.toThrow();

      expect(mockEmailService.sendForgotPasswordOtpEmail).not.toHaveBeenCalled();
    });
  });

  describe("VerifyResetOtpUseCase (Stage 2)", () => {
    it("should throw error if OTP is missing or expired", async () => {
      await expect(
        verifyResetOtpUseCase.execute({
          email: "khachhang@gmail.com",
          otpCode: "123456",
        }),
      ).rejects.toThrow("Mã OTP đã hết hạn hoặc không tồn tại.");
    });

    it("should throw error if OTP code is incorrect", async () => {
      redisStore.set("otp:forgot_pass:khachhang@gmail.com", "999999");

      await expect(
        verifyResetOtpUseCase.execute({
          email: "khachhang@gmail.com",
          otpCode: "111111",
        }),
      ).rejects.toThrow("Mã xác thực OTP không chính xác.");
    });

    it("should generate resetToken and remove OTP on correct OTP input", async () => {
      redisStore.set("otp:forgot_pass:khachhang@gmail.com", "654321");

      const result = await verifyResetOtpUseCase.execute({
        email: "khachhang@gmail.com",
        otpCode: "654321",
      });

      expect(result.resetToken).toBeDefined();
      expect(redisStore.has(`reset_token:${result.resetToken}`)).toBe(true);
      expect(redisStore.get(`reset_token:${result.resetToken}`)).toBe("khachhang@gmail.com");
      expect(redisStore.has("otp:forgot_pass:khachhang@gmail.com")).toBe(false);
    });
  });

  describe("ResetPasswordUseCase (Stage 3)", () => {
    it("should throw error if resetToken is invalid or expired", async () => {
      await expect(
        resetPasswordUseCase.execute({
          resetToken: "invalid-token",
          newPassword: "newpassword123",
        }),
      ).rejects.toThrow("Phiên làm việc đã hết hạn hoặc Mã Reset Token không hợp lệ. Vui lòng thực hiện lại từ đầu.");
    });

    it("should throw error if new password is too short (< 6 characters)", async () => {
      redisStore.set("reset_token:valid-token", "khachhang@gmail.com");

      await expect(
        resetPasswordUseCase.execute({
          resetToken: "valid-token",
          newPassword: "123",
        }),
      ).rejects.toThrow("Mật khẩu mới phải có ít nhất 6 ký tự.");
    });

    it("should reset password using resetToken, revoke refresh tokens, and cleanup Redis", async () => {
      redisStore.set("reset_token:valid-token", "khachhang@gmail.com");

      await resetPasswordUseCase.execute({
        resetToken: "valid-token",
        newPassword: "newpassword123",
      });

      expect(existingUser.passwordHash).toBe("hashed_newpassword123");
      expect(existingUser.refreshToken).toBeNull();
      expect(mockUserRepository.save).toHaveBeenCalled();
      expect(redisStore.has("reset_token:valid-token")).toBe(false);
    });
  });
});
