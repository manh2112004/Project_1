/**
 * @openapi
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           example: "c1f7b2a9-d3e4-4a5b-8c6d-7e8f9a0b1c2d"
 *         roleId:
 *           type: string
 *           format: uuid
 *           example: "a8e9f012-3456-7890-abcd-ef1234567890"
 *         email:
 *           type: string
 *           format: email
 *           example: "user@example.com"
 *         phoneNumber:
 *           type: string
 *           nullable: true
 *           example: "0912345678"
 *         fullName:
 *           type: string
 *           example: "Nguyễn Văn A"
 *         avatarUrl:
 *           type: string
 *           nullable: true
 *           example: "https://res.cloudinary.com/demo/image/upload/avatar.jpg"
 *         dateOfBirth:
 *           type: string
 *           format: date-time
 *           nullable: true
 *           example: "1995-05-15T00:00:00.000Z"
 *         gender:
 *           type: string
 *           enum: [MALE, FEMALE, OTHER]
 *           example: "MALE"
 *         status:
 *           type: string
 *           enum: [ACTIVE, BLOCKED, PENDING]
 *           example: "ACTIVE"
 *         emailVerifiedAt:
 *           type: string
 *           format: date-time
 *           nullable: true
 *         phoneVerifiedAt:
 *           type: string
 *           format: date-time
 *           nullable: true
 *         lastLoginAt:
 *           type: string
 *           format: date-time
 *           nullable: true
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
 *     RegisterDto:
 *       type: object
 *       required:
 *         - email
 *         - password
 *         - fullName
 *         - gender
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           example: "user@example.com"
 *         password:
 *           type: string
 *           format: password
 *           minLength: 6
 *           example: "Password123!"
 *         fullName:
 *           type: string
 *           example: "Nguyễn Văn A"
 *         phoneNumber:
 *           type: string
 *           nullable: true
 *           example: "0912345678"
 *         gender:
 *           type: string
 *           enum: [MALE, FEMALE, OTHER]
 *           example: "MALE"
 *     LoginDto:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           example: "user@example.com"
 *         password:
 *           type: string
 *           format: password
 *           example: "Password123!"
 *     LoginResponse:
 *       type: object
 *       properties:
 *         accessToken:
 *           type: string
 *           example: "eyJhbGciOiJIUzI1NiIsInR5cCI6..."
 *         refreshToken:
 *           type: string
 *           example: "eyJhbGciOiJIUzI1NiIsInR5cCI6..."
 *         user:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *               format: uuid
 *               example: "c1f7b2a9-d3e4-4a5b-8c6d-7e8f9a0b1c2d"
 *             email:
 *               type: string
 *               example: "user@example.com"
 *             fullName:
 *               type: string
 *               example: "Nguyễn Văn A"
 *             roleCode:
 *               type: string
 *               example: "CUSTOMER"
 *     UpdateProfileDto:
 *       type: object
 *       properties:
 *         fullName:
 *           type: string
 *           example: "Nguyễn Văn A"
 *         avatarUrl:
 *           type: string
 *           nullable: true
 *           example: "https://res.cloudinary.com/demo/image/upload/avatar.jpg"
 *         dateOfBirth:
 *           type: string
 *           format: date-time
 *           nullable: true
 *           example: "1995-05-15T00:00:00.000Z"
 *         gender:
 *           type: string
 *           enum: [MALE, FEMALE, OTHER]
 *           example: "MALE"
 *     ChangePasswordDto:
 *       type: object
 *       required:
 *         - oldPassword
 *         - newPassword
 *       properties:
 *         oldPassword:
 *           type: string
 *           format: password
 *           example: "OldPassword123!"
 *         newPassword:
 *           type: string
 *           format: password
 *           minLength: 6
 *           example: "NewPassword123!"
 *     ChangeRoleDto:
 *       type: object
 *       required:
 *         - roleId
 *       properties:
 *         roleId:
 *           type: string
 *           format: uuid
 *           example: "a8e9f012-3456-7890-abcd-ef1234567890"
 *     CreateUserByAdminDto:
 *       type: object
 *       required:
 *         - roleId
 *         - email
 *         - password
 *         - fullName
 *         - gender
 *       properties:
 *         roleId:
 *           type: string
 *           format: uuid
 *           example: "a8e9f012-3456-7890-abcd-ef1234567890"
 *         email:
 *           type: string
 *           format: email
 *           example: "admin_staff@example.com"
 *         password:
 *           type: string
 *           format: password
 *           minLength: 6
 *           example: "AdminPassword123!"
 *         fullName:
 *           type: string
 *           example: "Nguyễn Văn Admin"
 *         phoneNumber:
 *           type: string
 *           nullable: true
 *           example: "0987654321"
 *         gender:
 *           type: string
 *           enum: [MALE, FEMALE, OTHER]
 *           example: "MALE"
 *         avatarUrl:
 *           type: string
 *           nullable: true
 *           example: "https://res.cloudinary.com/demo/image/upload/avatar.jpg"
 */

