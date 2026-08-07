import { Repository, Like, FindOptionsWhere } from "typeorm";
import { Order } from "../../../domain/entities/Order";
import { OrderItem } from "../../../domain/entities/OrderItem";
import { OrderStatus, PaymentMethod, PaymentStatus } from "../../../domain/constant/OrderEnums";
import { IOrderRepository } from "../../../domain/repositories/IOrderRepository";
import { OrderOrmEntity } from "../../database/entities/OrderOrmEntity";
import { OrderItemOrmEntity } from "../../database/entities/OrderItemOrmEntity";

export class TypeOrmOrderRepository implements IOrderRepository {
  constructor(private readonly ormRepository: Repository<OrderOrmEntity>) {}

  async save(order: Order): Promise<Order> {
    const orm = this.toOrm(order);
    const saved = await this.ormRepository.save(orm);
    // Fetch với items relations để có đầy đủ dữ liệu
    const fullOrder = await this.ormRepository.findOne({
      where: { id: saved.id },
      relations: { items: true },
    });
    return this.toDomain(fullOrder || saved);
  }

  async findById(id: string): Promise<Order | null> {
    const found = await this.ormRepository.findOne({
      where: { id },
      relations: { items: true },
    });
    return found ? this.toDomain(found) : null;
  }

  async findByOrderCode(orderCode: string): Promise<Order | null> {
    const found = await this.ormRepository.findOne({
      where: { orderCode },
      relations: { items: true },
    });
    return found ? this.toDomain(found) : null;
  }

  async findByUserId(userId: string): Promise<Order[]> {
    const found = await this.ormRepository.find({
      where: { userId },
      relations: { items: true },
      order: { createdAt: "DESC" },
    });
    return found.map((item) => this.toDomain(item));
  }

  async findByUserIdPaginated(
    userId: string,
    page: number,
    limit: number
  ): Promise<{ orders: Order[]; totalCount: number }> {
    const skip = (page - 1) * limit;
    const [found, totalCount] = await this.ormRepository.findAndCount({
      where: { userId },
      relations: { items: true },
      order: { createdAt: "DESC" },
      take: limit,
      skip,
    });

    return {
      orders: found.map((item) => this.toDomain(item)),
      totalCount,
    };
  }

  async findAndCount(
    page: number,
    limit: number,
    search?: string,
    status?: OrderStatus
  ): Promise<{ orders: Order[]; totalCount: number }> {
    const skip = (page - 1) * limit;
    const whereConditions: FindOptionsWhere<OrderOrmEntity>[] = [];

    if (search && search.trim().length > 0) {
      const keyword = `%${search.trim()}%`;
      whereConditions.push(
        { orderCode: Like(keyword), ...(status ? { status } : {}) },
        { recipientName: Like(keyword), ...(status ? { status } : {}) },
        { phoneNumber: Like(keyword), ...(status ? { status } : {}) }
      );
    } else if (status) {
      whereConditions.push({ status });
    }

    const [found, totalCount] = await this.ormRepository.findAndCount({
      where: whereConditions.length > 0 ? whereConditions : undefined,
      relations: { items: true },
      order: { createdAt: "DESC" },
      take: limit,
      skip,
    });

    return {
      orders: found.map((item) => this.toDomain(item)),
      totalCount,
    };
  }

  private toDomain(orm: OrderOrmEntity): Order {
    const items = (orm.items || []).map(
      (itemOrm) =>
        new OrderItem({
          id: itemOrm.id,
          orderId: itemOrm.orderId,
          productId: itemOrm.productId,
          quantity: itemOrm.quantity,
          unitPrice: itemOrm.unitPrice,
          totalPrice: itemOrm.totalPrice,
          createdAt: itemOrm.createdAt,
        })
    );

    return new Order({
      id: orm.id,
      userId: orm.userId,
      orderCode: orm.orderCode,
      status: orm.status as OrderStatus,
      totalAmount: orm.totalAmount,
      discountAmount: orm.discountAmount,
      shippingFee: orm.shippingFee,
      finalAmount: orm.finalAmount,
      paymentMethod: orm.paymentMethod as PaymentMethod,
      paymentStatus: orm.paymentStatus as PaymentStatus,
      recipientName: orm.recipientName,
      phoneNumber: orm.phoneNumber,
      shippingAddress: orm.shippingAddress,
      shippingCode: orm.shippingCode,
      customerNote: orm.customerNote,
      cancelReason: orm.cancelReason,
      items,
      createdAt: orm.createdAt,
      updatedAt: orm.updatedAt,
      deletedAt: orm.deletedAt,
    });
  }

  private toOrm(domain: Order): OrderOrmEntity {
    const orm = new OrderOrmEntity();
    if (domain.id) orm.id = domain.id;
    orm.userId = domain.userId;
    orm.orderCode = domain.orderCode;
    orm.status = domain.status;
    orm.totalAmount = domain.totalAmount;
    orm.discountAmount = domain.discountAmount;
    orm.shippingFee = domain.shippingFee;
    orm.finalAmount = domain.finalAmount;
    orm.paymentMethod = domain.paymentMethod;
    orm.paymentStatus = domain.paymentStatus;
    orm.recipientName = domain.recipientName;
    orm.phoneNumber = domain.phoneNumber;
    orm.shippingAddress = domain.shippingAddress;
    orm.shippingCode = domain.shippingCode;
    orm.customerNote = domain.customerNote;
    orm.cancelReason = domain.cancelReason;
    orm.createdAt = domain.createdAt;
    orm.updatedAt = domain.updatedAt;
    orm.deletedAt = domain.deletedAt;

    if (domain.items && domain.items.length > 0) {
      orm.items = domain.items.map((itemDomain) => {
        const itemOrm = new OrderItemOrmEntity();
        if (itemDomain.id) itemOrm.id = itemDomain.id;
        if (domain.id) itemOrm.orderId = domain.id;
        itemOrm.productId = itemDomain.productId;
        itemOrm.quantity = itemDomain.quantity;
        itemOrm.unitPrice = itemDomain.unitPrice;
        itemOrm.totalPrice = itemDomain.totalPrice;
        itemOrm.createdAt = itemDomain.createdAt;
        return itemOrm;
      });
    }

    return orm;
  }
}
