import jwt from "jsonwebtoken";
import { IJwtService } from "../../application/services/IJwtService";
import { config } from "../config/env";

export class JwtService implements IJwtService {
  generateToken(payload: Record<string, any>, expiresIn: string | number): string {
    return jwt.sign(payload as any, config.jwt.secret, { expiresIn } as any);
  }

  verifyToken(token: string): Record<string, any> {
    try {
      return jwt.verify(token, config.jwt.secret) as Record<string, any>;
    } catch (error) {
      throw new Error("Mã xác thực không hợp lệ hoặc đã hết hạn.");
    }
  }
}
