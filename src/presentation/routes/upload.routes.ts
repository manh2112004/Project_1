import { Router } from "express";
import { CloudinaryService } from "../../infrastructure/services/CloudinaryService";
import { UploadController } from "../controllers/UploadController";
import {upload} from "../middlewares/upload"
const uploadRouterInstance = Router();
export const uploadRouter=():Router=>{
    
    const cloudinaryService = new CloudinaryService();
    const uploadController = new UploadController(cloudinaryService);
    uploadRouterInstance.post("/", upload.single("file"), (req, res) => uploadController.upload(req, res));
    return uploadRouterInstance;
}