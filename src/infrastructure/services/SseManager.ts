import { Response } from "express";

class SseManager {
  private clients: Map<string, Response[]> = new Map();
  constructor() {
    setInterval(() => {
      this.pingAll();
    }, 30000);
  }
  public addClient(userId: string, res: Response): void {
    // Thiết lập Header chuẩn Server-Sent Events (SSE)
    res.setHeader("Content-Type", "text/event-stream"); //dữ liệu gửi lên sẽ là một luồng sự kiện (event stream) liên tục
    res.setHeader("Cache-Control", "no-cache"); //Ngăn chặn trình duyệt và các máy chủ trung gian (proxy) lưu trữ (cache) dữ liệu.
    res.setHeader("Connection", "keep-alive"); //Chỉ định rằng kết nối TCP (kết nối mạng) giữa Client và Server phải được giữ mở liên tục.
    res.setHeader("Access-Control-Allow-Origin", "*"); //Xử lý vấn đề bảo mật CORS (Cross-Origin Resource Sharing).
    res.flushHeaders(); //đẩy mảng header về client mà ko cần boby
    const userClients = this.clients.get(userId) || [];
    userClients.push(res);
    this.clients.set(userId, userClients);
    console.log(
      ` [SSE] Người dùng [${userId}] đã kết nối Realtime SSE. (Tổng kết nối: ${userClients.length})`,
    );
    res.on("close", () => {
      this.removeClient(userId, res);
    });
  }
  public removeClient(userId: string, res: Response): void {
    //lấy ra danh sách thiết bị(kết nối)
    const userClients = this.clients.get(userId);
    if (userClients) {
      const filtered = userClients.filter((client) => client !== res);
      if (filtered.length > 0) {
        this.clients.set(userId, filtered);
      } else {
        this.clients.delete(userId);
      }
      console.log(` [SSE] Người dùng [${userId}] đã ngắt kết nối SSE.`);
    }
  }
  public sendToUser(userId: string, event: string, data: any): void {
    const userClients = this.clients.get(userId);
    if (!userClients || userClients.length === 0) return;
    const payload = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
    userClients.forEach((res) => {
      res.write(payload);
    });
    console.log(
      `⚡ [SSE] Đã phát sự kiện "${event}" tới người dùng [${userId}]`,
    );
  }
  public sendToAll(event: string, data: any): void {
    const payload = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
    this.clients.forEach((userClients) => {
      userClients.forEach((res) => {
        res.write(payload);
      });
    });
    console.log(
      `⚡ [SSE Broadcast] Đã phát sự kiện "${event}" tới toàn bộ kết nối.`,
    );
  }
  private pingAll(): void {
    this.clients.forEach((userClients) => {
      userClients.forEach((res) => {
        res.write(": ping\n\n");
      });
    });
  }
}
export const sseManager = new SseManager();
