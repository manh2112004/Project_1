import { v2 as cloudinary } from "cloudinary";
import { config } from "../config/env";

// Cấu hình SDK Cloudinary
cloudinary.config({
    cloud_name: config.cloudinary.cloudName,
    api_key: config.cloudinary.apiKey,
    api_secret: config.cloudinary.apiSecret,
});

export class CloudinaryService {
    /**
     * Tải ảnh lên Cloudinary từ Buffer lưu trong bộ nhớ tạm (RAM)
     * @param fileBuffer Buffer của file hình ảnh được lấy từ Multer memoryStorage
     * @returns Trả về URL bảo mật (secure_url) của hình ảnh trên Cloudinary
     */
    async uploadImage(fileBuffer: Buffer): Promise<string> {
        return new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder: "products", // Đưa ảnh vào thư mục 'products' trên Cloudinary
                },
                (error, result) => {
                    if (error) {
                        return reject(new Error(`Lỗi tải ảnh lên Cloudinary: ${error.message}`));
                    }
                    if (!result) {
                        return reject(new Error("Không nhận được kết quả trả về từ Cloudinary."));
                    }
                    // Trả về link HTTPS bảo mật
                    resolve(result.secure_url);
                }
            );

            // Ghi buffer vào stream để gửi đi
            uploadStream.end(fileBuffer);
        });
    }
}
