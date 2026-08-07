import { describe, it, expect } from "vitest";
import { OrderItem } from "../OrderItem";

describe("OrderItem Domain Entity", () => {
  const validProps = {
    orderId: "order-uuid-123",
    productId: "product-uuid-456",
    quantity: 3,
    unitPrice: 150000,
  };

  describe("create (Instantiation)", () => {
    it("nên tạo thành công OrderItem với thông tin hợp lệ", () => {
      const item = OrderItem.create(validProps);

      expect(item.id).toBeDefined();
      expect(item.orderId).toBe(validProps.orderId);
      expect(item.productId).toBe(validProps.productId);
      expect(item.quantity).toBe(3);
      expect(item.unitPrice).toBe(150000);
      expect(item.totalPrice).toBe(450000); // 3 * 150000 = 450000
      expect(item.createdAt).toBeInstanceOf(Date);
    });

    it("nên tự động tính totalPrice khi không truyền totalPrice trong constructor", () => {
      const item = new OrderItem({
        ...validProps,
        quantity: 2,
        unitPrice: 200000,
      });

      expect(item.totalPrice).toBe(400000);
    });

    it("nên ném lỗi khi số lượng (quantity) nhỏ hơn hoặc bằng 0", () => {
      expect(() => {
        OrderItem.create({ ...validProps, quantity: 0 });
      }).toThrowError("Số lượng phải lớn hơn 0.");

      expect(() => {
        OrderItem.create({ ...validProps, quantity: -2 });
      }).toThrowError("Số lượng phải lớn hơn 0.");
    });

    it("nên ném lỗi khi đơn giá (unitPrice) âm", () => {
      expect(() => {
        OrderItem.create({ ...validProps, unitPrice: -1000 });
      }).toThrowError("Đơn giá không được âm.");
    });
  });
});
