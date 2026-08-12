import { describe, it, expect } from "vitest";
import { Order } from "../Order";
import { OrderItem } from "../OrderItem";
import { OrderStatus, PaymentMethod, PaymentStatus } from "../../constant/OrderEnums";

describe("Order Domain Entity (Aggregate Root)", () => {
  const mockItem = OrderItem.create({
    orderId: "order-123",
    productId: "product-456",
    quantity: 2,
    unitPrice: 100000,
  });

  const validProps = {
    userId: "user-uuid-123",
    totalAmount: 200000,
    shippingFee: 30000,
    discountAmount: 20000,
    paymentMethod: PaymentMethod.COD,
    recipientName: "Nguyen Van A",
    phoneNumber: "0901234567",
    shippingAddress: "123 Đường Lê Lợi, Quận 1, TP. Hồ Chí Minh",
    items: [mockItem],
  };

  describe("create (Instantiation)", () => {
    it("nên tạo thành công đơn hàng mới với đầy đủ thông tin hợp lệ và tự động sinh orderCode", () => {
      const order = Order.create(validProps);

      expect(order.id).toBeDefined();
      expect(order.userId).toBe(validProps.userId);
      expect(order.orderCode).toBeDefined();
      expect(order.orderCode.startsWith("ORD-")).toBe(true);
      expect(order.status).toBe(OrderStatus.PENDING);
      expect(order.paymentStatus).toBe(PaymentStatus.UNPAID);
      expect(order.totalAmount).toBe(200000);
      expect(order.shippingFee).toBe(30000);
      expect(order.discountAmount).toBe(20000);
      expect(order.finalAmount).toBe(210000); // 200000 - 20000 + 30000 = 210000
      expect(order.paymentMethod).toBe(PaymentMethod.COD);
      expect(order.recipientName).toBe(validProps.recipientName);
      expect(order.phoneNumber).toBe(validProps.phoneNumber);
      expect(order.shippingAddress).toBe(validProps.shippingAddress);
      expect(order.items).toHaveLength(1);
      expect(order.createdAt).toBeInstanceOf(Date);
      expect(order.updatedAt).toBeInstanceOf(Date);
    });

    it("nên ném lỗi khi userId bị để trống", () => {
      expect(() => {
        Order.create({ ...validProps, userId: "" });
      }).toThrowError("Mã người dùng (userId) không được để trống.");

      expect(() => {
        Order.create({ ...validProps, userId: "   " });
      }).toThrowError("Mã người dùng (userId) không được để trống.");
    });

    it("nên ném lỗi khi recipientName bị để trống", () => {
      expect(() => {
        Order.create({ ...validProps, recipientName: "" });
      }).toThrowError("Tên người nhận không được để trống.");
    });

    it("nên ném lỗi khi phoneNumber bị để trống", () => {
      expect(() => {
        Order.create({ ...validProps, phoneNumber: "" });
      }).toThrowError("Số điện thoại nhận hàng không được để trống.");
    });

    it("nên ném lỗi khi shippingAddress bị để trống", () => {
      expect(() => {
        Order.create({ ...validProps, shippingAddress: "" });
      }).toThrowError("Địa chỉ giao hàng không được để trống.");
    });
  });

  describe("Nghiệp vụ chuyển trạng thái (State Machine)", () => {
    it("nên xác nhận đơn hàng thành công (confirm: PENDING -> PROCESSING)", () => {
      const order = Order.create(validProps);
      const initialUpdatedAt = order.updatedAt;

      order.confirm();

      expect(order.status).toBe(OrderStatus.PROCESSING);
      expect(order.updatedAt.getTime()).toBeGreaterThanOrEqual(
        initialUpdatedAt.getTime()
      );
    });

    it("nên ném lỗi khi confirm đơn hàng không ở trạng thái PENDING", () => {
      const order = Order.create(validProps);
      order.confirm(); // PENDING -> PROCESSING

      expect(() => {
        order.confirm(); // Lần 2 -> ném lỗi
      }).toThrowError(
        "Chỉ có thể xác nhận đơn hàng khi đơn đang ở trạng thái Chờ xử lý."
      );
    });

    it("nên bàn giao vận chuyển thành công (ship: PROCESSING -> SHIPPED)", () => {
      const order = Order.create(validProps);
      order.confirm();

      order.ship("GHN-123456");

      expect(order.status).toBe(OrderStatus.SHIPPED);
    });

    it("nên ném lỗi khi bàn giao vận chuyển khi chưa đóng gói xong (chưa PROCESSING)", () => {
      const order = Order.create(validProps);

      expect(() => {
        order.ship();
      }).toThrowError(
        "Đơn hàng phải được đóng gói xong mới có thể bàn giao vận chuyển."
      );
    });

    it("nên đánh dấu giao thành công (markAsDelivered: SHIPPED -> DELIVERED) và đổi COD sang PAID", () => {
      const order = Order.create(validProps); // paymentMethod = COD
      order.confirm();
      order.ship();

      order.markAsDelivered();

      expect(order.status).toBe(OrderStatus.DELIVERED);
      expect(order.paymentStatus).toBe(PaymentStatus.PAID);
    });

    it("nên ném lỗi khi markAsDelivered nếu đơn chưa giao đi (chưa SHIPPED)", () => {
      const order = Order.create(validProps);
      order.confirm();

      expect(() => {
        order.markAsDelivered();
      }).toThrowError(
        "Đơn hàng chưa được giao đi thì không thể đánh dấu Đã giao thành công."
      );
    });

    it("nên hủy đơn hàng thành công khi đơn chưa giao (cancel)", () => {
      const order = Order.create(validProps);

      order.cancel("Khách đổi ý không muốn mua nữa");

      expect(order.status).toBe(OrderStatus.CANCELLED);
      expect(order.cancelReason).toBe("Khách đổi ý không muốn mua nữa");
    });

    it("nên ném lỗi khi hủy đơn hàng đã giao đi (SHIPPED hoặc DELIVERED)", () => {
      const order = Order.create(validProps);
      order.confirm();
      order.ship();

      expect(() => {
        order.cancel("Hủy đơn");
      }).toThrowError(
        "Không thể hủy đơn hàng khi đã giao cho đơn vị vận chuyển."
      );
    });
  });

  describe("Nghiệp vụ Thanh toán (markAsPaid)", () => {
    it("nên đánh dấu thanh toán thành công và tự động chuyển PENDING -> PROCESSING", () => {
      const order = Order.create({
        ...validProps,
        paymentMethod: PaymentMethod.PAYOS,
      });

      order.markAsPaid();

      expect(order.paymentStatus).toBe(PaymentStatus.PAID);
      expect(order.status).toBe(OrderStatus.PROCESSING);
    });
  });

  describe("Nghiệp vụ Cập nhật địa chỉ nhận hàng (updateShippingInfo)", () => {
    it("nên cập nhật thành công thông tin người nhận khi đơn chưa giao", () => {
      const order = Order.create(validProps);

      order.updateShippingInfo(
        "Tran Van B",
        "0987654321",
        "456 Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh"
      );

      expect(order.recipientName).toBe("Tran Van B");
      expect(order.phoneNumber).toBe("0987654321");
      expect(order.shippingAddress).toBe(
        "456 Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh"
      );
    });

    it("nên ném lỗi khi cập nhật địa chỉ nếu đơn đã giao đi hoặc đã hủy", () => {
      const order = Order.create(validProps);
      order.confirm();
      order.ship();

      expect(() => {
        order.updateShippingInfo("Test", "0900000000", "New Address");
      }).toThrowError(
        "Không thể thay đổi địa chỉ khi đơn hàng đang được giao."
      );
    });
  });

  describe("Nghiệp vụ Mã giảm giá & Đổi giá (applyDiscount)", () => {
    it("nên áp dụng mã giảm giá và tính toán lại finalAmount chính xác", () => {
      const order = Order.create(validProps); // totalAmount: 200k, fee: 30k, discount: 20k => 210k

      order.applyDiscount(50000);

      expect(order.discountAmount).toBe(50000);
      expect(order.finalAmount).toBe(180000); // 200000 - 50000 + 30000 = 180000
    });

    it("nên ném lỗi khi áp dụng tiền giảm giá âm", () => {
      const order = Order.create(validProps);

      expect(() => {
        order.applyDiscount(-10000);
      }).toThrowError("Số tiền giảm giá không được âm.");
    });
  });

  describe("addItem", () => {
    it("nên thêm sản phẩm vào đơn hàng và tự động cập nhật totalAmount cũng như finalAmount", () => {
      const order = Order.create({
        userId: "user-123",
        recipientName: "Nguyen Van A",
        phoneNumber: "0901234567",
        shippingAddress: "123 Le Loi",
        paymentMethod: PaymentMethod.COD,
      });

      expect(order.items).toHaveLength(0);
      expect(order.totalAmount).toBe(0);

      order.addItem("prod-1", 2, 100000);

      expect(order.items).toHaveLength(1);
      expect(order.items[0].productId).toBe("prod-1");
      expect(order.items[0].quantity).toBe(2);
      expect(order.items[0].unitPrice).toBe(100000);
      expect(order.items[0].totalPrice).toBe(200000);
      expect(order.totalAmount).toBe(200000);
      expect(order.finalAmount).toBe(200000);
    });
  });
});
