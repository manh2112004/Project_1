# HƯỚNG DẪN TÍCH HỢP FRONTEND & TÀI LIỆU API BACKEND (PROJECT 1)

> **Tài liệu này được biên soạn dành cho AI Agent hoặc Developer để đọc-hiểu toàn bộ kiến trúc Backend của `Project_1` và xây dựng giao diện Frontend (FE) chuẩn chỉnh, tối ưu, đạt tiêu chuẩn sản phẩm thương mại.**

---

## 1. TỔNG QUAN HỆ THỐNG & KIẾN TRÚC BACKEND

### 1.1. Công nghệ Backend
* **Core Framework**: Node.js, Express, TypeScript (Kiến trúc Clean Architecture / DDD).
* **Database & ORM**: PostgreSQL / MySQL qua **TypeORM**.
* **Cache & In-Memory Storage**: **Redis** (dùng lưu trữ Giỏ hàng / Cart theo Realtime & hiệu năng cao).
* **Media Cloud**: **Cloudinary** (lưu trữ ảnh đại diện, ảnh sản phẩm).
* **Realtime Notification**: **Server-Sent Events (SSE)**.
* **Security & Auth**: **JWT (JSON Web Token)** - Access Token & Refresh Token, Mã hóa mật khẩu bằng **Bcrypt**.

### 1.2. Quy Chuẩn Response API
Tất cả các API trong hệ thống đều tuân theo định dạng JSON đồng nhất:

#### Response Thành công (`200 OK`, `201 Created`):
```json
{
  "success": true,
  "message": "Thông điệp phản hồi (nếu có)",
  "data": { ... } // Dữ liệu trả về (Object hoặc Array)
}
```

#### Response Lỗi (`400 Bad Request`, `401 Unauthorized`, `403 Forbidden`, `404 Not Found`):
```json
{
  "success": false,
  "message": "Mô tả chi tiết nguyên nhân lỗi"
}
```

#### Quy chuẩn Phân trang (Pagination Standard):
Các API hỗ trợ phân trang (`/paginated`) chấp nhận Query Parameters:
* `page`: Trang hiện tại (Mặc định: `1`).
* `limit`: Số lượng bản ghi trên 1 trang (Mặc định: `10`).
* `search`: Từ khóa tìm kiếm (Tùy chọn).
* `status`: Trạng thái lọc (Ví dụ đối với Order).

Cấu trúc trả về trong `data`:
```json
{
  "items": [ ... ],
  "meta": {
    "total": 50,
    "page": 1,
    "limit": 10,
    "totalPages": 5
  }
}
```

---

## 2. XÁC THỰC, PHÂN QUYỀN & SSE REALTIME

### 2.1. Xác thực (JWT Auth)
* **Access Token**: Gửi kèm trong **HTTP Header** cho tất cả các API yêu cầu đăng nhập:
  ```http
  Authorization: Bearer <your_access_token>
  ```
* **Refresh Token**: Dùng để cấp lại Access Token mới khi Access Token hết hạn thông qua endpoint `/api/auth/refresh-token`.

### 2.2. Phân Quyền Người Dùng (RBAC)
Hệ thống quản lý quyền theo 2 lớp:
1. **Vai trò Hệ thống (`roleCode`)**: `SUPER_ADMIN`, `ADMIN`, `STAFF`, `CUSTOMER`.
   * **Super Admin** (`admin@system.com` hoặc roleCode `SUPER_ADMIN`): Có toàn quyền truy cập tất cả API.
   * **Admin / Staff**: Được truy cập các API quản trị đơn hàng, sản phẩm, tồn kho...
   * **Customer**: Được truy cập giỏ hàng, đặt hàng, quản lý cá nhân, địa chỉ.
2. **Mã Quyền Hạn (`permissionCodes`)**: Các mã quyền chi tiết như `CREATE_PRODUCT`, `UPDATE_PRODUCT`, `DELETE_PRODUCT` được gán vào JWT Payload của User.

