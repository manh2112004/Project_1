/**
 * @openapi
 * components:
 *   schemas:
 *     Inventory:
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
 *         importPrice:
 *           type: number
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *         deletedAt:
 *           type: string
 *           format: date-time
 *           nullable: true
 *     CreateInventoryDto:
 *       type: object
 *       required:
 *         - productId
 *         - quantity
 *         - importPrice
 *       properties:
 *         productId:
 *           type: string
 *           format: uuid
 *         quantity:
 *           type: integer
 *         importPrice:
 *           type: number
 *     UpdateInventoryDto:
 *       type: object
 *       properties:
 *         quantity:
 *           type: integer
 *         importPrice:
 *           type: number
 */

/**
 * @openapi
 * /inventories:
 *   get:
 *     summary: Lấy danh sách toàn bộ tồn kho
 *     tags: [Inventories]
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
 *                   example: "Lấy danh sách tồn kho thành công."
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Inventory'
 *       400:
 *         description: Lỗi xử lý
 * 
 *   post:
 *     summary: Tạo bản ghi tồn kho cho sản phẩm
 *     tags: [Inventories]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateInventoryDto'
 *     responses:
 *       201:
 *         description: Tạo thành công
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
 *                   example: "Tạo bản ghi tồn kho thành công."
 *                 data:
 *                   $ref: '#/components/schemas/Inventory'
 *       400:
 *         description: Lỗi đầu vào hoặc sản phẩm không tồn tại
 * 
 * /inventories/{id}:
 *   get:
 *     summary: Lấy thông tin tồn kho theo ID
 *     tags: [Inventories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID bản ghi tồn kho
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
 *                   example: "Lấy chi tiết tồn kho thành công."
 *                 data:
 *                   $ref: '#/components/schemas/Inventory'
 *       400:
 *         description: Bản ghi tồn kho không tồn tại
 * 
 *   put:
 *     summary: Cập nhật số lượng và giá nhập tồn kho
 *     tags: [Inventories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID bản ghi tồn kho
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateInventoryDto'
 *     responses:
 *       200:
 *         description: Cập nhật thành công
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
 *                   example: "Cập nhật tồn kho thành công."
 *                 data:
 *                   $ref: '#/components/schemas/Inventory'
 *       400:
 *         description: Lỗi nghiệp vụ hoặc đầu vào
 * 
 *   delete:
 *     summary: Xóa mềm bản ghi tồn kho
 *     tags: [Inventories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID bản ghi tồn kho
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
 *                   example: "Xóa bản ghi tồn kho thành công."
 *       400:
 *         description: Lỗi khi xóa
 */
