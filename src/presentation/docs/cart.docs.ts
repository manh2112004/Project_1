/**
 * @openapi
 * components:
 *   schemas:
 *     CartItem:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         productId:
 *           type: string
 *           format: uuid
 *         quantity:
 *           type: integer
 *           example: 2
 *         price:
 *           type: number
 *           example: 150000
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     Cart:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         userId:
 *           type: string
 *           format: uuid
 *         totalItems:
 *           type: integer
 *           example: 3
 *         isEmpty:
 *           type: boolean
 *           example: false
 *         items:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/CartItem'
 *     AddToCartDto:
 *       type: object
 *       required:
 *         - productId
 *         - quantity
 *         - price
 *       properties:
 *         productId:
 *           type: string
 *           format: uuid
 *           example: "prod-uuid-123"
 *         quantity:
 *           type: integer
 *           minimum: 1
 *           example: 1
 *         price:
 *           type: number
 *           minimum: 0
 *           example: 150000
 *     UpdateCartItemQuantityDto:
 *       type: object
 *       required:
 *         - quantity
 *       properties:
 *         quantity:
 *           type: integer
 *           example: 5
 */

/**
 * @openapi
 * /cart/me:
 *   get:
 *     summary: Lấy chi tiết giỏ hàng của người dùng đang đăng nhập (Lưu trên Redis)
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lấy giỏ hàng thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Cart'
 *       401:
 *         description: Chưa xác thực Token JWT
 *
 * /cart/items:
 *   post:
 *     summary: Thêm sản phẩm vào giỏ hàng (Cộng dồn nếu sản phẩm đã có)
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AddToCartDto'
 *     responses:
 *       200:
 *         description: Thêm vào giỏ hàng thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Đã thêm sản phẩm vào giỏ hàng thành công."
 *                 data:
 *                   $ref: '#/components/schemas/Cart'
 *       400:
 *         description: Lỗi dữ liệu đầu vào hoặc số lượng không hợp lệ
 *
 * /cart/items/{productId}:
 *   put:
 *     summary: Cập nhật số lượng của một sản phẩm trong giỏ hàng (Tự động xóa nếu quantity <= 0)
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: Mã sản phẩm trong giỏ
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateCartItemQuantityDto'
 *     responses:
 *       200:
 *         description: Cập nhật số lượng thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Cập nhật số lượng sản phẩm thành công."
 *                 data:
 *                   $ref: '#/components/schemas/Cart'
 *
 *   delete:
 *     summary: Xóa một sản phẩm cụ thể khỏi giỏ hàng
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: Mã sản phẩm cần xóa khỏi giỏ
 *     responses:
 *       200:
 *         description: Xóa sản phẩm khỏi giỏ thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Đã xóa sản phẩm khỏi giỏ hàng thành công."
 *                 data:
 *                   $ref: '#/components/schemas/Cart'
 *
 * /cart/clear:
 *   delete:
 *     summary: Xóa sạch toàn bộ sản phẩm trong giỏ hàng
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Xóa sạch giỏ hàng thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Đã xóa sạch giỏ hàng thành công."
 */
