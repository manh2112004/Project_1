import { Store } from "../../../domain/entities/Store";
import { IStoreRepository } from "../../../domain/repositories/IStoreRepository";
import { GetStoresQueryDto } from "../../dtos/store/StoreDto";

export class GetStoreByIdUseCase {
  constructor(private readonly storeRepository: IStoreRepository) {}

  async execute(id: string): Promise<Store> {
    const store = await this.storeRepository.findById(id);
    if (!store) {
      throw new Error("Không tìm thấy cửa hàng.");
    }
    return store;
  }
}

export class GetStoreByUserIdUseCase {
  constructor(private readonly storeRepository: IStoreRepository) {}

  async execute(userId: string): Promise<Store | null> {
    return await this.storeRepository.findByUserId(userId);
  }
}

export class GetStoresPaginatedUseCase {
  constructor(private readonly storeRepository: IStoreRepository) {}

  async execute(query: GetStoresQueryDto): Promise<{ stores: Store[]; totalCount: number }> {
    const page = query.page && query.page > 0 ? query.page : 1;
    const limit = query.limit && query.limit > 0 ? query.limit : 10;
    return await this.storeRepository.findAndCount(page, limit, query.search, query.status);
  }
}
