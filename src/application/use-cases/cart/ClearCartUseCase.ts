import { ICartRepository } from "../../../domain/repositories/ICartRepository";

export class ClearCartUseCase {
  constructor(private readonly cartRepository: ICartRepository) {}

  async execute(userId: string): Promise<void> {
    await this.cartRepository.clearByUserId(userId);
  }
}
