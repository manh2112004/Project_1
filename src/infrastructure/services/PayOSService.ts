import { PayOS } from "@payos/node";
import { config } from "../config/env";

export class PayOSService {
  private payOS: PayOS;

  constructor() {
    this.payOS = new PayOS({
      clientId: config.payos.clientId,
      apiKey: config.payos.apiKey,
      checksumKey: config.payos.checksumKey,
    });
  }

  /**
   * Chuyển đổi mã đơn hàng chuỗi thành số nguyên dương hợp lệ cho PayOS (orderCode <= 9007199254740991)
   */
  public generateNumericOrderCode(orderId: string): number {
    let hash = 5381;
    for (let i = 0; i < orderId.length; i++) {
      hash = (hash << 5) + hash + orderId.charCodeAt(i);
      hash = hash & hash;
    }
    const positive = Math.abs(hash);
    return (positive % 900000000) + 100000000;
  }

  async createPaymentLink(params: {
    orderId: string;
    orderCodeStr: string;
    amount: number;
    description: string;
    items?: Array<{ name: string; quantity: number; price: number }>;
    returnUrl: string;
    cancelUrl: string;
  }) {
    const payosOrderCode = this.generateNumericOrderCode(params.orderId);

    // PayOS giới hạn description tối đa 25 ký tự
    const cleanDescription = params.description.slice(0, 25);

    const paymentData = {
      orderCode: payosOrderCode,
      amount: Math.round(params.amount),
      description: cleanDescription,
      items: params.items,
      returnUrl: params.returnUrl,
      cancelUrl: params.cancelUrl,
    };

    const response = await this.payOS.paymentRequests.create(paymentData);
    return {
      ...response,
      payosOrderCode,
    };
  }

  async verifyWebhookData(webhookBody: any) {
    return await this.payOS.webhooks.verify(webhookBody);
  }
}
