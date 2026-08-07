export enum OrderStatus {
  PENDING = "PENDING", // Chờ xử lý / Chờ thanh toán
  PROCESSING = "PROCESSING", // Đang chuẩn bị hàng
  SHIPPED = "SHIPPED", // Đang giao hàng
  DELIVERED = "DELIVERED", // Đã giao hàng thành công
  CANCELLED = "CANCELLED", // Đã hủy đơn
}

export enum PaymentMethod {
  COD = "COD", // Thanh toán khi nhận hàng
  VNPAY = "VNPAY", // Ví VNPay
  MOMO = "MOMO", // Ví MoMo
}

export enum PaymentStatus {
  UNPAID = "UNPAID", // Chưa thanh toán
  PAID = "PAID", // Đã thanh toán
  REFUNDED = "REFUNDED", // Đã hoàn tiền
}
