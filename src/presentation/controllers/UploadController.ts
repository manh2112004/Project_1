import { CloudinaryService } from "../../infrastructure/services/CloudinaryService";
import { Request, Response } from "express";

export class UploadController {
  constructor(private readonly cloudinaryService: CloudinaryService) {}

  async upload(req: Request, res: Response): Promise<void> {
    try {
      if (!req.file) {
        res.status(400).json({
          success: false,
          message: "Không tìm thấy file ảnh tải lên.",
        });
        return;
      }
      const imageUrl = await this.cloudinaryService.uploadImage(
        req.file.buffer,
      );
      res.status(200).json({
        success: true,
        message: "Tải ảnh lên thành công",
        url: imageUrl,
      });
    } catch (error: any) {
      console.error("❌ Lỗi Upload Controller:", error);
      res.status(400).json({
        success: false,
        message: error.message || "Đã xảy ra lỗi trong quá trình tải ảnh lên",
      });
    }
  }
}
