/**
 * Upload Controller
 * Handle file uploads
 */

const { successResponse, errorResponse } = require('../utils/response');
const path = require('path');
const fs = require('fs').promises;
const convert = require('heic-convert');

// Convert HEIC to JPEG
const convertHeicToJpeg = async (filePath) => {
  try {
    const inputBuffer = await fs.readFile(filePath);
    const outputBuffer = await convert({
      buffer: inputBuffer,
      format: 'JPEG',
      quality: 0.9
    });

    // Replace .heic/.heif extension with .jpg
    const jpegPath = filePath.replace(/\.(heic|heif)$/i, '.jpg');
    await fs.writeFile(jpegPath, outputBuffer);

    // Delete the original HEIC file
    await fs.unlink(filePath);

    return jpegPath;
  } catch (error) {
    console.error('HEIC conversion error:', error);
    throw error;
  }
};

// Upload single file
const uploadSingleFile = async (req, res) => {
  try {
    if (!req.file) {
      return errorResponse(res, 'No file uploaded', 400);
    }

    let filePath = req.file.path;
    let fileName = req.file.filename;

    // Check if file is HEIC/HEIF and convert to JPEG
    const ext = path.extname(req.file.originalname).toLowerCase();
    if (ext === '.heic' || ext === '.heif') {
      try {
        filePath = await convertHeicToJpeg(filePath);
        fileName = fileName.replace(/\.(heic|heif)$/i, '.jpg');
      } catch (conversionError) {
        console.error('Failed to convert HEIC:', conversionError);
        return errorResponse(res, 'Failed to convert HEIC image', 500);
      }
    }

    const fileUrl = `/uploads/${path.basename(path.dirname(filePath))}/${fileName}`;

    return successResponse(res, {
      file_name: fileName,
      original_name: req.file.originalname,
      file_url: fileUrl,
      file_path: filePath,
      mime_type: ext === '.heic' || ext === '.heif' ? 'image/jpeg' : req.file.mimetype,
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

    const processedFiles = [];

    for (const file of req.files) {
      let filePath = file.path;
      let fileName = file.filename;

      // Check if file is HEIC/HEIF and convert to JPEG
      const ext = path.extname(file.originalname).toLowerCase();
      if (ext === '.heic' || ext === '.heif') {
        try {
          filePath = await convertHeicToJpeg(filePath);
          fileName = fileName.replace(/\.(heic|heif)$/i, '.jpg');
        } catch (conversionError) {
          console.error('Failed to convert HEIC:', conversionError);
          // Skip this file and continue with others
          continue;
        }
      }

      processedFiles.push({
        file_name: fileName,
        original_name: file.originalname,
        file_url: `/uploads/${path.basename(path.dirname(filePath))}/${fileName}`,
        file_path: filePath,
        mime_type: ext === '.heic' || ext === '.heif' ? 'image/jpeg' : file.mimetype,
        file_size: file.size
      });
    }

    return successResponse(res, processedFiles, 'Files uploaded successfully', 201);

  } catch (error) {
    console.error('Upload files error:', error);
    return errorResponse(res, 'Failed to upload files', 500);
  }
};

module.exports = {
  uploadSingleFile,
  uploadMultipleFiles
};
