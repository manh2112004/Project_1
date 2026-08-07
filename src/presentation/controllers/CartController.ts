import { Request, Response } from "express";
import { AddToCartUseCase } from "../../application/use-cases/cart/AddToCartUseCase";
import { GetCartUseCase } from "../../application/use-cases/cart/GetCartUseCase";
import { UpdateCartItemQuantityUseCase } from "../../application/use-cases/cart/UpdateCartItemQuantityUseCase";
import { RemoveCartItemUseCase } from "../../application/use-cases/cart/RemoveCartItemUseCase";
import { ClearCartUseCase } from "../../application/use-cases/cart/ClearCartUseCase";

export class CartController {
  constructor(
    private readonly addToCartUseCase: AddToCartUseCase,
    private readonly getCartUseCase: GetCartUseCase,
    private readonly updateCartItemQuantityUseCase: UpdateCartItemQuantityUseCase,
    private readonly removeCartItemUseCase: RemoveCartItemUseCase,
    private readonly clearCartUseCase: ClearCartUseCase,
  ) {}
  async getMyCart(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user.id;
      const cart = await this.getCartUseCase.execute(userId);

      res.status(200).json({
        success: true,
        data: {
          id: cart.id,
          userId: cart.userId,
          totalItems: cart.totalItems,
          isEmpty: cart.isEmpty,
          items: cart.items.map((item) => ({
            id: item.id,
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
            createdAt: item.createdAt,
            updatedAt: item.updatedAt,
          })),
        },
      });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async addToCart(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user.id;
      const { productId, quantity, price } = req.body;

      if (!productId || quantity === undefined || price === undefined) {
        res.status(400).json({
          success: false,
          message: "Vui lòng cung cấp productId, quantity và price.",
        });
        return;
      }

      const updatedCart = await this.addToCartUseCase.execute({
        userId,
        productId: String(productId),
        quantity: Number(quantity),
        price: Number(price),
      });

      res.status(200).json({
        success: true,
        message: "Đã thêm sản phẩm vào giỏ hàng thành công.",
        data: {
          id: updatedCart.id,
          userId: updatedCart.userId,
          totalItems: updatedCart.totalItems,
          isEmpty: updatedCart.isEmpty,
          items: updatedCart.items,
        },
      });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async updateItemQuantity(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user.id;
      const { productId } = req.params;
      const { quantity } = req.body;

      if (quantity === undefined) {
        res.status(400).json({
          success: false,
          message: "Vui lòng cung cấp số lượng (quantity) mới.",
        });
        return;
      }

      const updatedCart = await this.updateCartItemQuantityUseCase.execute({
        userId,
        productId: String(productId),
        quantity: Number(quantity),
      });

      res.status(200).json({
        success: true,
        message: "Cập nhật số lượng sản phẩm thành công.",
        data: {
          id: updatedCart.id,
          userId: updatedCart.userId,
          totalItems: updatedCart.totalItems,
          isEmpty: updatedCart.isEmpty,
          items: updatedCart.items.map((item) => ({
            id: item.id,
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
            createdAt: item.createdAt,
            updatedAt: item.updatedAt,
          })),
        },
      });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async removeItem(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user.id;
      const { productId } = req.params;

      const updatedCart = await this.removeCartItemUseCase.execute({
        userId,
        productId: String(productId),
      });

      res.status(200).json({
        success: true,
        message: "Đã xóa sản phẩm khỏi giỏ hàng thành công.",
        data: {
          id: updatedCart.id,
          userId: updatedCart.userId,
          totalItems: updatedCart.totalItems,
          isEmpty: updatedCart.isEmpty,
          items: updatedCart.items.map((item) => ({
            id: item.id,
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
            createdAt: item.createdAt,
            updatedAt: item.updatedAt,
          })),
        },
      });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async clearCart(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user.id;

      await this.clearCartUseCase.execute(userId);

      res.status(200).json({
        success: true,
        message: "Đã xóa sạch giỏ hàng thành công.",
      });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }
}
