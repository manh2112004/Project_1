/**
 * @openapi
 * components:
 *   schemas:
 *     OrderItemResponse:
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
 *         unitPrice:
 *           type: number
 *           example: 150000
 *         totalPrice:
 *           type: number
 *           example: 300000
 *         createdAt:
 *           type: string
 *           format: date-time
 *     OrderResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         userId:
 *           type: string
 *           format: uuid
 *         orderCode:
 *           type: string
 *           example: "ORD-LX7Y8Z-A9F2"
 *         status:
 *           type: string
 *           enum: [PENDING, PROCESSING, SHIPPED, DELIVERED, CANCELLED]
 *           example: "PENDING"
 *         totalAmount:
 *           type: number
 *           example: 300000
 *         discountAmount:
 *           type: number
 *           example: 20000
 *         shippingFee:
 *           type: number
 *           example: 30000
 *         finalAmount:
 *           type: number
 *           example: 310000
 *         paymentMethod:
 *           type: string
 *           enum: [COD, VNPAY, MOMO]
 *           example: "COD"
 *         paymentStatus:
 *           type: string
 *           enum: [UNPAID, PAID, FAILED, REFUNDED]
 *           example: "UNPAID"
 *         recipientName:
 *           type: string
 *           example: "Nguyen Van A"
 *         phoneNumber:
 *           type: string
 *           example: "0901234567"
 *         shippingAddress:
 *           type: string
 *           example: "123 Đường Lê Lợi, Quận 1, TP. Hồ Chí Minh"
 *         shippingCode:
 *           type: string
 *           nullable: true
 *           example: "GHN12345678VN"
 *         customerNote:
 *           type: string
 *           nullable: true
 *           example: "Giao giờ hành chính"
 *         cancelReason:
 *           type: string
 *           nullable: true
 *           example: "Đổi ý không mua nữa"
 *         items:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/OrderItemResponse'
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     CreateOrderDto:
 *       type: object
 *       required:
 *         - recipientName
 *         - phoneNumber
 *         - shippingAddress
 *         - paymentMethod
 *       properties:
 *         recipientName:
 *           type: string
 *           example: "Nguyen Van A"
 *         phoneNumber:
 *           type: string
 *           example: "0901234567"
 *         shippingAddress:
 *           type: string
 *           example: "123 Đường Lê Lợi, Quận 1, TP. Hồ Chí Minh"
 *         paymentMethod:
 *           type: string
 *           enum: [COD, VNPAY, MOMO]
 *           example: "COD"
 *         customerNote:
 *           type: string
 *           example: "Giao hàng giờ hành chính"
 *         productIds:
 *           type: array
 *           description: "(Tùy chọn) Danh sách sản phẩm chọn mua từ giỏ hàng. Nếu bỏ trống sẽ mua toàn bộ giỏ."
 *           items:
 *             type: string
 *             format: uuid
 *     UpdateShippingAddressDto:
 *       type: object
 *       required:
 *         - recipientName
 *         - phoneNumber
 *         - shippingAddress
 *       properties:
 *         recipientName:
 *           type: string
 *           example: "Nguyen Van B"
 *         phoneNumber:
 *           type: string
 *           example: "0987654321"
 *         shippingAddress:
 *           type: string
 *           example: "456 Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh"
 *     CancelOrderDto:
 *       type: object
 *       required:
 *         - cancelReason
 *       properties:
 *         cancelReason:
 *           type: string
 *           example: "Tôi tìm thấy sản phẩm giá tốt hơn"
 *     ShipOrderDto:
 *       type: object
 *       properties:
 *         shippingCode:
 *           type: string
 *           example: "GHN12345678VN"
 */

/**
 * @openapi
 * /orders/checkout:
 *   post:
 *     summary: "[Khách hàng] Tiến hành Đặt hàng (Checkout)"
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateOrderDto'
 *     responses:
 *       201:
 *         description: Đặt hàng thành công
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
 *                   example: "Đặt hàng thành công!"
 *                 data:
 *                   $ref: '#/components/schemas/OrderResponse'
 *       400:
 *         description: Giỏ hàng rỗng, hết hàng hoặc thông tin không hợp lệ
 * 
 * /orders/me:
 *   get:
 *     summary: "[Khách hàng] Xem lịch sử đơn hàng của tôi (Có phân trang)"
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Trang hiện tại
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Số lượng đơn mỗi trang
 *     responses:
 *       200:
 *         description: Lấy danh sách thành công
 * 
 * /orders/{id}:
 *   get:
 *     summary: "[Khách hàng / Admin] Xem chi tiết 01 đơn hàng theo ID"
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID Đơn hàng
 *     responses:
 *       200:
 *         description: Chi tiết đơn hàng
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/OrderResponse'
 * 
 * /orders/{id}/cancel:
 *   put:
 *     summary: "[Khách hàng] Tự hủy đơn hàng của mình"
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CancelOrderDto'
 *     responses:
 *       200:
 *         description: Hủy đơn thành công
 * 
 * /orders/{id}/address:
 *   put:
 *     summary: "[Khách hàng] Đổi địa chỉ nhận hàng của đơn chưa giao"
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateShippingAddressDto'
 *     responses:
 *       200:
 *         description: Cập nhật địa chỉ thành công
 * 
 * /orders:
 *   get:
 *     summary: "[Admin] Quan trị viên xem tất cả đơn hàng (Phân trang, Lọc, Tìm kiếm)"
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Tìm theo Mã đơn / Tên / SĐT
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [PENDING, PROCESSING, SHIPPED, DELIVERED, CANCELLED]
 *         description: Lọc theo trạng thái đơn
 *     responses:
 *       200:
 *         description: Danh sách đơn hàng toàn hệ thống
 * 
 * /orders/{id}/confirm:
 *   put:
 *     summary: "[Admin] Xác nhận duyệt đơn hàng (PENDING -> PROCESSING)"
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Duyệt đơn thành công
 * 
 * /orders/{id}/ship:
 *   put:
 *     summary: "[Admin] Bàn giao đơn cho đơn vị vận chuyển (PROCESSING -> SHIPPED)"
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ShipOrderDto'
 *     responses:
 *       200:
 *         description: Bàn giao vận chuyển thành công
 * 
 * /orders/{id}/deliver:
 *   put:
 *     summary: "[Admin/Shipper] Xác nhận giao hàng thành công (SHIPPED -> DELIVERED)"
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Giao hàng thành công
 * 
 * /orders/{id}/pay:
 *   put:
 *     summary: "[Admin/Webhook] Cập nhật đơn hàng đã thanh toán thành công (PAID)"
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Cập nhật đã thanh toán thành công
 * 
 * /orders/{id}/admin-cancel:
 *   put:
 *     summary: "[Admin] Quản trị viên hủy đơn hàng bất kỳ"
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CancelOrderDto'
 *     responses:
 *       200:
 *         description: Admin hủy đơn hàng thành công
 */
