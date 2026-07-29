/**
 * @openapi
 * components:
 *   schemas:
 *     ProductImage:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         productId:
 *           type: string
 *           format: uuid
 *         imageUrl:
 *           type: string
 *         isThumbnail:
 *           type: boolean
 *         sortOrder:
 *           type: integer
 *         createdAt:
 *           type: string
 *           format: date-time
 *         deletedAt:
 *           type: string
 *           format: date-time
 *           nullable: true
 */

/**
 * @openapi
 * /product-images:
 *   get:
 *     summary: Lấy danh sách toàn bộ ảnh sản phẩm
 *     tags: [Product Images]
 *     responses:
 *       200:
 *         description: Thành công
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
 *                   example: "Lấy danh sách hình ảnh sản phẩm thành công."
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/ProductImage'
 *       400:
 *         description: Lỗi xử lý
 * 
 *   post:
 *     summary: Upload ảnh sản phẩm lên Cloudinary và lưu vào DB
 *     tags: [Product Images]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *               - images
 *             properties:
 *               productId:
 *                 type: string
 *                 format: uuid
 *                 description: ID của sản phẩm cần thêm ảnh
 *               isThumbnail:
 *                 type: boolean
 *                 default: false
 *                 description: Đặt làm ảnh đại diện sản phẩm hay không
 *               sortOrder:
 *                 type: integer
 *                 default: 0
 *                 description: Thứ tự sắp xếp ảnh hiển thị
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Danh sách file ảnh (Tối đa 10 file)
 *     responses:
 *       201:
 *         description: Upload thành công
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
 *                   example: "Tạo hình ảnh sản phẩm thành công."
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/ProductImage'
 *       400:
 *         description: Lỗi upload hoặc sản phẩm không tồn tại
 * 
 * /product-images/{id}:
 *   delete:
 *     summary: Xóa mềm ảnh sản phẩm
 *     tags: [Product Images]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID của ảnh cần xóa
 *     responses:
 *       200:
 *         description: Xóa thành công
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
 *                   example: "Xóa hình ảnh sản phẩm thành công."
 *       400:
 *         description: Lỗi khi xóa hoặc ảnh không tồn tại
 */
