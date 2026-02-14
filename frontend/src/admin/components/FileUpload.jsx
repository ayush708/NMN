/**
 * File Upload Component
 * Reusable file upload with preview
 */

import { useState, useId } from 'react';
import { uploadService } from '../../services';
import { FaUpload, FaSpinner, FaCheckCircle } from 'react-icons/fa';

const FileUpload = ({ onUploadComplete, accept = "image/*", label = "Upload File" }) => {
  const [uploading, setUploading] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);
  const uniqueId = useId();

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploading(true);
      setUploadComplete(false);

      const response = await uploadService.uploadSingle(file);

      // Pass the file URL to parent component
      onUploadComplete(response.data.file_url);

      setUploadComplete(true);
      setTimeout(() => setUploadComplete(false), 2000);
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload file');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="relative">
      <input
        type="file"
        id={uniqueId}
        accept={accept}
        onChange={handleFileChange}
        className="hidden"
        disabled={uploading}
      />
      <label
        htmlFor={uniqueId}
        className={`flex items-center justify-center gap-2 px-4 py-2 border-2 border-dashed rounded-md cursor-pointer transition-colors ${
          uploading
            ? 'bg-gray-100 border-gray-300 cursor-not-allowed'
            : uploadComplete
            ? 'bg-green-50 border-green-500 text-green-700'
            : 'bg-blue-50 border-blue-300 text-blue-700 hover:bg-blue-100'
        }`}
      >
        {uploading ? (
          <>
            <FaSpinner className="animate-spin" />
            <span>Uploading...</span>
          </>
        ) : uploadComplete ? (
          <>
            <FaCheckCircle />
            <span>Uploaded!</span>
          </>
        ) : (
          <>
            <FaUpload />
            <span>{label}</span>
          </>
        )}
      </label>
    </div>
  );
};

export default FileUpload;
