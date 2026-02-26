/**
 * Multer Configuration
 * File upload setup
 */

const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure upload directories exist
const uploadDirs = ['./uploads', './uploads/images', './uploads/documents', './uploads/media'];

uploadDirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath = './uploads/';

    const ext = path.extname(file.originalname).toLowerCase();
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.heic', '.heif'];
    const videoExtensions = ['.mp4', '.mpeg', '.mov'];

    if (file.mimetype.startsWith('image/') || imageExtensions.includes(ext)) {
      uploadPath += 'images';
    } else if (file.mimetype.startsWith('video/') || videoExtensions.includes(ext)) {
      uploadPath += 'media';
    } else {
      uploadPath += 'documents';
    }

    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const basename = path.basename(file.originalname, ext);
    cb(null, basename + '-' + uniqueSuffix + ext);
  }
});

// File filter with MIME type and extension validation
const fileFilter = (req, file, cb) => {
  const allowedImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/heic', 'image/heif'];
  const allowedDocTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
  const allowedVideoTypes = ['video/mp4', 'video/mpeg', 'video/quicktime'];

  const allowedTypes = [...allowedImageTypes, ...allowedDocTypes, ...allowedVideoTypes];

  // Security: Validate file extension to prevent MIME type spoofing
  const ext = path.extname(file.originalname).toLowerCase();
  const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.heic', '.heif', '.pdf', '.doc', '.docx', '.mp4', '.mpeg', '.mov'];

  // Allow if extension is valid (HEIC files often have wrong MIME type)
  if (allowedExtensions.includes(ext)) {
    // Double-check: if MIME type is provided, it should match the file category
    if (file.mimetype && !file.mimetype.startsWith('application/octet-stream') && !allowedTypes.includes(file.mimetype)) {
      // MIME type exists but doesn't match - potential spoofing
      const imageExts = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.heic', '.heif'];
      const isImageExt = imageExts.includes(ext);
      const isImageMime = file.mimetype.startsWith('image/');

      if (isImageExt && !isImageMime) {
        // Image extension but non-image MIME - could be HEIC with octet-stream
        return cb(null, true);
      }
      return cb(new Error('File type mismatch detected'), false);
    }
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only images (jpg, png, gif, webp, heic, heif), PDFs, documents (doc, docx), and videos (mp4, mpeg, mov) are allowed.'), false);
  }
};

// Multer upload instance
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024 // 10MB default
  }
});

module.exports = upload;
