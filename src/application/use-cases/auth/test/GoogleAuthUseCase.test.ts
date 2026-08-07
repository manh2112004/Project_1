import { describe, it, expect, vi, beforeEach, Mocked } from "vitest";
import { GoogleAuthUseCase } from "../GoogleAuthUseCase";
import { User } from "../../../../domain/entities/User";
import { Role } from "../../../../domain/entities/Role";
import { IUserRepository } from "../../../../domain/repositories/IUserRepository";
import { IRoleRepository } from "../../../../domain/repositories/IRoleRepository";
import { IPasswordService } from "../../../services/IPasswordService";
import { IJwtService } from "../../../services/IJwtService";

// Mock OAuth2Client của google-auth-library
vi.mock("google-auth-library", () => {
  const MockOAuth2Client = vi.fn().mockImplementation(function (this: any) {
    this.verifyIdToken = vi.fn();
    return this;
  });
  return {
    OAuth2Client: MockOAuth2Client,
  };
});

describe("GoogleAuthUseCase", () => {
  let userRepositoryMock: Mocked<IUserRepository>;
  let roleRepositoryMock: Mocked<IRoleRepository>;
  let passwordServiceMock: Mocked<IPasswordService>;
  let jwtServiceMock: Mocked<IJwtService>;
  let useCase: GoogleAuthUseCase;

  const mockCustomerRole = new Role({
    id: "role-customer-uuid",
    name: "Khách hàng",
    code: "CUSTOMER",
    permissionCodes: ["VIEW_PRODUCT"],
  });

  beforeEach(() => {
    userRepositoryMock = {
      save: vi.fn().mockImplementation((user) => Promise.resolve(user)),
      findById: vi.fn(),
      findByEmail: vi.fn(),
      findByPhoneNumber: vi.fn(),
      findBySocialAccount: vi.fn(),
      findAndCount: vi.fn(),
    } as any;

    roleRepositoryMock = {
      save: vi.fn(),
      findById: vi.fn(),
      findAll: vi.fn(),
      findByName: vi.fn(),
      findByCode: vi.fn(),
      findAndCount: vi.fn(),
    } as any;

    passwordServiceMock = {
      hash: vi.fn(),
      compare: vi.fn(),
    };

    jwtServiceMock = {
      generateToken: vi.fn().mockReturnValue("mock_token"),
      verifyToken: vi.fn(),
    };

    useCase = new GoogleAuthUseCase(
      userRepositoryMock,
      roleRepositoryMock,
      passwordServiceMock,
      jwtServiceMock
    );
  });

  it("nên ném lỗi nếu token bị trống", async () => {
    await expect(useCase.execute("")).rejects.toThrowError(
      "Mã Google ID Token không được để trống."
    );
  });

  it("nên đăng ký user mới với passwordHash = null và tạo bản ghi UserSocialAccount khi chưa có tài khoản", async () => {
    const mockTicket = {
      getPayload: () => ({
        email: "newgoogleuser@example.com",
        name: "Google User",
        picture: "https://example.com/avatar.jpg",
        sub: "google-sub-12345",
        email_verified: true,
      }),
    };

    (useCase as any).googleClient.verifyIdToken = vi.fn().mockResolvedValue(mockTicket);
    userRepositoryMock.findBySocialAccount.mockResolvedValue(null);
    userRepositoryMock.findByEmail.mockResolvedValue(null);
    roleRepositoryMock.findByCode.mockResolvedValue(mockCustomerRole);
    roleRepositoryMock.findById.mockResolvedValue(mockCustomerRole);

    const result = await useCase.execute("valid_id_token");

    expect(result.user.email).toBe("newgoogleuser@example.com");
    expect(userRepositoryMock.save).toHaveBeenCalled();

    // Check captured saved user
    const savedUserCall = userRepositoryMock.save.mock.calls[0][0] as User;
    expect(savedUserCall.passwordHash).toBeNull();
    expect(savedUserCall.hasSocialAccount("GOOGLE", "google-sub-12345")).toBe(true);
  });
});
