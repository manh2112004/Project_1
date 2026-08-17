import { Server, Socket } from "socket.io";
import jwt from "jsonwebtoken";
import { config } from "../../infrastructure/config/env";

export class ChatSocketGateway {
  constructor(private readonly io: Server) { }

  public register(): void {
    // hàm đăng ký Middleware của Socket.IO
    this.io.use((socket: Socket, next) => {
      const token =
        socket.handshake.auth?.token || socket.handshake.headers?.authorization;
      if (!token) {
        return next(new Error("Authentication error: Missing token"));
      }
      try {
        const decoded = jwt.verify(
          token.replace("Bearer ", ""),
          config.jwt.secret,
        ) as any;
        socket.data.user = decoded; // Gán thông tin user vào Socket session
        next();
      } catch (err) {
        next(new Error("Authentication error: Invalid token"));
      }
    });

    // Lắng nghe các sự kiện WS
    this.io.on("connection", (socket: Socket) => {
      const userId = socket.data.user.id;

      // Auto join vào channel của cá nhân user để nhận notification riêng
      socket.join(`user:${userId}`);

      // Tham gia phòng chat cụ thể
      socket.on("chat:join_room", (conversationId: string) => {
        socket.join(`conversation:${conversationId}`);
      });

      // Rời phòng chat
      socket.on("chat:leave_room", (conversationId: string) => {
        socket.leave(`conversation:${conversationId}`);
      });

      // Báo hiệu đang gõ phím
      socket.on(
        "chat:typing",
        (data: { conversationId: string; isTyping: boolean }) => {
          socket
            .to(`conversation:${data.conversationId}`)
            .emit("chat:user_typing", {
              userId,
              isTyping: data.isTyping,
            });
        },
      );

      // Báo hiệu đã đọc tin nhắn trong phòng chat
      socket.on("chat:read_messages", (data: { conversationId: string }) => {
        socket
          .to(`conversation:${data.conversationId}`)
          .emit("chat:messages_read", {
            conversationId: data.conversationId,
            readByUserId: userId,
            readAt: new Date().toISOString(),
          });
      });

      socket.on("disconnect", () => {
        console.log(`User ${userId} disconnected socket ${socket.id}`);
      });
    });
  }
}
