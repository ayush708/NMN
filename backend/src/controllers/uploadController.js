/**
 * Upload Controller
 * Handle file uploads
 */

const { successResponse, errorResponse } = require('../utils/response');
const path = require('path');

// Upload single file
const uploadSingleFile = async (req, res) => {
  try {
    if (!req.file) {
      return errorResponse(res, 'No file uploaded', 400);
    }

    const fileUrl = `/uploads/${path.basename(path.dirname(req.file.path))}/${req.file.filename}`;

    return successResponse(res, {
      file_name: req.file.filename,
      original_name: req.file.originalname,
      file_url: fileUrl,
      file_path: req.file.path,
      mime_type: req.file.mimetype,
      file_size: req.file.size
    }, 'File uploaded successfully', 201);

  } catch (error) {
    console.error('Upload file error:', error);
    return errorResponse(res, 'Failed to upload file', 500);
  }
};

// Upload multiple files
const uploadMultipleFiles = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return errorResponse(res, 'No files uploaded', 400);
    }

    const files = req.files.map(file => ({
      file_name: file.filename,
      original_name: file.originalname,
      file_url: `/uploads/${path.basename(path.dirname(file.path))}/${file.filename}`,
      file_path: file.path,
      mime_type: file.mimetype,
      file_size: file.size
    }));

    return successResponse(res, files, 'Files uploaded successfully', 201);

  } catch (error) {
    console.error('Upload files error:', error);
    return errorResponse(res, 'Failed to upload files', 500);
  }
};

module.exports = {
  uploadSingleFile,
  uploadMultipleFiles
};
