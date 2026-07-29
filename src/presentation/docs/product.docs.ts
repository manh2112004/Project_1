/**
 * @openapi
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         categoryId:
 *           type: string
 *           format: uuid
 *         brandId:
 *           type: string
 *           format: uuid
 *         name:
 *           type: string
 *         slug:
 *           type: string
 *         sku:
 *           type: string
 *         shortDescription:
 *           type: string
 *           nullable: true
 *         description:
 *           type: string
 *           nullable: true
 *         thumbnail:
 *           type: string
 *           nullable: true
 *         price:
 *           type: number
 *         discountPrice:
 *           type: number
 *           nullable: true
 *         status:
 *           type: string
 *           enum: [ACTIVE, INACTIVE, DELETED]
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     CreateProductDto:
 *       type: object
 *       required:
 *         - categoryId
 *         - brandId
 *         - name
 *         - sku
 *         - price
 *       properties:
 *         categoryId:
 *           type: string
 *           format: uuid
 *         brandId:
 *           type: string
 *           format: uuid
 *         name:
 *           type: string
 *         sku:
 *           type: string
 *         shortDescription:
 *           type: string
 *           nullable: true
 *         description:
 *           type: string
 *           nullable: true
 *         thumbnail:
 *           type: string
 *           nullable: true
 *         price:
 *           type: number
 *         discountPrice:
 *           type: number
 *           nullable: true
 *         status:
 *           type: string
 *           default: ACTIVE
 *     UpdateProductDto:
 *       type: object
 *       properties:
 *         categoryId:
 *           type: string
 *           format: uuid
 *         brandId:
 *           type: string
 *           format: uuid
 *         name:
 *           type: string
 *         sku:
 *           type: string
 *         shortDescription:
 *           type: string
 *           nullable: true
 *         description:
 *           type: string
 *           nullable: true
 *         thumbnail:
 *           type: string
 *           nullable: true
 *         price:
 *           type: number
 *         discountPrice:
 *           type: number
 *           nullable: true
 *         status:
 *           type: string
 */

/**
 * @openapi
 * /products:
 *   get:
 *     summary: Lấy toàn bộ danh sách sản phẩm hoặc tìm kiếm không phân trang
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Từ khóa tìm kiếm theo tên hoặc SKU
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
 *                   example: "Lấy danh sách sản phẩm thành công."
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Product'
 *       400:
 *         description: Lỗi xử lý
 * 
 *   post:
 *     summary: Tạo sản phẩm mới
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateProductDto'
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
 *                   example: "Tạo sản phẩm thành công."
 *                 data:
 *                   $ref: '#/components/schemas/Product'
 *       400:
 *         description: Lỗi đầu vào hoặc nghiệp vụ
 * 
 * /products/paginated:
 *   get:
 *     summary: Lấy danh sách sản phẩm phân trang và tìm kiếm
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Số thứ tự trang
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Số phần tử trên mỗi trang
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Từ khóa tìm kiếm
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
 *                   example: "Lấy danh sách phân trang sản phẩm thành công."
 *                 data:
 *                   type: object
 *                   properties:
 *                     products:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Product'
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
 *       400:
 *         description: Lỗi xử lý
 * 
 * /products/{id}:
 *   get:
 *     summary: Lấy thông tin chi tiết sản phẩm theo ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID của sản phẩm
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
 *                   example: "Lấy chi tiết sản phẩm thành công."
 *                 data:
 *                   $ref: '#/components/schemas/Product'
 *       400:
 *         description: Sản phẩm không tồn tại hoặc lỗi xử lý
 * 
 *   put:
 *     summary: Cập nhật thông tin sản phẩm
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID của sản phẩm
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateProductDto'
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
 *                   example: "Cập nhật sản phẩm thành công."
 *                 data:
 *                   $ref: '#/components/schemas/Product'
 *       400:
 *         description: Lỗi nghiệp vụ hoặc đầu vào
 * 
 *   delete:
 *     summary: Xóa mềm sản phẩm (và tự động xóa mềm tồn kho, ảnh kèm theo)
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID của sản phẩm
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
 *                   example: "Xóa sản phẩm thành công."
 *       400:
 *         description: Lỗi khi xóa
 */
