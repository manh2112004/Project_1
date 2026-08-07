import { describe, it, expect, vi, beforeEach, Mocked } from "vitest";
import { LoginUseCase } from "../LoginUseCase";
import { User } from "../../../../domain/entities/User";
import { Role } from "../../../../domain/entities/Role";
import { IUserRepository } from "../../../../domain/repositories/IUserRepository";
import { IRoleRepository } from "../../../../domain/repositories/IRoleRepository";
import { IPasswordService } from "../../../services/IPasswordService";
import { IJwtService } from "../../../services/IJwtService";

describe("LoginUseCase", () => {
  let userRepositoryMock: Mocked<IUserRepository>;
  let roleRepositoryMock: Mocked<IRoleRepository>;
  let passwordServiceMock: Mocked<IPasswordService>;
  let jwtServiceMock: Mocked<IJwtService>;
  let useCase: LoginUseCase;

  const validDto = {
    email: "user@example.com",
    password: "Password123",
  };

  const mockUser = User.create({
    roleId: "role-customer-uuid",
    email: "user@example.com",
    passwordHash: "hashed_password_xyz",
    fullName: "Nguyen Van A",
    gender: "MALE",
  });

  const mockRole = new Role({
    id: "role-customer-uuid",
    name: "Khách hàng",
    code: "CUSTOMER",
    permissionCodes: ["VIEW_PRODUCT", "BUY_PRODUCT"],
  });

  beforeEach(() => {
    userRepositoryMock = {
      save: vi.fn(),
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
      generateToken: vi.fn(),
      verifyToken: vi.fn(),
    };

    useCase = new LoginUseCase(
      userRepositoryMock,
      roleRepositoryMock,
      passwordServiceMock,
      jwtServiceMock
    );
  });

  it("nên đăng nhập thành công và trả về cặp Token cùng thông tin User", async () => {
    userRepositoryMock.findByEmail.mockResolvedValue(mockUser);
    passwordServiceMock.compare.mockResolvedValue(true);
    roleRepositoryMock.findById.mockResolvedValue(mockRole);
    jwtServiceMock.generateToken
      .mockReturnValueOnce("access_token_token")
      .mockReturnValueOnce("refresh_token_token");
    userRepositoryMock.save.mockImplementation((user: User) => Promise.resolve(user));

    const result = await useCase.execute(validDto);

    expect(result.accessToken).toBe("access_token_token");
    expect(result.refreshToken).toBe("refresh_token_token");
    expect(result.user).toEqual({
      id: mockUser.id,
      email: "user@example.com",
      fullName: "Nguyen Van A",
      roleCode: "CUSTOMER",
      permissions: ["VIEW_PRODUCT", "BUY_PRODUCT"],
    });

    expect(mockUser.refreshToken).toBe("refresh_token_token");
    expect(mockUser.lastLoginAt).toBeInstanceOf(Date);
    expect(userRepositoryMock.save).toHaveBeenCalledWith(mockUser);
  });

  it("nên ném lỗi nếu không tìm thấy email người dùng", async () => {
    userRepositoryMock.findByEmail.mockResolvedValue(null);

    await expect(useCase.execute(validDto)).rejects.toThrowError(
      "Email hoặc mật khẩu không chính xác."
    );

    expect(passwordServiceMock.compare).not.toHaveBeenCalled();
    expect(userRepositoryMock.save).not.toHaveBeenCalled();
  });

  it("nên ném lỗi nếu tài khoản bị khóa (BLOCKED)", async () => {
    const blockedUser = User.create({
      roleId: "role-customer-uuid",
      email: "blocked@example.com",
      passwordHash: "hash",
      fullName: "Blocked User",
      gender: "MALE",
    });
    blockedUser.block(); // Đổi sang BLOCKED

    userRepositoryMock.findByEmail.mockResolvedValue(blockedUser);

    await expect(useCase.execute({ ...validDto, email: "blocked@example.com" })).rejects.toThrowError(
      "Tài khoản của bạn đã bị khóa. Vui lòng liên hệ quản trị viên."
    );

    expect(passwordServiceMock.compare).not.toHaveBeenCalled();
    expect(userRepositoryMock.save).not.toHaveBeenCalled();
  });

  it("nên ném lỗi nếu mật khẩu không trùng khớp", async () => {
    userRepositoryMock.findByEmail.mockResolvedValue(mockUser);
    passwordServiceMock.compare.mockResolvedValue(false); // Sai mật khẩu

    await expect(useCase.execute(validDto)).rejects.toThrowError(
      "Email hoặc mật khẩu không chính xác."
    );

    expect(roleRepositoryMock.findById).not.toHaveBeenCalled();
    expect(userRepositoryMock.save).not.toHaveBeenCalled();
  });

  it("nên ném lỗi nếu tài khoản đăng ký bằng Google (passwordHash là null)", async () => {
    const googleUser = User.create({
      roleId: "role-customer-uuid",
      email: "googleuser@example.com",
      passwordHash: null,
      fullName: "Google User",
      gender: "MALE",
    });

    userRepositoryMock.findByEmail.mockResolvedValue(googleUser);

    await expect(
      useCase.execute({ email: "googleuser@example.com", password: "Password123" })
    ).rejects.toThrowError(
      "Tài khoản này được đăng ký qua bên thứ 3 (Google). Vui lòng chọn 'Đăng nhập bằng Google'."
    );

    expect(passwordServiceMock.compare).not.toHaveBeenCalled();
  });

  it("nên ném lỗi nếu không tìm thấy vai trò tương ứng với người dùng", async () => {
    userRepositoryMock.findByEmail.mockResolvedValue(mockUser);
    passwordServiceMock.compare.mockResolvedValue(true);
    roleRepositoryMock.findById.mockResolvedValue(null); // Không thấy role

    await expect(useCase.execute(validDto)).rejects.toThrowError(
      "Vai trò của người dùng không hợp lệ hoặc đã bị xóa."
    );

    expect(jwtServiceMock.generateToken).not.toHaveBeenCalled();
    expect(userRepositoryMock.save).not.toHaveBeenCalled();
  });
});

