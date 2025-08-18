import multer from 'multer';
import streamifier from 'streamifier';
import cloudinary from './cloudinary.js';

// Configure multer for memory storage
const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// Function to upload buffer to Cloudinary
const uploadToCloudinary = (buffer, userId) => {
return new Promise((resolve, reject) => {
    console.log("🔄 Starting Cloudinary upload for user:", userId);
    
    const stream = cloudinary.uploader.upload_stream(
        {
        folder: 'zuno_avatars',
        public_id: `avatar_${userId}`,
        transformation: [
            { width: 400, height: 400, crop: 'fill' },
            { quality: 'auto' }
        ]
        },
        (error, result) => {
        if (error) {
            console.error("❌ Cloudinary upload error:", error);
            reject(error);
        } else {
            console.log("✅ Cloudinary upload success:", result.secure_url);
            resolve(result);
        }
    }
    );

    // Convert buffer to stream and pipe to Cloudinary
    streamifier.createReadStream(buffer).pipe(stream);
});
};

// Middleware to handle avatar upload
const uploadAvatar = upload.single('avatar');

export { uploadAvatar, uploadToCloudinary };
export default upload;
