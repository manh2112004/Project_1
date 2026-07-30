/**
 * @openapi
 * components:
 *   schemas:
 *     Permission:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         name:
 *           type: string
 *           example: "CREATE_PRODUCT"
 *         module:
 *           type: string
 *           example: "product"
 *         description:
 *           type: string
 *           nullable: true
 *           example: "Quyền tạo sản phẩm mới"
 *         createdAt:
 *           type: string
 *           format: date-time
 *     CreatePermissionDto:
 *       type: object
 *       required:
 *         - name
 *         - module
 *       properties:
 *         name:
 *           type: string
 *           example: "CREATE_PRODUCT"
 *         module:
 *           type: string
 *           example: "product"
 *         description:
 *           type: string
 *           nullable: true
 *           example: "Quyền tạo sản phẩm mới"
 */

/**
 * @openapi
 * /permissions:
 *   get:
 *     summary: Lấy danh sách toàn bộ quyền hạn (không phân trang)
 *     tags: [Permissions]
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
 *                   example: "Lấy danh sách quyền hạn thành công"
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Permission'
 *       400:
 *         description: Lỗi xử lý
 * 
 *   post:
 *     summary: Tạo quyền hạn mới
 *     tags: [Permissions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreatePermissionDto'
 *     responses:
 *       201:
 *         description: Tạo quyền hạn thành công
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
 *                   example: "Tạo quyền hạn thành công"
 *                 data:
 *                   $ref: '#/components/schemas/Permission'
 *       400:
 *         description: Yêu cầu không hợp lệ
 */

/**
 * @openapi
 * /permissions/paginated:
 *   get:
 *     summary: Lấy danh sách quyền hạn phân trang và tìm kiếm
 *     tags: [Permissions]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Số trang hiện tại
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Số lượng bản ghi trên mỗi trang
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Từ khóa tìm kiếm theo tên quyền hoặc tên module
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
 *                   example: "Lấy danh sách quyền hạn phân trang thành công"
 *                 data:
 *                   type: object
 *                   properties:
 *                     permissions:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Permission'
 *                     meta:
 *                       type: object
 *                       properties:
 *                         totalCount:
 *                           type: integer
 *                           example: 15
 *                         totalPages:
 *                           type: integer
 *                           example: 2
 *                         currentPage:
 *                           type: integer
 *                           example: 1
 *                         limit:
 *                           type: integer
 *                           example: 10
 *       400:
 *         description: Yêu cầu không hợp lệ
 */

/**
 * @openapi
 * /permissions/{id}:
 *   get:
 *     summary: Lấy chi tiết quyền hạn theo ID
 *     tags: [Permissions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID của quyền hạn
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
 *                   example: "Lấy chi tiết quyền hạn thành công"
 *                 data:
 *                   $ref: '#/components/schemas/Permission'
 *       400:
 *         description: Quyền hạn không tồn tại hoặc ID không hợp lệ
 */
