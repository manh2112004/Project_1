/**
 * @openapi
 * components:
 *   schemas:
 *     Role:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         name:
 *           type: string
 *         description:
 *           type: string
 *           nullable: true
 *         permissionCodes:
 *           type: array
 *           items:
 *             type: string
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
 *     CreateRoleDto:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         name:
 *           type: string
 *           example: "Staff"
 *         description:
 *           type: string
 *           nullable: true
 *           example: "Nhân viên bán hàng"
 *     UpdateRoleDto:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         name:
 *           type: string
 *           example: "Senior Staff"
 *         description:
 *           type: string
 *           nullable: true
 *           example: "Nhân viên bán hàng cấp cao"
 */

/**
 * @openapi
 * /roles:
 *   get:
 *     summary: Lấy danh sách toàn bộ vai trò (không phân trang)
 *     tags: [Roles]
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
 *                   example: "Lấy danh sách vai trò thành công"
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Role'
 *       400:
 *         description: Lỗi xử lý
 * 
 *   post:
 *     summary: Tạo vai trò mới
 *     tags: [Roles]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateRoleDto'
 *     responses:
 *       201:
 *         description: Tạo vai trò thành công
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
 *                   example: "Tạo vai trò thành công"
 *                 data:
 *                   $ref: '#/components/schemas/Role'
 *       400:
 *         description: Yêu cầu không hợp lệ
 */

/**
 * @openapi
 * /roles/paginated:
 *   get:
 *     summary: Lấy danh sách vai trò phân trang và tìm kiếm
 *     tags: [Roles]
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
 *         description: Từ khóa tìm kiếm theo tên vai trò
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
 *                   example: "Lấy danh sách vai trò phân trang thành công"
 *                 data:
 *                   type: object
 *                   properties:
 *                     roles:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Role'
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
 * /roles/{id}:
 *   get:
 *     summary: Lấy chi tiết vai trò theo ID
 *     tags: [Roles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID của vai trò
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
 *                   example: "Lấy chi tiết vai trò thành công"
 *                 data:
 *                   $ref: '#/components/schemas/Role'
 *       400:
 *         description: Vai trò không tồn tại hoặc ID không hợp lệ
 * 
 *   put:
 *     summary: Cập nhật vai trò theo ID
 *     tags: [Roles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID của vai trò
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateRoleDto'
 *     responses:
 *       200:
 *         description: Cập nhật vai trò thành công
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
 *                   example: "Cập nhật vai trò thành công"
 *                 data:
 *                   $ref: '#/components/schemas/Role'
 *       400:
 *         description: Yêu cầu không hợp lệ
 * 
 *   delete:
 *     summary: Xóa mềm vai trò theo ID
 *     tags: [Roles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID của vai trò
 *     responses:
 *       200:
 *         description: Xóa vai trò thành công
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
 *                   example: "Xóa vai trò thành công"
 *       400:
 *         description: Không thể xóa vai trò
 */

/**
 * @openapi
 * /roles/{id}/permissions:
 *   post:
 *     summary: Gán thêm các quyền hạn cho vai trò
 *     tags: [Roles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID của vai trò
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - permissionCodes
 *             properties:
 *               permissionCodes:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["CREATE_PRODUCT", "VIEW_PRODUCT"]
 *     responses:
 *       200:
 *         description: Gán quyền thành công
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
 *                   example: "Gán quyền cho vai trò thành công"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       format: uuid
 *                     name:
 *                       type: string
 *                     permissionCodes:
 *                       type: array
 *                       items:
 *                         type: string
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: Yêu cầu không hợp lệ hoặc mã quyền không tồn tại
 * 
 * /roles/{id}/permissions/revoke:
 *   post:
 *     summary: Thu hồi bớt các quyền hạn từ vai trò
 *     tags: [Roles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID của vai trò
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - permissionCodes
 *             properties:
 *               permissionCodes:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["CREATE_PRODUCT"]
 *     responses:
 *       200:
 *         description: Thu hồi quyền thành công
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
 *                   example: "Thu hồi quyền từ vai trò thành công"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       format: uuid
 *                     name:
 *                       type: string
 *                     permissionCodes:
 *                       type: array
 *                       items:
 *                         type: string
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: Yêu cầu không hợp lệ
 */
