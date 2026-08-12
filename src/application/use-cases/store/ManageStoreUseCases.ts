import { Store } from "../../../domain/entities/Store";
import { IStoreRepository } from "../../../domain/repositories/IStoreRepository";
import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { IRoleRepository } from "../../../domain/repositories/IRoleRepository";
import {
  UpdateStoreProfileDto,
  UpdateStoreLegalInfoDto,
  SuspendStoreDto,
  RejectStoreDto,
} from "../../dtos/store/StoreDto";

export class UpdateStoreProfileUseCase {
  constructor(private readonly storeRepository: IStoreRepository) { }

  async execute(storeId: string, dto: UpdateStoreProfileDto): Promise<Store> {
    const store = await this.storeRepository.findById(storeId);
    if (!store) {
      throw new Error("Không tìm thấy cửa hàng.");
    }

    // Kiểm tra nếu đổi tên thì tên mới có bị trùng không
    if (dto.name && dto.name.trim() !== store.name) {
      const existing = await this.storeRepository.findByName(dto.name);
      if (existing && existing.id !== storeId) {
        throw new Error(
          "Tên cửa hàng đã tồn tại trên hệ thống. Vui lòng chọn tên khác.",
        );
      }
    }

    store.updateProfile({
      name: dto.name,
      description: dto.description,
      logo: dto.logo,
      coverImage: dto.coverImage,
    });

    return await this.storeRepository.save(store);
  }
}

export class ApproveStoreUseCase {
  constructor(
    private readonly storeRepository: IStoreRepository,
    private readonly userRepository?: IUserRepository,
    private readonly roleRepository?: IRoleRepository,
  ) { }

  async execute(storeId: string): Promise<Store> {
    const store = await this.storeRepository.findById(storeId);
    if (!store) {
      throw new Error("Không tìm thấy cửa hàng.");
    }

    store.approve();
    const savedStore = await this.storeRepository.save(store);

    if (this.userRepository && this.roleRepository) {
      try {
        const user = await this.userRepository.findById(store.userId);
        let sellerRole =
          (await this.roleRepository.findByCode("SELLER")) ||
          (await this.roleRepository.findByName("Seller"));

        if (user && sellerRole) {
          user.changeRole(sellerRole.id);
          await this.userRepository.save(user);
        }
      } catch (err) {
        console.warn(
          "Không thể nâng cấp vai trò chủ store thành SELLER khi duyệt:",
          err,
        );
      }
    }

    return savedStore;
  }
}

export class SuspendStoreUseCase {
  constructor(private readonly storeRepository: IStoreRepository) { }

  async execute(storeId: string, dto: SuspendStoreDto): Promise<Store> {
    const store = await this.storeRepository.findById(storeId);
    if (!store) {
      throw new Error("Không tìm thấy cửa hàng.");
    }

    store.suspend(dto.reason);
    return await this.storeRepository.save(store);
  }
}

export class RejectStoreUseCase {
  constructor(private readonly storeRepository: IStoreRepository) { }

  async execute(storeId: string, dto: RejectStoreDto): Promise<Store> {
    const store = await this.storeRepository.findById(storeId);
    if (!store) {
      throw new Error("Không tìm thấy cửa hàng.");
    }

    store.reject(dto.reason);
    return await this.storeRepository.save(store);
  }
}

export class ReactivateStoreUseCase {
  constructor(private readonly storeRepository: IStoreRepository) { }

  async execute(storeId: string): Promise<Store> {
    const store = await this.storeRepository.findById(storeId);
    if (!store) {
      throw new Error("Không tìm thấy cửa hàng.");
    }

    store.reactivate();
    return await this.storeRepository.save(store);
  }
}

export class ToggleVacationModeUseCase {
  constructor(private readonly storeRepository: IStoreRepository) { }

  async execute(storeId: string, isOnVacation: boolean): Promise<Store> {
    const store = await this.storeRepository.findById(storeId);
    if (!store) {
      throw new Error("Không tìm thấy cửa hàng.");
    }

    if (isOnVacation) {
      store.enableVacationMode();
    } else {
      store.disableVacationMode();
    }

    return await this.storeRepository.save(store);
  }
}

export class UpdateStoreLegalInfoUseCase {
  constructor(private readonly storeRepository: IStoreRepository) { }

  async execute(storeId: string, dto: UpdateStoreLegalInfoDto): Promise<Store> {
    const store = await this.storeRepository.findById(storeId);
    if (!store) {
      throw new Error("Không tìm thấy cửa hàng.");
    }

    if (dto.taxCode && dto.taxCode.trim().length > 0) {
      const existingTax = await this.storeRepository.findByTaxCode(dto.taxCode);
      if (existingTax && existingTax.id !== storeId) {
        throw new Error("Mã số thuế này đã được đăng ký bởi cửa hàng khác.");
      }
    }

    if (dto.identityNumber && dto.identityNumber.trim().length > 0) {
      const existingId = await this.storeRepository.findByIdentityNumber(
        dto.identityNumber,
      );
      if (existingId && existingId.id !== storeId) {
        throw new Error("Số CCCD/CMND này đã được đăng ký bởi cửa hàng khác.");
      }
    }

    store.updateLegalInfo(dto.taxCode, dto.identityNumber);
    return await this.storeRepository.save(store);
  }
}
