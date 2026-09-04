# 🛒 E-Commerce Multi-Store & Realtime Fullstack Platform

> Hệ thống Thương mại Điện tử Đa cửa hàng (Multi-Store / Multi-Vendor) toàn diện được xây dựng theo kiến trúc **Clean Architecture / Domain-Driven Design (DDD)** ở Backend kết hợp giao diện hiện đại **React 19 + Vite + Tailwind CSS** ở Frontend, hỗ trợ Realtime Chat (Socket.IO), SSE, Quản lý Giỏ hàng Redis và Cổng thanh toán trực tuyến (PayOS).

---

## 📑 Mục Lục
- [🌟 Tính Năng Nổi Bật](#-tính-năng-nổi-bật)
- [🏗 Kiến Trúc Hệ Thống](#-kiến-trúc-hệ-thống)
- [💻 Công Nghệ Sử Dụng (Tech Stack)](#-công-nghệ-sử-dụng-tech-stack)
- [📁 Cấu Trúc Thư Mục Dự Án](#-cấu-trúc-thư-mục-dự-án)
- [⚙️ Hướng Dẫn Cài Đặt & Khởi Chạy](#️-hướng-dẫn-cài-đặt--khởi-chạy)
  - [1. Yêu cầu hệ thống](#1-yêu-cầu-hệ-thống)
  - [2. Cấu hình biến môi trường (.env)](#2-cấu-hành-biến-môi-trường-env)
  - [3. Khởi chạy Backend](#3-khởi-chạy-backend)
  - [4. Khởi chạy Frontend](#4-khởi-chạy-frontend)
- [🛠 Các Lệnh CLI & Seed Data Hữu Ích](#-các-lệnh-cli--seed-data-hữu-ích)
- [📡 Danh Sách API & Swagger Documentation](#-danh-sách-api--swagger-documentation)
- [🔐 Cơ Chế Xác Thực & Phân Quyền (RBAC)](#-cơ-chế-xác-thực--phân-quyền-rbac)
- [⚡ Xử Lý Tải Cao & Chống Race Condition](#-xử-lý-tải-cao--chống-race-condition)
- [🤝 Đóng Góp & Phát Triển](#-đóng-góp--phát-triển)

---

## 🌟 Tính Năng Nổi Bật

### 1. Phân Hệ Khách Hàng (Client Storefront)
- **Duyệt & Tìm kiếm Sản phẩm**: Tìm kiếm theo tên, lọc theo Danh mục (Category), Thương hiệu (Brand), mức giá và phân trang mượt mà.
- **Chi Tiết Sản Phẩm & Thư Viện Ảnh**: Hiển thị ảnh đại diện, album ảnh nhiều góc độ, thông tin tồn kho, giá khuyến mãi.
- **Giỏ Hàng Siêu Tốc (Redis)**: Quản lý giỏ hàng trên In-Memory Redis, cập nhật số lượng, xóa từng món hoặc xóa toàn bộ giỏ hàng với tốc độ mili-giây.
- **Sổ Địa Chỉ Thông Minh**: Tích hợp bản đồ trực quan **Leaflet / OpenStreetMap** để chọn tọa độ, lưu nhiều địa chỉ nhận hàng và đặt địa chỉ mặc định.
- **Đặt Hàng & Thanh Toán Đa Dạng**: Hỗ trợ thanh toán COD, cổng thanh toán trực tuyến **PayOS (QR Chuyển khoản)**, VNPay, MoMo.
- **Theo Dõi Đơn Hàng**: Quản lý lịch sử đơn mua, xem chi tiết tiến độ giao hàng, đổi địa chỉ nhận hoặc hủy đơn khi chưa giao.
- **Realtime Chat Tư Vấn**: Nhắn tin trực tiếp thời gian thực giữa Khách hàng và Người bán qua **Socket.IO**.

### 2. Phân Hệ Người Bán (Seller / Store Portal)
- **Quản Lý Thông Tin Cửa Hàng**: Cập nhật hồ sơ cửa hàng, địa chỉ, giờ mở/đóng cửa, logo, định vị GPS trên bản đồ.
- **Quản Lý Sản Phẩm & Tồn Kho**: Tạo sản phẩm, tải ảnh lên Cloudinary, theo dõi số lượng tồn kho và lịch sử nhập hàng.
- **Xử Lý Đơn Hàng Cửa Hàng**: Xem đơn hàng thuộc gian hàng của mình, cập nhật trạng thái đơn hàng.
- **Tin Nhắn Chăm Sóc Khách Hàng**: Tiếp nhận tin nhắn realtime từ khách mua để tư vấn ngay tức thì.

### 3. Phân Hệ Quản Trị Hệ Thống (Admin Portal)
- **Thống Kê Dashboard**: Theo dõi tổng doanh thu, tổng số đơn hàng, số lượng người dùng và sản phẩm trên toàn hệ thống.
- **Quản Lý Danh Mục & Thương Hiệu**: Tạo cây danh mục đa cấp (Category hierarchy) và quản lý thương hiệu đối tác.
- **Quản Trị Người Dùng**: Danh sách người dùng, xem chi tiết, đổi vai trò (Role), khóa tài khoản (`block`) hoặc kích hoạt lại (`activate`).
- **Phân Quyền Động (Dynamic RBAC)**: Quản lý nhóm quyền (Roles) và gán quyền chi tiết (`permissionCodes`) tới từng module chức năng.
- **Quản Trị Đơn Hàng Toàn Hệ Thống**: Duyệt đơn hàng (`PENDING` ➔ `PROCESSING`), bàn giao vận chuyển kèm mã vận đơn (`SHIPPED`), xác nhận đã giao (`DELIVERED`), cập nhật thanh toán hoặc hủy đơn khẩn cấp.
- **Kiểm Soát Tồn Kho Toàn Cục**: Theo dõi tồn kho của tất cả sản phẩm, giá nhập (`importPrice`) và số lượng hàng tồn.

---

## 🏗 Kiến Trúc Hệ Thống

Dự án áp dụng mô hình **Clean Architecture / Domain-Driven Design (DDD)** nhằm tách biệt rõ ràng giữa Business Logic và Framework/Database:

```
src/
├── domain/                  # Lõi nghiệp vụ (Do not depend on external frameworks)
│   ├── entities/            # Domain Entities (User, Product, Order, Store, Cart, ...)
│   ├── value-objects/       # Value Objects (Email, Money, Address, ...)
│   ├── repositories/        # Repository Interfaces
│   ├── events/              # Domain Events
│   └── errors/              # Custom Domain Exceptions
│
├── application/             # Tầng ứng dụng & Use Cases điều phối luồng
│   ├── use-cases/           # Toàn bộ Use Cases (Auth, Order, Cart, Product, Store, ...)
│   ├── dtos/                # Data Transfer Objects
│   ├── event-handlers/      # Xử lý sự kiện bất đồng bộ
│   ├── services/            # Application Services
│   └── ports/               # Giao tiếp ngoại vi (PaymentPort, StoragePort, ...)
│
├── infrastructure/          # Triển khai kỹ thuật & tích hợp bên thứ ba
│   ├── database/            # TypeORM Data Source, Orm Entities, Migrations, CLI scripts
│   ├── cache/               # Redis Client & Redis Cache Layer
│   ├── realtime/            # Socket.IO Adapter & Redis PubSub Adapter
│   ├── services/            # Cloudinary, PayOS, Nodemailer, Bcrypt, JWT
│   └── config/              # Environment config, Swagger setup
│
└── presentation/            # Giao tiếp với người dùng và Client
    ├── controllers/         # Express Controllers
    ├── routes/              # Express API Routes
    ├── middlewares/         # JWT Auth, RBAC, Rate Limiting, Safety Net Error Handler
    ├── sockets/             # Socket.IO Chat Gateway & Event Handlers
    └── docs/                # JSDoc / Swagger Definitions
```

---

## 💻 Công Nghệ Sử Dụng (Tech Stack)

### Backend
| Thành phần | Công nghệ / Thư viện |
| :--- | :--- |
| **Ngôn ngữ & Runtime** | Node.js (v20+), TypeScript (v7/v5), TSX |
| **Web Framework** | Express 5 |
| **Cơ Sở Dữ Liệu** | PostgreSQL / MySQL kết hợp **TypeORM** |
| **In-Memory Cache** | **Redis** (ioredis) – Lưu Cart & Session |
| **Realtime** | **Socket.IO** (Realtime Chat) + **Server-Sent Events (SSE)** |
| **Cổng Thanh Toán** | **PayOS** (@payos/node), COD, VNPay, MoMo |
| **Lưu Trữ Ảnh** | **Cloudinary** (Multi-part upload với Multer) |
| **Bảo Mật & Auth** | JWT (Access & Refresh Tokens), Bcrypt, rate-limiter-flexible |
| **Tài Liệu API** | Swagger UI (`swagger-jsdoc`, `swagger-ui-express`) |
| **Testing** | Vitest, Concurrency Race Condition Scripts |

### Frontend
| Thành phần | Công nghệ / Thư viện |
| :--- | :--- |
| **Core** | React 19, TypeScript, Vite |
| **Styling** | Tailwind CSS v4, Lucide React Icons |
| **State Management** | **Zustand** (Global Auth/Cart Store) |
| **Data Fetching** | **TanStack React Query v5** (Caching & Optimistic Updates) |
| **HTTP Client** | Axios (Auto-refresh Token Interceptor) |
| **Bản Đồ Địa Chỉ** | Leaflet, OpenStreetMap (@types/leaflet) |
| **Realtime Client** | Socket.IO Client, Emoji Picker React |

---

## 📁 Cấu Trúc Thư Mục Dự Án

```
Project_1/
├── src/                             # Mã nguồn Backend (Clean Architecture)
├── frontend/                        # Mã nguồn Frontend (React 19 + Vite)
│   ├── src/
│   │   ├── components/              # Component tái sử dụng (Layout, Chat, Modals, ...)
│   │   ├── hooks/                   # Custom React Hooks
│   │   ├── pages/
│   │   │   ├── admin/               # Các trang Quản trị Admin
│   │   │   ├── auth/                # Đăng nhập, Đăng ký, Quên mật khẩu
│   │   │   ├── client/              # Cửa hàng, Giỏ hàng, Đặt hàng, Profile, Map
│   │   │   └── seller/              # Kênh người bán (Seller Dashboard)
│   │   ├── services/                # Axios API Services
│   │   ├── store/                   # Zustand Stores
│   │   └── types/                   # TypeScript Type Definitions
├── FRONTEND_INTEGRATION_GUIDE.md    # Tài liệu hướng dẫn tích hợp chi tiết cho FE
├── package.json                     # Cấu hình Backend & Scripts
└── tsconfig.json                    # Cấu hình TypeScript
```

---

## ⚙️ Hướng Dẫn Cài Đặt & Khởi Chạy

### 1. Yêu cầu hệ thống
- **Node.js**: Phiên bản `>= 18.x` (Khuyến nghị `v20.x` LTS).
- **PostgreSQL**: Phiên bản `>= 14.x` (hoặc PostgreSQL Cloud như Supabase, Neon, AWS RDS).
- **Redis Server**: Phiên bản `>= 6.x` (hoặc Upstash / Redis Cloud).

---

### 2. Cấu hình biến môi trường (.env)

Tạo file `.env` (hoặc `.env.production` / `.env.staging`) tại thư mục gốc của dự án:

```env
NODE_ENV=development
PORT=3000

# Kết nối Cơ Sở Dữ Liệu PostgreSQL
DATABASE_URL=postgresql://username:password@localhost:5432/project1_db
DB_LOGGING=false

# Kết nối Redis
REDIS_URL=redis://localhost:6379

# Bảo mật JWT
JWT_SECRET=your_super_secret_jwt_access_key
JWT_REFRESH_SECRET=your_super_secret_jwt_refresh_key

# Tích hợp Cloudinary (Upload Ảnh)
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Tích hợp Cổng Thanh Toán PayOS
PAYOS_CLIENT_ID=your_payos_client_id
PAYOS_API_KEY=your_payos_api_key
PAYOS_CHECKSUM_KEY=your_payos_checksum_key
```

Cấu hình file `frontend/.env`:
```env
VITE_API_URL=http://localhost:3000/api
VITE_SOCKET_URL=http://localhost:3000
```

---

### 3. Khởi chạy Backend

1. **Cài đặt dependencies**:
   ```bash
   npm install
   ```

2. **Khởi tạo dữ liệu mẫu (Seed Database)**:
   ```bash
   # Cấp quyền & Roles chuẩn hệ thống
   npm run seed:permissions

   # Tạo tài khoản Super Admin mặc định
   npm run admin:create

   # Nạp dữ liệu mẫu (Danh mục, Thương hiệu, Sản phẩm, Tồn kho)
   npm run seed
   ```

3. **Khởi chạy máy chủ Backend (Dev Mode)**:
   ```bash
   npm run dev
   ```
   > 🚀 Máy chủ Backend sẽ chạy tại: **`http://localhost:3000`**  
   > 📖 Swagger API Docs sẵn sàng tại: **`http://localhost:3000/api-docs`**

---

### 4. Khởi chạy Frontend

1. **Di chuyển vào thư mục frontend và cài đặt dependencies**:
   ```bash
   cd frontend
   npm install
   ```

2. **Khởi chạy giao diện Frontend (Dev Mode)**:
   ```bash
   npm run dev
   ```
   > 🌐 Giao diện Client sẽ chạy tại: **`http://localhost:5173`**

---

## 🛠 Các Lệnh CLI & Seed Data Hữu Ích

Backend cung cấp sẵn nhiều tập lệnh hỗ trợ vận hành và kiểm thử:

| Lệnh npm | Mô tả chức năng |
| :--- | :--- |
| `npm run dev` | Chạy Backend chế độ phát triển với live-reload (`tsx watch`) |
| `npm run build` | Biên dịch TypeScript sang JavaScript trong thư mục `dist/` |
| `npm run seed:permissions` | Khởi tạo bảng danh sách Quyền (Permissions) và Roles chuẩn |
| `npm run admin:create` | Khởi tạo tài khoản Super Admin quản trị cao nhất |
| `npm run seed` | Seed dữ liệu mẫu cho Categories, Brands, Products, Inventories |
| `npm run clean:carts` | Dọn dẹp các giỏ hàng rỗng hoặc hết hạn trên Redis |
| `npm run seed:race` | Nạp dữ liệu giả lập để kiểm thử Race Condition trong mua hàng |
| `npm run test:load` | Chạy kịch bản kiểm thử tải đồng thời (Concurrency Test) |
| `npm run test:ratelimit` | Chạy kịch bản kiểm tra khả năng chặn spam của Rate Limiter |
| `npm run test` | Chạy bộ Unit Tests với **Vitest** |

---

## 📡 Danh Sách API & Swagger Documentation

Tài liệu tương tác đầy đủ có sẵn tại endpoint `/api-docs` khi Backend đang chạy.

### Tóm tắt các nhóm API chính:

| Module | Base Route | Các Chức Năng Chính |
| :--- | :--- | :--- |
| **Authentication** | `/api/auth` | Đăng ký, Đăng nhập, Làm mới Token (`refresh-token`) |
| **User & Profile** | `/api/users` | Thông tin cá nhân, Đổi mật khẩu, Khóa/Mở User, SSE Realtime |
| **User Address** | `/api/user-addresses` | Thêm, sửa, xóa, đặt mặc định địa chỉ giao hàng |
| **Store & Vendor** | `/api/stores` | Tạo cửa hàng, duyệt cửa hàng, cập nhật thông tin gian hàng |
| **Store Address** | `/api/store-addresses` | Quản lý địa chỉ tọa độ GPS của chi nhánh cửa hàng |
| **Category** | `/api/categories` | CRUD danh mục sản phẩm, phân trang, danh mục cha-con |
| **Brand** | `/api/brand` | CRUD thương hiệu sản phẩm |
| **Product** | `/api/products` | CRUD sản phẩm, bộ lọc tìm kiếm, phân trang |
| **Media Upload** | `/api/upload`, `/api/product-images` | Upload ảnh đơn lẻ / Album nhiều ảnh lên Cloudinary |
| **Inventory** | `/api/inventories` | Quản lý số lượng tồn kho và giá nhập theo sản phẩm |
| **Cart (Redis)** | `/api/cart` | Thêm, sửa, xóa món khỏi giỏ hàng, làm rỗng giỏ |
| **Order** | `/api/orders` | Checkout, lịch sử mua hàng, duyệt đơn, bàn giao, hủy đơn |
| **Payment** | `/api/payments` | Tạo link thanh toán PayOS, Webhook xử lý giao dịch |
| **Chat Realtime** | `/api/chat` + Socket.IO | Lịch sử đoạn chat, gửi tin nhắn, Socket Gateway |
| **RBAC Roles** | `/api/roles`, `/api/permissions` | Tạo vai trò, phân quyền chi tiết cho từng vai trò |

> Chi tiết tham số Payload và ví dụ Request/Response được tài liệu hóa rõ ràng trong [FRONTEND_INTEGRATION_GUIDE.md](file:///d:/visual%20code/Dev/Project/Project_1/FRONTEND_INTEGRATION_GUIDE.md).

---

## 🔐 Cơ Chế Xác Thực & Phân Quyền (RBAC)

### 1. JSON Web Token (JWT)
- **Access Token**: Có thời hạn ngắn, truyền qua Header `Authorization: Bearer <access_token>`.
- **Refresh Token**: Dùng để cấp lại Access Token mới tự động khi hết hạn mà không làm gián đoạn trải nghiệm người dùng.

### 2. Hai Lớp Phân Quyền
1. **Vai Trò Cốt Lõi (`roleCode`)**:
   - `SUPER_ADMIN`: Toàn quyền hệ thống.
   - `ADMIN` / `STAFF`: Quản lý vận hành (Đơn hàng, Kho hàng, Sản phẩm).
   - `CUSTOMER`: Mua sắm, quản lý giỏ hàng, địa chỉ và đơn hàng cá nhân.
2. **Mã Quyền Chi Tiết (`permissionCodes`)**:
   - Kiểm soát truy cập ở cấp độ Endpoint (ví dụ: `CREATE_PRODUCT`, `UPDATE_PRODUCT`, `DELETE_PRODUCT`, `MANAGE_USERS`).

---

## ⚡ Xử Lý Tải Cao & Chống Race Condition

Hệ thống được thiết kế để xử lý ổn định trong các dịp Flash Sale hoặc lưu lượng truy cập đột biến:
- **Redis Cart Caching**: Giảm tải truy vấn trực tiếp vào Database chính khi người dùng thao tác liên tục với giỏ hàng.
- **Database Transaction & Row-Level Locking**: Chống overselling khi nhiều người cùng đặt món hàng cuối cùng trong kho.
- **Rate Limiting**: Giới hạn 200 requests/phút/IP để ngăn ngừa brute-force và DDoS.
- **Safety Net Error Handler**: Bẫy mọi lỗi Unhandled Exception ở tầng cuối của Express pipeline nhằm ngăn ngừa sự cố crash server.

---

## 🤝 Đóng Góp & Phát Triển

1. Fork repository và tạo nhánh mới (`git checkout -b feature/AmazingFeature`).
2. Commit các thay đổi (`git commit -m 'feat: Add AmazingFeature'`).
3. Push lên nhánh (`git push origin feature/AmazingFeature`).
4. Mở một **Pull Request** để được review và merge vào codebase chính.

---

<p align="center">
  Được xây dựng với sự tận tâm nhằm mang lại hiệu năng cao và trải nghiệm người dùng tối ưu.
</p>
