import { describe, it, expect } from "vitest";
import { Cart } from "../Cart";

describe("Cart Domain Entity (Aggregate Root)", () => {
  const userId = "user-uuid-123";

  describe("create (Instantiation)", () => {
    it("nên tạo giỏ hàng mới rỗng với userId hợp lệ", () => {
      const cart = Cart.create({ userId });

      expect(cart.id).toBeDefined();
      expect(cart.userId).toBe(userId);
      expect(cart.items).toEqual([]);
      expect(cart.isEmpty).toBe(true);
      expect(cart.totalItems).toBe(0);
      expect(cart.createdAt).toBeInstanceOf(Date);
      expect(cart.updatedAt).toBeInstanceOf(Date);
    });

    it("nên ném lỗi khi userId bị để trống", () => {
      expect(() => {
        Cart.create({ userId: "" });
      }).toThrowError("Mã người dùng (userId) không được để trống.");

      expect(() => {
        Cart.create({ userId: "   " });
      }).toThrowError("Mã người dùng (userId) không được để trống.");
    });
  });

  describe("addItem", () => {
    it("nên thêm sản phẩm mới vào giỏ hàng rỗng", () => {
      const cart = Cart.create({ userId });

      cart.addItem("product-uuid-1", 2, 100000);

      expect(cart.items).toHaveLength(1);
      expect(cart.items[0].productId).toBe("product-uuid-1");
      expect(cart.items[0].quantity).toBe(2);
      expect(cart.items[0].price).toBe(100000);
      expect(cart.totalItems).toBe(2);
      expect(cart.isEmpty).toBe(false);
    });

    it("nên cộng dồn số lượng và cập nhật giá khi thêm sản phẩm đã tồn tại trong giỏ", () => {
      const cart = Cart.create({ userId });

      cart.addItem("product-uuid-1", 2, 100000);
      cart.addItem("product-uuid-1", 3, 120000);

      expect(cart.items).toHaveLength(1); // Không tạo item mới
      expect(cart.items[0].quantity).toBe(5); // 2 + 3 = 5
      expect(cart.items[0].price).toBe(120000); // Giá mới được cập nhật
      expect(cart.totalItems).toBe(5);
    });

    it("nên thêm nhiều sản phẩm khác nhau vào giỏ hàng", () => {
      const cart = Cart.create({ userId });

      cart.addItem("product-uuid-1", 2, 100000);
      cart.addItem("product-uuid-2", 1, 200000);

      expect(cart.items).toHaveLength(2);
      expect(cart.totalItems).toBe(3);
    });
  });

  describe("updateItemQuantity", () => {
    it("nên cập nhật thành công số lượng của sản phẩm có trong giỏ", () => {
      const cart = Cart.create({ userId });
      cart.addItem("product-uuid-1", 2, 100000);

      cart.updateItemQuantity("product-uuid-1", 5);

      expect(cart.items[0].quantity).toBe(5);
      expect(cart.totalItems).toBe(5);
    });

    it("nên tự động xóa sản phẩm khỏi giỏ hàng nếu cập nhật số lượng <= 0", () => {
      const cart = Cart.create({ userId });
      cart.addItem("product-uuid-1", 2, 100000);
      cart.addItem("product-uuid-2", 1, 200000);

      cart.updateItemQuantity("product-uuid-1", 0);

      expect(cart.items).toHaveLength(1);
      expect(cart.items[0].productId).toBe("product-uuid-2");
      expect(cart.totalItems).toBe(1);
    });

    it("nên ném lỗi khi cập nhật sản phẩm không tồn tại trong giỏ hàng", () => {
      const cart = Cart.create({ userId });

      expect(() => {
        cart.updateItemQuantity("non-existent-product", 3);
      }).toThrowError("Sản phẩm không có trong giỏ hàng.");
    });
  });

  describe("removeItem", () => {
    it("nên xóa đúng sản phẩm ra khỏi giỏ hàng", () => {
      const cart = Cart.create({ userId });
      cart.addItem("product-uuid-1", 2, 100000);
      cart.addItem("product-uuid-2", 4, 200000);

      cart.removeItem("product-uuid-1");

      expect(cart.items).toHaveLength(1);
      expect(cart.items[0].productId).toBe("product-uuid-2");
      expect(cart.totalItems).toBe(4);
    });
  });

  describe("clear", () => {
    it("nên xóa sạch tất cả sản phẩm khỏi giỏ hàng", () => {
      const cart = Cart.create({ userId });
      cart.addItem("product-uuid-1", 2, 100000);
      cart.addItem("product-uuid-2", 3, 200000);

      cart.clear();

      expect(cart.items).toEqual([]);
      expect(cart.isEmpty).toBe(true);
      expect(cart.totalItems).toBe(0);
    });
  });
});
