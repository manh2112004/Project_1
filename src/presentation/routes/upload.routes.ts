import { Router } from "express";
import { CloudinaryService } from "../../infrastructure/services/CloudinaryService";
import { UploadController } from "../controllers/UploadController";
import { upload } from "../middlewares/upload";
import { authenticate } from "../middlewares/authenticate";
import { uploadRateLimiter } from "../middlewares/rateLimiter";

const uploadRouterInstance = Router();

export const uploadRouter = (): Router => {
    const cloudinaryService = new CloudinaryService();
    const uploadController = new UploadController(cloudinaryService);

    // Yêu cầu Đăng nhập (Authenticate JWT) + Rate Limit 10 file/phút mới được tải file lên Cloudinary
    uploadRouterInstance.post("/", authenticate, uploadRateLimiter, upload.single("file"), (req, res) => uploadController.upload(req, res));
    return uploadRouterInstance;
};