### 2.3. Lắng nghe Sự kiện Realtime (Server-Sent Events - SSE)
* **Endpoint SSE**: `GET /api/users/sse?token=<access_token>`
* **Cách kết nối ở FE**:
  ```javascript
  const eventSource = new EventSource(`http://localhost:5000/api/users/sse?token=${token}`);

  // Lắng nghe sản phẩm mới tạo
  eventSource.addEventListener("product:created", (event) => {
    const newProduct = JSON.parse(event.data);
    console.log("Sản phẩm mới:", newProduct);
  });

  // Lắng nghe sự kiện tài khoản bị khóa / kích hoạt
  eventSource.addEventListener("user:blocked", (event) => {
    const data = JSON.parse(event.data);
    alert(data.message);
    // Tiến hành logout người dùng khỏi ứng dụng
  });
  ```

---

## 3. DANH SÁCH API ENDPOINTS CHI TIẾT

Base URL: `http://localhost:5000/api` (hoặc cấu hình theo `.env`)

### 3.1. Auth (`/api/auth`)
| Method | Endpoint | Auth | Mô tả | Body Request / Query Params |
| :--- | :--- | :---: | :--- | :--- |
| `POST` | `/register` | Public | Đăng ký tài khoản Khách hàng | `{ email, password, fullName, phoneNumber, gender }` (`gender`: `"MALE" \| "FEMALE" \| "OTHER"`) |
| `POST` | `/login` | Public | Đăng nhập tài khoản | `{ email, password }` |
| `POST` | `/refresh-token` | Public | Làm mới Access Token | `{ refreshToken }` |

### 3.2. User & Profile (`/api/users`)
| Method | Endpoint | Auth | Role / Perm | Mô tả | Body Request / Query Params |
| :--- | :--- | :---: | :---: | :--- | :--- |
| `GET` | `/me` | JWT | User | Lấy thông tin cá nhân | None |
| `PUT` | `/me` | JWT | User | Cập nhật hồ sơ cá nhân | `{ fullName, avatarUrl, dateOfBirth, gender }` |
| `PUT` | `/me/change-password` | JWT | User | Đổi mật khẩu | `{ oldPassword, newPassword }` |
| `GET` | `/sse` | JWT | User | Kết nối SSE Realtime | Query param: `?token=<access_token>` |
| `POST` | `/` | JWT | Admin | Admin tạo tài khoản mới | `{ roleId, email, password, fullName, phoneNumber, gender, avatarUrl }` |
| `GET` | `/paginated` | JWT | Admin | Danh sách user phân trang | Query: `?page=1&limit=10&search=abc` |
| `GET` | `/:id` | JWT | Admin | Xem chi tiết User theo ID | Params: `id` |
| `DELETE` | `/:id` | JWT | Admin | Xóa mềm/Xóa User | Params: `id` |
| `PUT` | `/:id/role` | JWT | Admin | Thay đổi Vai trò (Role) | Params: `id`, Body: `{ roleId }` |
| `PATCH` | `/:id/block` | JWT | Admin | Khóa tài khoản User | Params: `id` |
| `PATCH` | `/:id/activate` | JWT | Admin | Kích hoạt lại tài khoản | Params: `id` |

### 3.3. Sổ Địa Chỉ Người Dùng (`/api/user-addresses`)
| Method | Endpoint | Auth | Mô tả | Body Request / Query Params |
| :--- | :--- | :---: | :--- | :--- |
| `GET` | `/me` | JWT | Lấy danh sách địa chỉ của tôi | None |
| `GET` | `/user/:userId` | JWT | Lấy địa chỉ theo UserId (Admin) | Params: `userId` |
| `POST` | `/` | JWT | Tạo mới địa chỉ giao hàng | `{ recipientName, phoneNumber, addressLine1, addressLine2, ward, district, city, country, postalCode, isDefault }` |
| `PUT` | `/:id` | JWT | Cập nhật địa chỉ | Params: `id`, Body: các trường địa chỉ cần cập nhật |
| `DELETE` | `/:id` | JWT | Xóa địa chỉ | Params: `id` |
| `PATCH` | `/:id/default` | JWT | Đặt địa chỉ làm mặc định | Params: `id` |

