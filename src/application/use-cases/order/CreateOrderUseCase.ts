import { IInventoryRepository } from "../../../domain/repositories/IInventoryRepository";
import { IProductRepository } from "../../../domain/repositories/IProductRepository";
import { RedisCartRepository } from "../../../infrastructure/repositories/cart/RedisCartRepository";
import { Order } from "../../../domain/entities/Order";
import {
  CreateOrderDto,
  CreateOrderResponseDto,
} from "../../dtos/order/CreateOrderDto";
import { IOrderRepository } from "../../../domain/repositories/IOrderRepository";
import { AppDataSource } from "../../../infrastructure/database/data-source";

export class CreateOrderUseCase {
  constructor(
    private readonly cartRepository: RedisCartRepository,
    private readonly inventoryRepositoty: IInventoryRepository,
    private readonly productRepository: IProductRepository,
    private readonly orderRepository: IOrderRepository,
  ) {}

  async execute(dto: CreateOrderDto): Promise<CreateOrderResponseDto> {
    // 1. Lấy giỏ hàng của người dùng
    const cart = await this.cartRepository.findByUserId(dto.userId);
    if (!cart || cart.isEmpty) {
      throw new Error("Người dùng chưa có giỏ hàng hoặc giỏ hàng đang rỗng.");
    }

    // 2. Xác định danh sách sản phẩm được chọn mua
    const itemsToOrder =
      dto.productIds && dto.productIds.length > 0
        ? cart.items.filter((item) => dto.productIds!.includes(item.productId))
        : cart.items;

    if (itemsToOrder.length === 0) {
      throw new Error("Không tìm thấy sản phẩm chọn mua trong giỏ hàng.");
    }

    const targetProductIds = itemsToOrder.map((item) => item.productId);

    // Lấy danh sách sản phẩm từ DB trước khi vào Transaction để tránh giữ Connection quá lâu
    const dbProducts = await this.productRepository.findByIds(targetProductIds);

    //  KHÓA BI QUAN (Pessimistic Write Lock / SELECT FOR UPDATE) TRONG DATABASE TRANSACTION
    return await AppDataSource.transaction(
      async (transactionalEntityManager) => {
        // 3. Khóa dòng tồn kho trong DB bằng SELECT FOR UPDATE
        const inventories =
          await this.inventoryRepositoty.findByProductIdsWithLock(
            targetProductIds,
            transactionalEntityManager,
          );

        let isPriceChanged = false;
        const changedItems: {
          productId: string;
          oldPrice: number;
          newPrice: number;
        }[] = [];

        // 4. Kiểm tra tồn kho và thay đổi giá cho các sản phẩm được chọn
        for (const item of itemsToOrder) {
          const inventory = inventories.find(
            (inv) => inv.productId === item.productId,
          );
          if (!inventory) {
            throw new Error(
              `Sản phẩm ${item.productId} không tồn tại trong kho hàng.`,
            );
          }
          if (inventory.quantity < item.quantity) {
            throw new Error(
              `Sản phẩm ${item.productId} không đủ số lượng tồn kho.`,
            );
          }

          const dbProduct = dbProducts.find((p) => p.id === item.productId);
          if (!dbProduct) {
            throw new Error(
              `Sản phẩm ${item.productId} không còn tồn tại trên hệ thống.`,
            );
          }

          // Xác định giá hiện tại (ưu tiên giá khuyến mãi nếu có)
          const currentPrice = dbProduct.discountPrice ?? dbProduct.price;

          if (item.price !== currentPrice) {
            isPriceChanged = true;
            changedItems.push({
              productId: item.productId,
              oldPrice: item.price,
              newPrice: currentPrice,
            });
            item.updatePrice(currentPrice);
          }
        }

        // 5. Nếu có sản phẩm đổi giá -> Cập nhật lại giỏ hàng và báo lỗi
        if (isPriceChanged) {
          await this.cartRepository.save(cart);
          throw new Error(
            "Giá sản phẩm đã có sự thay đổi so với ban đầu. Giỏ hàng đã được cập nhật lại giá mới.",
          );
        }

        // 6. Tạo đơn hàng mới (Order)
        const order = Order.create({
          userId: dto.userId,
          paymentMethod: dto.paymentMethod,
          recipientName: dto.recipientName,
          phoneNumber: dto.phoneNumber,
          shippingAddress: dto.shippingAddress,
          customerNote: dto.customerNote,
        });

        // 7. Thêm các sản phẩm chọn mua vào đơn hàng và trừ kho tồn tương ứng
        for (const item of itemsToOrder) {
          order.addItem(item.productId, item.quantity, item.price);
          const inventory = inventories.find(
            (inv) => inv.productId === item.productId,
          );
          if (inventory) {
            inventory.deductQuantity(item.quantity);
            await this.inventoryRepositoty.save(
              inventory,
              transactionalEntityManager,
            );
          }
        }

        // 8. Lưu đơn hàng vào DB trong cùng Transaction
        const savedOrder = await this.orderRepository.save(
          order,
          transactionalEntityManager,
        );

        // 9. Xóa các sản phẩm ĐÃ MUA ra khỏi giỏ hàng
        if (dto.productIds && dto.productIds.length > 0) {
          for (const item of itemsToOrder) {
            cart.removeItem(item.productId);
          }
        } else {
          cart.clear();
        }
        await this.cartRepository.save(cart);

        // 10. Trả về Response DTO
        return {
          id: savedOrder.id,
          userId: savedOrder.userId,
          orderCode: savedOrder.orderCode,
          status: savedOrder.status,
          totalAmount: savedOrder.totalAmount,
          discountAmount: savedOrder.discountAmount,
          shippingFee: savedOrder.shippingFee,
          finalAmount: savedOrder.finalAmount,
          paymentMethod: savedOrder.paymentMethod,
          paymentStatus: savedOrder.paymentStatus,
          recipientName: savedOrder.recipientName,
          phoneNumber: savedOrder.phoneNumber,
          shippingAddress: savedOrder.shippingAddress,
          shippingCode: savedOrder.shippingCode,
          customerNote: savedOrder.customerNote,
          cancelReason: savedOrder.cancelReason,
          items: savedOrder.items.map((item) => ({
            id: item.id,
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            totalPrice: item.totalPrice,
            createdAt: item.createdAt,
          })),
          createdAt: savedOrder.createdAt,
          updatedAt: savedOrder.updatedAt,
        };
      },
    );
  }
}
