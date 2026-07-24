import multer from "multer";

export const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024, // Giới hạn kích thước file tải lên tối đa là 5MB
    },
});