### 3.4. Danh Mục Sản Phẩm (`/api/categories`)
| Method | Endpoint | Auth | Mô tả | Body Request / Query Params |
| :--- | :--- | :---: | :--- | :--- |
| `GET` | `/` | Public | Lấy toàn bộ danh mục | None |
| `GET` | `/paginated` | Public | Lấy danh mục phân trang | Query: `?page=1&limit=10&search=...` |
| `GET` | `/:id` | Public | Xem chi tiết danh mục | Params: `id` |
| `POST` | `/` | JWT | Tạo mới danh mục | `{ name, slug, parentId, description, image, isActive }` |
| `PUT` | `/:id` | JWT | Cập nhật danh mục | Params: `id`, Body: `{ name, slug, parentId, description, image, isActive }` |
| `DELETE` | `/:id` | JWT | Xóa danh mục | Params: `id` |

### 3.5. Thương Hiệu (`/api/brand`)
| Method | Endpoint | Auth | Mô tả | Body Request / Query Params |
| :--- | :--- | :---: | :--- | :--- |
| `GET` | `/` | Public | Lấy toàn bộ thương hiệu | None |
| `GET` | `/paginated` | Public | Phân trang thương hiệu | Query: `?page=1&limit=10&search=...` |
| `GET` | `/:id` | Public | Xem chi tiết thương hiệu | Params: `id` |
| `POST` | `/` | JWT | Tạo mới thương hiệu | `{ name, logo, description, isActive }` |
| `PUT` | `/:id` | JWT | Cập nhật thương hiệu | Params: `id`, Body: `{ name, logo, description, isActive }` |
| `DELETE` | `/:id` | JWT | Xóa thương hiệu | Params: `id` |

### 3.6. Sản Phẩm (`/api/products`)
| Method | Endpoint | Auth | Perm Required | Mô tả | Body Request / Query Params |
| :--- | :--- | :---: | :---: | :--- | :--- |
| `GET` | `/` | Public | None | Lấy tất cả sản phẩm | Query: `?search=...` |
| `GET` | `/paginated` | Public | None | Phân trang sản phẩm | Query: `?page=1&limit=10&search=...` |
| `GET` | `/:id` | Public | None | Xem chi tiết sản phẩm | Params: `id` |
| `POST` | `/` | JWT | `CREATE_PRODUCT` | Tạo sản phẩm mới | `{ categoryId, brandId, name, slug, sku, shortDescription, description, thumbnail, price, discountPrice, status }` |
| `PUT` | `/:id` | JWT | `UPDATE_PRODUCT` | Cập nhật sản phẩm | Params: `id`, Body: tương tự tạo mới |
| `DELETE` | `/:id` | JWT | `DELETE_PRODUCT` | Xóa sản phẩm | Params: `id` |

### 3.7. Upload Media & Ảnh Sản Phẩm
| Method | Endpoint | Content-Type | Auth | Mô tả |
| :--- | :--- | :--- | :---: | :--- |
| `POST` | `/api/upload` | `multipart/form-data` | JWT | Upload 1 file ảnh lẻ lên Cloudinary. Key form-data: `file`. Trả về `{ url }`. |
| `POST` | `/api/product-images` | `multipart/form-data` | JWT | Upload nhiều ảnh sản phẩm. Key form-data: `images` (tối đa 10 file), `productId`, `isThumbnail` (`"true"`/`"false"`), `sortOrder` (number string). |
| `GET` | `/api/product-images` | `application/json` | Public | Lấy tất cả danh sách ảnh sản phẩm. |
| `DELETE` | `/api/product-images/:id` | `application/json` | JWT | Xóa 1 ảnh sản phẩm theo ID. |

