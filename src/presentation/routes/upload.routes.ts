import { Router } from "express";
import { CloudinaryService } from "../../infrastructure/services/CloudinaryService";
import { UploadController } from "../controllers/UploadController";
import { upload } from "../middlewares/upload";
import { authenticate } from "../middlewares/authenticate";

const uploadRouterInstance = Router();

export const uploadRouter = (): Router => {
    const cloudinaryService = new CloudinaryService();
    const uploadController = new UploadController(cloudinaryService);

    // Yêu cầu Đăng nhập (Authenticate JWT) mới được tải file lên Cloudinary
    uploadRouterInstance.post("/", authenticate, upload.single("file"), (req, res) => uploadController.upload(req, res));
    return uploadRouterInstance;
};