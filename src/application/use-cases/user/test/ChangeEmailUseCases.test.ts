import { describe, it, expect, beforeEach, vi } from "vitest";
import { User } from "../../../../domain/entities/User";
import { IUserRepository } from "../../../../domain/repositories/IUserRepository";
import { IPasswordService } from "../../../services/IPasswordService";
import { EmailService } from "../../../../infrastructure/services/EmailService";
import { RequestChangeUserEmailUseCase } from "../RequestChangeUserEmailUseCase";
import { ConfirmChangeUserEmailUseCase } from "../ConfirmChangeUserEmailUseCase";
import { Redis } from "ioredis";

describe("Change User Email Use Cases (Redis OTP Flow)", () => {
  let mockUserRepository: Partial<IUserRepository>;
  let mockPasswordService: Partial<IPasswordService>;
  let mockRedis: Partial<Redis>;
  let mockEmailService: Partial<EmailService>;

  let requestUseCase: RequestChangeUserEmailUseCase;
  let confirmUseCase: ConfirmChangeUserEmailUseCase;

  let existingUser: User;
  let redisStore: Map<string, string>;

  beforeEach(() => {
    redisStore = new Map<string, string>();

    existingUser = User.create({
      roleId: "role-1",
      email: "user.old@gmail.com",
      passwordHash: "hashed_password123",
      fullName: "Nguyễn Văn A",
      phoneNumber: "0901234567",
      gender: "MALE",
    });

    mockUserRepository = {
      findById: vi.fn().mockImplementation(async (id: string) => {
        return id === existingUser.id ? existingUser : null;
      }),
      findByEmail: vi.fn().mockImplementation(async (email: string) => {
        if (email === "user.old@gmail.com") return existingUser;
        if (email === "already.taken@gmail.com") {
          return User.create({
            roleId: "role-1",
            email: "already.taken@gmail.com",
            passwordHash: "hashed_password123",
            fullName: "Người dùng khác",
            phoneNumber: "0909999999",
            gender: "FEMALE",
          });
        }
        return null;
      }),
      save: vi.fn().mockImplementation(async (user: User) => user),
    };

    mockPasswordService = {
      compare: vi.fn().mockImplementation(async (plain: string, hash: string) => {
        return plain === "password123";
      }),
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
      sendChangeEmailOtp: vi.fn().mockResolvedValue(undefined),
    };

    requestUseCase = new RequestChangeUserEmailUseCase(
      mockUserRepository as IUserRepository,
      mockPasswordService as IPasswordService,
      mockRedis as Redis,
      mockEmailService as EmailService,
    );

    confirmUseCase = new ConfirmChangeUserEmailUseCase(
      mockUserRepository as IUserRepository,
      mockRedis as Redis,
    );
  });

  describe("RequestChangeUserEmailUseCase", () => {
    it("should throw error if new email is identical to current email", async () => {
      await expect(
        requestUseCase.execute({
          userId: existingUser.id,
          newEmail: "user.old@gmail.com",
        }),
      ).rejects.toThrow("Địa chỉ Email mới phải khác địa chỉ Email hiện tại của bạn.");
    });

    it("should throw error if new email is already taken by another user", async () => {
      await expect(
        requestUseCase.execute({
          userId: existingUser.id,
          newEmail: "already.taken@gmail.com",
          currentPassword: "password123",
        }),
      ).rejects.toThrow("Địa chỉ Email này đã được sử dụng bởi một tài khoản khác.");
    });

    it("should throw error if current password is incorrect", async () => {
      await expect(
        requestUseCase.execute({
          userId: existingUser.id,
          newEmail: "new.user@gmail.com",
          currentPassword: "wrongpassword",
        }),
      ).rejects.toThrow("Mật khẩu hiện tại không chính xác.");
    });

    it("should generate OTP and save to Redis on valid request", async () => {
      await requestUseCase.execute({
        userId: existingUser.id,
        newEmail: "user.new@gmail.com",
        currentPassword: "password123",
      });

      const redisKey = `otp:change_email:${existingUser.id}`;
      expect(redisStore.has(redisKey)).toBe(true);

      const raw = redisStore.get(redisKey);
      const parsed = JSON.parse(raw!);
      expect(parsed.newEmail).toBe("user.new@gmail.com");
      expect(parsed.otpCode).toHaveLength(6);

      expect(mockEmailService.sendChangeEmailOtp).toHaveBeenCalledWith(
        "user.new@gmail.com",
        parsed.otpCode,
      );
    });
  });

  describe("ConfirmChangeUserEmailUseCase", () => {
    it("should throw error if OTP in Redis is expired or missing", async () => {
      await expect(
        confirmUseCase.execute({
          userId: existingUser.id,
          otpCode: "123456",
        }),
      ).rejects.toThrow("Mã OTP đã hết hạn hoặc không tồn tại.");
    });

    it("should throw error if OTP code does not match", async () => {
      redisStore.set(
        `otp:change_email:${existingUser.id}`,
        JSON.stringify({ newEmail: "user.new@gmail.com", otpCode: "654321" }),
      );

      await expect(
        confirmUseCase.execute({
          userId: existingUser.id,
          otpCode: "111111",
        }),
      ).rejects.toThrow("Mã xác thực OTP không chính xác.");
    });

    it("should successfully update user email and remove Redis key on valid OTP", async () => {
      redisStore.set(
        `otp:change_email:${existingUser.id}`,
        JSON.stringify({ newEmail: "user.new@gmail.com", otpCode: "888888" }),
      );

      const updatedUser = await confirmUseCase.execute({
        userId: existingUser.id,
        otpCode: "888888",
      });

      expect(updatedUser.email).toBe("user.new@gmail.com");
      expect(updatedUser.emailVerifiedAt).not.toBeNull();
      expect(mockUserRepository.save).toHaveBeenCalled();
      expect(redisStore.has(`otp:change_email:${existingUser.id}`)).toBe(false);
    });
  });
});
