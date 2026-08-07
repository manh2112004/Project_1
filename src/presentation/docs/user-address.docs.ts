/**
 * @openapi
 * components:
 *   schemas:
 *     UserAddress:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         userId:
 *           type: string
 *           format: uuid
 *         recipientName:
 *           type: string
 *         phoneNumber:
 *           type: string
 *         addressLine1:
 *           type: string
 *         addressLine2:
 *           type: string
 *           nullable: true
 *         ward:
 *           type: string
 *         district:
 *           type: string
 *         city:
 *           type: string
 *         country:
 *           type: string
 *           default: "Việt Nam"
 *         postalCode:
 *           type: string
 *           nullable: true
 *         isDefault:
 *           type: boolean
 *           default: false
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     CreateUserAddressDto:
 *       type: object
 *       required:
 *         - recipientName
 *         - phoneNumber
 *         - addressLine1
 *         - ward
 *         - district
 *         - city
 *       properties:
 *         recipientName:
 *           type: string
 *           example: "Nguyen Van A"
 *         phoneNumber:
 *           type: string
 *           example: "0901234567"
 *         addressLine1:
 *           type: string
 *           example: "123 Đường Lê Lợi"
 *         addressLine2:
 *           type: string
 *           example: "Tòa nhà ABC, Tầng 5"
 *         ward:
 *           type: string
 *           example: "Phường Bến Nghé"
 *         district:
 *           type: string
 *           example: "Quận 1"
 *         city:
 *           type: string
 *           example: "TP. Hồ Chí Minh"
 *         country:
 *           type: string
 *           example: "Việt Nam"
 *         postalCode:
 *           type: string
 *           example: "700000"
 *         isDefault:
 *           type: boolean
 *           default: false
 *     UpdateUserAddressDto:
 *       type: object
 *       properties:
 *         recipientName:
 *           type: string
 *         phoneNumber:
 *           type: string
 *         addressLine1:
 *           type: string
 *         addressLine2:
 *           type: string
 *         ward:
 *           type: string
 *         district:
 *           type: string
 *         city:
 *           type: string
 *         country:
 *           type: string
 *         postalCode:
 *           type: string
 *         isDefault:
 *           type: boolean
 */

/**
 * @openapi
 * /user-addresses/me:
 *   get:
 *     summary: Lấy danh sách địa chỉ giao hàng của người dùng hiện tại
 *     tags: [UserAddress]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lấy danh sách thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/UserAddress'
 *       401:
 *         description: Chưa xác thực Token JWT
 * 
 * /user-addresses/user/{userId}:
 *   get:
 *     summary: Lấy danh sách địa chỉ giao hàng theo userId
 *     tags: [UserAddress]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: Mã UUID người dùng
 *     responses:
 *       200:
 *         description: Lấy danh sách thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/UserAddress'
 * 
 * /user-addresses:
 *   post:
 *     summary: Thêm mới địa chỉ giao hàng
 *     tags: [UserAddress]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateUserAddressDto'
 *     responses:
 *       201:
 *         description: Tạo địa chỉ thành công
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
 *                   example: "Tạo địa chỉ giao hàng thành công."
 *                 data:
 *                   $ref: '#/components/schemas/UserAddress'
 *       400:
 *         description: Lỗi dữ liệu đầu vào
 * 
 * /user-addresses/{id}:
 *   put:
 *     summary: Cập nhật thông tin địa chỉ giao hàng
 *     tags: [UserAddress]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID địa chỉ cần cập nhật
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateUserAddressDto'
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
 *                 data:
 *                   $ref: '#/components/schemas/UserAddress'
 *       400:
 *         description: Lỗi dữ liệu hoặc không tìm thấy địa chỉ
 * 
 *   delete:
 *     summary: Xóa một địa chỉ giao hàng
 *     tags: [UserAddress]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID địa chỉ cần xóa
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
 *                   example: "Xóa địa chỉ thành công."
 * 
 * /user-addresses/{id}/default:
 *   patch:
 *     summary: Đặt địa chỉ làm địa chỉ mặc định
 *     tags: [UserAddress]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID địa chỉ cần đặt làm mặc định
 *     responses:
 *       200:
 *         description: Đặt địa chỉ mặc định thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/UserAddress'
 */