### 3.8. Tồn Kho (`/api/inventories`)
| Method | Endpoint | Auth | Mô tả | Body Request / Query Params |
| :--- | :--- | :---: | :--- | :--- |
| `GET` | `/` | JWT | Lấy tất cả kho hàng | None |
| `GET` | `/:id` | JWT | Chi tiết kho hàng | Params: `id` |
| `POST` | `/` | JWT | Tạo bản ghi tồn kho | `{ productId, quantity, importPrice }` |
| `PUT` | `/:id` | JWT | Cập nhật tồn kho | Params: `id`, Body: `{ quantity, importPrice }` |
| `DELETE` | `/:id` | JWT | Xóa bản ghi tồn kho | Params: `id` |

### 3.9. Giỏ Hàng Redis (`/api/cart`)
> **Lưu ý quan trọng**: Giỏ hàng được lưu trữ trong Redis theo `userId`. Mọi hành động đều yêu cầu JWT Token.

| Method | Endpoint | Auth | Mô tả | Body Request / Query Params |
| :--- | :--- | :---: | :--- | :--- |
| `GET` | `/me` | JWT | Lấy giỏ hàng của người dùng hiện tại | None |
| `POST` | `/items` | JWT | Thêm sản phẩm vào giỏ hàng | `{ productId, quantity, price }` |
| `PUT` | `/items/:productId` | JWT | Cập nhật số lượng của 1 mục trong giỏ | Params: `productId`, Body: `{ quantity }` |
| `DELETE` | `/items/:productId` | JWT | Xóa 1 mục khỏi giỏ hàng | Params: `productId` |
| `DELETE` | `/clear` | JWT | Xóa sạch giỏ hàng | None |

### 3.10. Đơn Hàng (`/api/orders`)

#### A. Dành cho Khách Hàng (Customer):
| Method | Endpoint | Auth | Mô tả | Body Request / Query Params |
| :--- | :--- | :---: | :--- | :--- |
| `POST` | `/checkout` | JWT | Đặt hàng từ giỏ hàng | `{ recipientName, phoneNumber, shippingAddress, paymentMethod, customerNote, productIds? }` (`paymentMethod`: `"COD"` \| `"VNPAY"` \| `"MOMO"`) |
| `GET` | `/me` | JWT | Lịch sử đơn hàng của tôi (Phân trang) | Query: `?page=1&limit=10` |
| `GET` | `/:id` | JWT | Xem chi tiết 1 đơn hàng | Params: `id` |
| `PUT` | `/:id/cancel` | JWT | Tự hủy đơn hàng (khi đơn chưa giao) | Params: `id`, Body: `{ cancelReason }` |
| `PUT` | `/:id/address` | JWT | Đổi địa chỉ nhận hàng (khi đơn chưa giao) | Params: `id`, Body: `{ recipientName, phoneNumber, shippingAddress }` |

#### B. Dành cho Quản Trị Viên (Admin / Staff):
Required Roles: `ADMIN`, `SUPER_ADMIN`, `STAFF`

| Method | Endpoint | Auth | Mô tả | Body Request / Query Params |
| :--- | :--- | :---: | :--- | :--- |
| `GET` | `/` | JWT | Xem toàn bộ đơn hàng hệ thống | Query: `?page=1&limit=10&search=...&status=...` (`status`: `"PENDING" \| "PROCESSING" \| "SHIPPED" \| "DELIVERED" \| "CANCELLED"`) |
| `PUT` | `/:id/confirm` | JWT | Duyệt / Xác nhận đơn (`PENDING` -> `PROCESSING`) | Params: `id` |
| `PUT` | `/:id/ship` | JWT | Bàn giao vận chuyển (`PROCESSING` -> `SHIPPED`) | Params: `id`, Body: `{ shippingCode }` |
| `PUT` | `/:id/deliver` | JWT | Đánh dấu Đã giao hàng (`SHIPPED` -> `DELIVERED`) | Params: `id` |
| `PUT` | `/:id/pay` | JWT | Cập nhật Trạng thái Thanh toán (`PAID`) | Params: `id` |
| `PUT` | `/:id/admin-cancel` | JWT | Admin Hủy đơn hàng bất kỳ | Params: `id`, Body: `{ cancelReason }` |

