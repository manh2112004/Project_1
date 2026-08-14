export enum MessageType {
  TEXT = "TEXT",                 // Tin nhắn văn bản thông thường
  IMAGE = "IMAGE",               // Tin nhắn hình ảnh
  PRODUCT_CARD = "PRODUCT_CARD", // Thẻ xem nhanh sản phẩm (Product Preview)
  ORDER_CARD = "ORDER_CARD",     // Thẻ xem nhanh đơn hàng (Order Preview)
  SYSTEM = "SYSTEM",             // Tin nhắn hệ thống tự động
}

export enum SenderType {
  CUSTOMER = "CUSTOMER", // Người gửi là Khách hàng
  STORE = "STORE",       // Người gửi là Cửa hàng / Người bán
  SYSTEM = "SYSTEM",     // Người gửi là Hệ thống tự động
}
