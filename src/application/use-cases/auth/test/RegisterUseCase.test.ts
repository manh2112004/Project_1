import { describe, it, expect, vi, beforeEach, Mocked } from "vitest";
import { RegisterUseCase } from "../RegisterUseCase";
import { User } from "../../../../domain/entities/User";
import { Role } from "../../../../domain/entities/Role";
import { IUserRepository } from "../../../../domain/repositories/IUserRepository";
import { IRoleRepository } from "../../../../domain/repositories/IRoleRepository";
import { IPasswordService } from "../../../services/IPasswordService";

describe("RegisterUseCase", () => {
  let userRepositoryMock: Mocked<IUserRepository>;
  let roleRepositoryMock: Mocked<IRoleRepository>;
  let passwordServiceMock: Mocked<IPasswordService>;
  let useCase: RegisterUseCase;

  const validDto = {
    email: "newuser@example.com",
    password: "Password123",
    fullName: "Nguyen Van A",
    phoneNumber: "0901234567",
    gender: "MALE",
  };

  const mockCustomerRole = new Role({
    id: "role-customer-uuid",
    name: "Khách hàng",
    code: "CUSTOMER",
    permissionCodes: [],
  });

  beforeEach(() => {
    userRepositoryMock = {
      save: vi.fn(),
      findById: vi.fn(),
      findByEmail: vi.fn(),
      findByPhoneNumber: vi.fn(),
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

    useCase = new RegisterUseCase(
      userRepositoryMock,
      roleRepositoryMock,
      passwordServiceMock
    );
  });

  it("nên đăng ký thành công người dùng mới với thông tin hợp lệ", async () => {
    // Mocking
    userRepositoryMock.findByEmail.mockResolvedValue(null);
    userRepositoryMock.findByPhoneNumber.mockResolvedValue(null);
    roleRepositoryMock.findByCode.mockResolvedValue(mockCustomerRole);
    passwordServiceMock.hash.mockResolvedValue("hashed_password_xyz");
    userRepositoryMock.save.mockImplementation((user: User) => Promise.resolve(user));

    const result = await useCase.execute(validDto);

    expect(result).toBeInstanceOf(User);
    expect(result.email).toBe("newuser@example.com");
    expect(result.passwordHash).toBe("hashed_password_xyz");
    expect(result.roleId).toBe("role-customer-uuid");
    expect(result.fullName).toBe("Nguyen Van A");
    expect(result.phoneNumber).toBe("0901234567");

    expect(userRepositoryMock.findByEmail).toHaveBeenCalledWith(validDto.email);
    expect(userRepositoryMock.findByPhoneNumber).toHaveBeenCalledWith(validDto.phoneNumber);
    expect(roleRepositoryMock.findByCode).toHaveBeenCalledWith("CUSTOMER");
    expect(passwordServiceMock.hash).toHaveBeenCalledWith(validDto.password);
    expect(userRepositoryMock.save).toHaveBeenCalled();
  });

  it("nên ném lỗi nếu email đã được sử dụng", async () => {
    const existingUser = User.create({
      roleId: "some-role",
      email: validDto.email,
      passwordHash: "hash",
      fullName: "Existing",
      gender: "MALE",
    });

    userRepositoryMock.findByEmail.mockResolvedValue(existingUser);

    await expect(useCase.execute(validDto)).rejects.toThrowError(
      "Email đã được sử dụng bởi một tài khoản khác."
    );

    expect(userRepositoryMock.save).not.toHaveBeenCalled();
  });

  it("nên ném lỗi nếu số điện thoại đã được sử dụng", async () => {
    const existingUser = User.create({
      roleId: "some-role",
      email: "other@example.com",
      passwordHash: "hash",
      fullName: "Existing",
      phoneNumber: validDto.phoneNumber,
      gender: "MALE",
    });

    userRepositoryMock.findByEmail.mockResolvedValue(null);
    userRepositoryMock.findByPhoneNumber.mockResolvedValue(existingUser);

    await expect(useCase.execute(validDto)).rejects.toThrowError(
      "Số điện thoại đã được sử dụng bởi một tài khoản khác."
    );

    expect(userRepositoryMock.save).not.toHaveBeenCalled();
  });

  it("nên ném lỗi nếu vai trò CUSTOMER không tồn tại trên hệ thống", async () => {
    userRepositoryMock.findByEmail.mockResolvedValue(null);
    userRepositoryMock.findByPhoneNumber.mockResolvedValue(null);
    roleRepositoryMock.findByCode.mockResolvedValue(null); // Không tìm thấy role

    await expect(useCase.execute(validDto)).rejects.toThrowError(
      "Vai trò khách hàng mặc định (CUSTOMER) không tồn tại trên hệ thống."
    );

    expect(userRepositoryMock.save).not.toHaveBeenCalled();
  });
});