/**
 * @openapi
 * /auth/register:
 *   post:
 *     summary: Đăng ký tài khoản người dùng mới
 *     tags: [Auth & Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterDto'
 *     responses:
 *       201:
 *         description: Đăng ký tài khoản thành công
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
 *                   example: "Đăng ký tài khoản thành công"
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Thông tin đăng ký không hợp lệ
 *       409:
 *         description: Email hoặc số điện thoại đã tồn tại trên hệ thống
 * 
 * /auth/login:
 *   post:
 *     summary: Đăng nhập tài khoản
 *     tags: [Auth & Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginDto'
 *     responses:
 *       200:
 *         description: Đăng nhập thành công, trả về Access Token & Refresh Token
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
 *                   example: "Đăng nhập thành công"
 *                 data:
 *                   $ref: '#/components/schemas/LoginResponse'
 *       401:
 *         description: Email hoặc mật khẩu không chính xác
 *       403:
 *         description: Tài khoản của người dùng đã bị khóa (BLOCKED)
 * 
 * /auth/refresh-token:
 *   post:
 *     summary: Làm mới Access Token bằng Refresh Token
 *     tags: [Auth & Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 example: "eyJhbGciOiJIUzI1NiIsInR5cCI6..."
 *     responses:
 *       200:
 *         description: Cấp lại Access Token thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     accessToken:
 *                       type: string
 *                     refreshToken:
 *                       type: string
 *       401:
 *         description: Refresh Token không hợp lệ hoặc đã hết hạn
 */

/**
 * @openapi
 * /users/me:
 *   get:
 *     summary: Lấy thông tin cá nhân của người dùng hiện tại
 *     tags: [Auth & Users]
 *     security:
 *       - bearerAuth: []
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
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Chưa xác thực (Chưa truyền hoặc Token không hợp lệ)
 * 
 *   put:
 *     summary: Cập nhật thông tin cá nhân
 *     tags: [Auth & Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateProfileDto'
 *     responses:
 *       200:
 *         description: Cập nhật thông tin cá nhân thành công
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
 *                   example: "Cập nhật thông tin cá nhân thành công"
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Dữ liệu không hợp lệ
 *       401:
 *         description: Chưa xác thực
 * 
 * /users/me/change-password:
 *   put:
 *     summary: Đổi mật khẩu tài khoản hiện tại
 *     tags: [Auth & Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ChangePasswordDto'
 *     responses:
 *       200:
 *         description: Đổi mật khẩu thành công
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
 *                   example: "Đổi mật khẩu thành công"
 *       400:
 *         description: Mật khẩu cũ không chính xác hoặc mật khẩu mới không hợp lệ
 *       401:
 *         description: Chưa xác thực
 */

/**
 * @openapi
 * /users:
 *   post:
 *     summary: Admin khởi tạo tài khoản người dùng mới (chỉ định roleId)
 *     tags: [Auth & Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateUserByAdminDto'
 *     responses:
 *       201:
 *         description: Tạo tài khoản thành công
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
 *                   example: "Admin tạo tài khoản người dùng thành công."
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Yêu cầu không hợp lệ hoặc vai trò (roleId) không tồn tại
 *       409:
 *         description: Email hoặc số điện thoại đã tồn tại
 * 
 * /users/paginated:
 *   get:
 *     summary: Lấy danh sách người dùng phân trang và tìm kiếm (Quản trị viên)
 *     tags: [Auth & Users]
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
 *         description: Số lượng người dùng mỗi trang
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Từ khóa tìm kiếm theo tên, email hoặc số điện thoại
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
 *                 data:
 *                   type: object
 *                   properties:
 *                     users:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/User'
 *                     meta:
 *                       type: object
 *                       properties:
 *                         totalCount:
 *                           type: integer
 *                         totalPages:
 *                           type: integer
 *                         currentPage:
 *                           type: integer
 *                         limit:
 *                           type: integer
 *       401:
 *         description: Chưa xác thực
 *       403:
 *         description: Không có quyền truy cập
 * 
 * /users/{id}:
 *   get:
 *     summary: Lấy chi tiết người dùng theo ID (Quản trị viên)
 *     tags: [Auth & Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID người dùng
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
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       404:
 *         description: Không tìm thấy người dùng
 * 
 *   delete:
 *     summary: Xóa mềm người dùng (Quản trị viên)
 *     tags: [Auth & Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID người dùng
 *     responses:
 *       200:
 *         description: Xóa người dùng thành công
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
 *                   example: "Xóa người dùng thành công"
 * 
 * /users/{id}/role:
 *   put:
 *     summary: Thay đổi vai trò người dùng (Quản trị viên)
 *     tags: [Auth & Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID người dùng
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ChangeRoleDto'
 *     responses:
 *       200:
 *         description: Thay đổi vai trò thành công
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
 *       400:
 *         description: ID vai trò không hợp lệ
 * 
 * /users/{id}/block:
 *   patch:
 *     summary: Khóa tài khoản người dùng (Quản trị viên)
 *     tags: [Auth & Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID người dùng
 *     responses:
 *       200:
 *         description: Khóa tài khoản thành công
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
 *                   example: "Khóa tài khoản thành công"
 * 
 * /users/{id}/activate:
 *   patch:
 *     summary: Kích hoạt / Mở khóa tài khoản người dùng (Quản trị viên)
 *     tags: [Auth & Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID người dùng
 *     responses:
 *       200:
 *         description: Kích hoạt tài khoản thành công
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
 *                   example: "Kích hoạt tài khoản thành công"
 */
