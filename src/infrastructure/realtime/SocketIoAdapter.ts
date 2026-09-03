import http from "http";
import { Server } from "socket.io";
import { Redis } from "ioredis";
import { createAdapter } from "@socket.io/redis-adapter"; // Import Adapter của Socket.IO
import { IRealtimeNotifier } from "../../application/ports/IRealtimeNotifier";
import { config } from "../../infrastructure/config/env";

export class SocketIoAdapter implements IRealtimeNotifier {
  private static instance: SocketIoAdapter;
  //! đảm báo gán giá trị cho biến
  private io!: Server;

  private constructor() {}

  public static getInstance(): SocketIoAdapter {
    if (!SocketIoAdapter.instance) {
      SocketIoAdapter.instance = new SocketIoAdapter();
    }
    return SocketIoAdapter.instance;
  }
  public async initialize(httpServer: http.Server): Promise<Server> {
    this.io = new Server(httpServer, {
      cors: { origin: "*", methods: ["GET", "POST"] },
      transports: ["websocket", "polling"],
    });

    // Kết nối Redis Adapter bằng IORedis
    if (config.redis.url) {
      const pubClient = new Redis(config.redis.url, {
        tls: {
          rejectUnauthorized: false,
        },
      });

      // 2. Tạo subClient
      const subClient = pubClient.duplicate();
      pubClient.on("error", (err) => console.error("❌ Lỗi Redis Pub:", err));
      subClient.on("error", (err) => console.error("❌ Lỗi Redis Sub:", err));
      // 3. Gắn Adapter (Lưu ý: ioredis tự động connect, không cần await .connect() như node-redis)
      this.io.adapter(createAdapter(pubClient, subClient));
      console.log("✅ Đã tích hợp Redis Adapter cho Socket.IO thành công!");
    }
    return this.io;
  }

  public emitToRoom(room: string, event: string, payload: any): void {
    if (this.io) {
      this.io.to(room).emit(event, payload); //lọc ra tất cả những kết nối (Socket) đang có mặt trong phòng
      //Bắn gói tin chứa payload kèm theo tên sự kiện event xuống tất cả các thiết bị đang ở trong phòng
    }
  }

  public emitToUser(userId: string, event: string, payload: any): void {
    if (this.io) {
      this.io.to(`user:${userId}`).emit(event, payload);
    }
  }
}