### 3.11. Quản Lý Role & Permission (Admin RBAC)
* `/api/roles`: `GET /`, `GET /paginated`, `GET /:id`, `POST /`, `PUT /:id`, `DELETE /:id`, `POST /:id/permissions` (`{ permissionCodes: [...] }`), `POST /:id/permissions/revoke` (`{ permissionCodes: [...] }`).
* `/api/permissions`: `GET /`, `GET /paginated`, `GET /:id`, `POST /` (`{ name, module, description }`).

---

## 4. HƯỚNG DẪN THIẾT KẾ GIAO DIỆN FRONTEND (FE BLUEPRINT)

Dành cho AI Agent xây dựng giao diện ứng dụng Frontend kết nối với Backend này:

### 4.1. Kiến trúc Đề xuất cho Frontend
* **Framework**: React / Next.js (App Router).
* **Styling**: Tailwind CSS + Shadcn UI / Ant Design / Lucide Icons.
* **State Management**:
  * **Zustand** hoặc **Redux Toolkit**: Quản lý State Auth, User Info, Cart Count.
  * **TanStack Query (React Query)**: Caching & Re-fetching dữ liệu API (Products, Orders, Categories).
* **HTTP Client**: **Axios** (kèm Interceptor tự động xử lý JWT Token & Refresh Token).

### 4.2. Triển khai Axios Interceptor Chuẩn
```typescript
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Gắn Bearer Token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response Interceptor: Tự động Refresh Token khi gặp lỗi 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem('refresh_token');
        const res = await axios.post('http://localhost:5000/api/auth/refresh-token', { refreshToken });
        const { accessToken } = res.data.data;
        localStorage.setItem('access_token', accessToken);
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshErr) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
```

---

### 4.3. Các Trang Giao Diện Cần Xây Dựng (Page Structure)

#### A. Phân Hệ Khách Hàng (Client Storefront)
1. **Trang Chủ (`/`)**:
   * Hero Banner, danh sách Danh mục nổi bật (`GET /api/categories`).
   * Danh sách Sản phẩm mới nhất / Bán chạy (`GET /api/products/paginated?limit=12`).
2. **Trang Danh Sách Sản Phẩm & Tìm Kiếm (`/products`)**:
   * Sidebar lọc theo Danh mục, Thương hiệu.
   * Thanh tìm kiếm sản phẩm (`GET /api/products/paginated?search=...`).
   * Phân trang sản phẩm (Pagination UI component).
3. **Trang Chi Tiết Sản Phẩm (`/products/[id]`)**:
   * Gallery ảnh sản phẩm (`thumbnail` & danh sách ảnh từ `GET /api/product-images`).
   * Giá bán (`price`), Giá khuyến mãi (`discountPrice`), Trạng thái kho.
   * Nút "Thêm vào giỏ hàng" (`POST /api/cart/items`) & "Mua ngay".
4. **Trang Giỏ Hàng (`/cart`)**:
   * Danh sách sản phẩm trong giỏ (`GET /api/cart/me`).
   * Cập nhật số lượng (`PUT /api/cart/items/:productId`), Xóa mục (`DELETE /api/cart/items/:productId`).
   * Tổng tiền, Giảm giá, Nút chuyển sang Checkout.
5. **Trang Thanh Toán (`/checkout`)**:
   * Chọn Địa chỉ giao hàng từ Sổ địa chỉ (`GET /api/user-addresses/me`) hoặc nhập địa chỉ mới.
   * Chọn phương thức thanh toán: `COD`, `VNPAY`, `MOMO`.
   * Ghi chú đơn hàng. Nút "Đặt Hàng" (`POST /api/orders/checkout`).
