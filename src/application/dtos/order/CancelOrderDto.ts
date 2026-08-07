export interface CancelOrderDto {
  orderId: string;
  userId?: string; // Dùng khi khách tự hủy đơn của mình
  cancelReason: string;
}
