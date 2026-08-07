export interface UpdateShippingAddressDto {
  orderId: string;
  userId?: string; // Dùng khi khách tự sửa đơn của mình
  recipientName: string;
  phoneNumber: string;
  shippingAddress: string;
}
