export interface IJwtService {
  generateToken(payload: Record<string, any>, expiresIn: string | number): string;
  verifyToken(token: string): Record<string, any>;
}