6. **Trang Quản Lý Tài Khoản & Lịch Sử Đơn Hàng (`/profile` & `/orders`)**:
   * Hồ sơ cá nhân (`GET /me`, `PUT /me`), Đổi mật khẩu.
   * Sổ địa chỉ cá nhân (`/api/user-addresses`).
   * Danh sách Đơn hàng cá nhân (`GET /api/orders/me`), Xem chi tiết đơn hàng, Hủy đơn hàng (`PUT /api/orders/:id/cancel`).

#### B. Phân Hệ Quản Trị Viên (Admin Portal `/admin`)
1. **Dashboard (`/admin/dashboard`)**:
   * Thống kê tổng số đơn hàng, doanh thu, tổng sản phẩm, số lượng user.
2. **Quản Lý Sản Phẩm (`/admin/products`)**:
   * Bảng danh sách sản phẩm phân trang (`GET /api/products/paginated`).
   * Modal / Trang Tạo mới & Chỉnh sửa sản phẩm (`POST /api/products`, `PUT /api/products/:id`).
   * Component Upload ảnh sản phẩm đơn/nhiều (`POST /api/upload`, `POST /api/product-images`).
3. **Quản Lý Đơn Hàng (`/admin/orders`)**:
   * Bảng danh sách toàn bộ đơn hàng (`GET /api/orders`), Bộ lọc theo trạng thái (`PENDING`, `PROCESSING`, `SHIPPED`, `DELIVERED`, `CANCELLED`).
   * Nút thao tác chuyển đổi trạng thái:
     * **Duyệt đơn** (`PUT /api/orders/:id/confirm`)
     * **Bàn giao vận chuyển** (Mở popup nhập `shippingCode` -> `PUT /api/orders/:id/ship`)
     * **Đã giao hàng** (`PUT /api/orders/:id/deliver`)
     * **Cập nhật đã thanh toán** (`PUT /api/orders/:id/pay`)
     * **Admin Hủy đơn** (`PUT /api/orders/:id/admin-cancel`)
4. **Quản Lý Tồn Kho (`/admin/inventories`)**:
   * Bảng tồn kho theo Sản phẩm, Nhập hàng (`POST /api/inventories`), Cập nhật số lượng nhập kho.
5. **Quản Lý Người Dùng & Phân Quyền (`/admin/users`, `/admin/roles`)**:
   * Danh sách người dùng (`GET /api/users/paginated`), Khóa/Kích hoạt user (`PATCH /:id/block`, `PATCH /:id/activate`).
   * Gán vai trò (`PUT /:id/role`).
   * Quản lý Vai trò & Gán Mã quyền (`POST /api/roles/:id/permissions`).

---

## 5. ĐIỂM CẦN LƯU Ý KHI LẬP TRÌNH FRONTEND (GOTCHAS)

1. **Khởi tạo kết nối SSE khi Đăng nhập**: Chỉ kết nối `EventSource` khi đã đăng nhập thành công. Đảm bảo đóng kết nối (`eventSource.close()`) khi đăng xuất hoặc unmount component.
2. **Định dạng Upload Ảnh**:
   * Upload đơn lẻ (`/api/upload`): `formData.append("file", fileObject)`.
   * Upload nhiều ảnh sản phẩm (`/api/product-images`): `formData.append("images", file1)`, `formData.append("images", file2)`, `formData.append("productId", "...")`, `formData.append("isThumbnail", "true")`.
3. **Validate dữ liệu ở Form**:
   * Số điện thoại: Phải khớp định dạng số điện thoại Việt Nam (10 chữ số, bắt đầu bằng `03`, `05`, `07`, `08`, `09`).
   * Giá cả, Số lượng: Phải là số dương `> 0`.
4. **Phân quyền Route (Protected Routes)**:
   * Chặn không cho Khách hàng chưa đăng nhập vào `/checkout`, `/profile`, `/orders`.
   * Chặn tất cả người dùng không phải `ADMIN`/`SUPER_ADMIN`/`STAFF` truy cập phân hệ `/admin`.
