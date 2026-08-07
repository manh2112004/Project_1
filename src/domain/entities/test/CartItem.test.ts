import { describe, it, expect } from "vitest";
import { CartItem } from "../CartItem";

describe("CartItem Domain Entity", () => {
  const validProps = {
    cartId: "cart-uuid-123",
    productId: "product-uuid-456",
    quantity: 2,
    price: 150000,
  };

  describe("create (Instantiation)", () => {
    it("nên tạo thành công CartItem với thông tin hợp lệ", () => {
      const item = CartItem.create(validProps);

      expect(item.id).toBeDefined();
      expect(item.cartId).toBe(validProps.cartId);
      expect(item.productId).toBe(validProps.productId);
      expect(item.quantity).toBe(2);
      expect(item.price).toBe(150000);
      expect(item.createdAt).toBeInstanceOf(Date);
      expect(item.updatedAt).toBeInstanceOf(Date);
    });

    it("nên ném lỗi khi cartId bị để trống", () => {
      expect(() => {
        CartItem.create({ ...validProps, cartId: "" });
      }).toThrowError("Mã giỏ hàng (cartId) không được để trống.");

      expect(() => {
        CartItem.create({ ...validProps, cartId: "   " });
      }).toThrowError("Mã giỏ hàng (cartId) không được để trống.");
    });

    it("nên ném lỗi khi productId bị để trống", () => {
      expect(() => {
        CartItem.create({ ...validProps, productId: "" });
      }).toThrowError("Mã sản phẩm (productId) không được để trống.");

      expect(() => {
        CartItem.create({ ...validProps, productId: "   " });
      }).toThrowError("Mã sản phẩm (productId) không được để trống.");
    });

    it("nên ném lỗi khi số lượng (quantity) nhỏ hơn hoặc bằng 0", () => {
      expect(() => {
        CartItem.create({ ...validProps, quantity: 0 });
      }).toThrowError("Số lượng sản phẩm phải lớn hơn 0.");

      expect(() => {
        CartItem.create({ ...validProps, quantity: -5 });
      }).toThrowError("Số lượng sản phẩm phải lớn hơn 0.");
    });

    it("nên ném lỗi khi giá sản phẩm nhỏ hơn 0", () => {
      expect(() => {
        CartItem.create({ ...validProps, price: -100 });
      }).toThrowError("Giá sản phẩm không được nhỏ hơn 0.");
    });
  });

  describe("updatePrice", () => {
    it("nên cập nhật giá mới thành công và cập nhật updatedAt", () => {
      const item = CartItem.create(validProps);
      const initialUpdatedAt = item.updatedAt;

      item.updatePrice(180000);

      expect(item.price).toBe(180000);
      expect(item.updatedAt.getTime()).toBeGreaterThanOrEqual(
        initialUpdatedAt.getTime()
      );
    });

    it("nên ném lỗi khi cập nhật giá nhỏ hơn 0", () => {
      const item = CartItem.create(validProps);

      expect(() => {
        item.updatePrice(-1);
      }).toThrowError("Giá sản phẩm không được nhỏ hơn 0.");
    });
  });

  describe("updateQuantity", () => {
    it("nên cập nhật số lượng mới hợp lệ và cập nhật updatedAt", () => {
      const item = CartItem.create(validProps);
      const initialUpdatedAt = item.updatedAt;

      item.updateQuantity(5);

      expect(item.quantity).toBe(5);
      expect(item.updatedAt.getTime()).toBeGreaterThanOrEqual(
        initialUpdatedAt.getTime()
      );
    });

    it("nên ném lỗi khi cập nhật số lượng nhỏ hơn hoặc bằng 0", () => {
      const item = CartItem.create(validProps);

      expect(() => {
        item.updateQuantity(0);
      }).toThrowError("Số lượng sản phẩm phải lớn hơn 0.");

      expect(() => {
        item.updateQuantity(-2);
      }).toThrowError("Số lượng sản phẩm phải lớn hơn 0.");
    });
  });

  describe("increaseQuantity", () => {
    it("nên cộng dồn số lượng thành công và cập nhật updatedAt", () => {
      const item = CartItem.create(validProps);
      const initialUpdatedAt = item.updatedAt;

      item.increaseQuantity(3);

      expect(item.quantity).toBe(5); // 2 + 3 = 5
      expect(item.updatedAt.getTime()).toBeGreaterThanOrEqual(
        initialUpdatedAt.getTime()
      );
    });

    it("nên ném lỗi khi cộng số lượng nhỏ hơn hoặc bằng 0", () => {
      const item = CartItem.create(validProps);

      expect(() => {
        item.increaseQuantity(0);
      }).toThrowError("Số lượng cộng thêm phải lớn hơn 0.");

      expect(() => {
        item.increaseQuantity(-1);
      }).toThrowError("Số lượng cộng thêm phải lớn hơn 0.");
    });
  });
});
