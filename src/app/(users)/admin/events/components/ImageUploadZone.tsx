'use client';

import React, { useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Box,
  Typography,
  Button,
  LinearProgress,
  Alert,
  IconButton,
  Chip,
} from '@mui/material';
import {
  CloudUpload as UploadIcon,
  Image as ImageIcon,
  Close as CloseIcon,
  CheckCircle as CheckIcon,
  Error as ErrorIcon,
  PhotoCamera as CameraIcon,
} from '@mui/icons-material';
import Image from 'next/image';

interface ImageUploadZoneProps {
  onImageSelect: (file: File) => void;
  currentImage?: string | null;
  loading?: boolean;
  error?: string | null;
  maxSize?: number; // in MB
  acceptedFormats?: string[];
  className?: string;
}

const ImageUploadZone: React.FC<ImageUploadZoneProps> = ({
  onImageSelect,
  currentImage,
  loading = false,
  error = null,
  maxSize = 10,
  acceptedFormats = ['image/jpeg', 'image/png', 'image/webp'],
  className = '',
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [preview, setPreview] = useState<string | null>(currentImage ?? null);

  // Validate and process file
  const handleFile = useCallback((file: File) => {
    // Validate file type
    if (!acceptedFormats.includes(file.type)) {
      return;
    }

    // Validate file size
    if (file.size > maxSize * 1024 * 1024) {
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Simulate upload progress
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 100);

    onImageSelect(file);
  }, [acceptedFormats, maxSize, onImageSelect]);

  // Handle drag events
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  // Handle drop
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, [handleFile]);

  // Handle file input change
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  }, [handleFile]);

  // Clear image
  const handleClear = () => {
    setPreview(null);
    setUploadProgress(0);
  };

  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Upload Zone */}
      <motion.div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`
          relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300
          ${dragActive 
            ? 'border-purple-500 bg-purple-50' 
            : 'border-gray-300 hover:border-gray-400'
          }
          ${loading ? 'pointer-events-none opacity-50' : 'cursor-pointer hover:bg-gray-50'}
        `}
        whileHover={{ scale: dragActive ? 1 : 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <input
          type="file"
          accept={acceptedFormats.join(',')}
          onChange={handleChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={loading}
        />

        <div className="space-y-4">
          {/* Icon */}
          <div className="flex justify-center">
            <div className={`
              w-16 h-16 rounded-full flex items-center justify-center
              ${dragActive 
                ? 'bg-purple-100 text-purple-600' 
                : 'bg-gray-100 text-gray-400'
              }
            `}>
              {loading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                >
                  <UploadIcon className="w-8 h-8" />
                </motion.div>
              ) : (
                <UploadIcon className="w-8 h-8" />
              )}
            </div>
          </div>

          {/* Text */}
          <div>
            <Typography variant="h6" className="font-semibold text-gray-800 mb-2">
              {dragActive ? 'Drop image here' : 'Upload Event Image'}
            </Typography>
            <Typography variant="body2" className="text-gray-600 mb-3">
              Drag and drop an image, or click to browse
            </Typography>
            
            {/* Format Info */}
            <div className="flex flex-wrap justify-center gap-2">
              {acceptedFormats.map(format => (
                <Chip
                  key={format}
                  label={format.split('/')[1].toUpperCase()}
                  size="small"
                  variant="outlined"
                  className="text-xs"
                />
              ))}
            </div>
            
            <Typography variant="caption" className="text-gray-500 mt-2 block">
              Max size: {maxSize}MB
            </Typography>
          </div>

          {/* Upload Progress */}
          <AnimatePresence>
            {loading && uploadProgress > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-2"
              >
                <LinearProgress
                  variant="determinate"
                  value={uploadProgress}
                  className="rounded-full h-2"
                />
                <Typography variant="caption" className="text-gray-600">
                  Uploading... {uploadProgress}%
                </Typography>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Preview */}
      <AnimatePresence>
        {preview && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="relative"
          >
            <div className="relative rounded-xl overflow-hidden bg-gray-100">
              <Image
                src={preview}
                alt="Preview"
                className="w-full h-64 object-cover"
                layout="fill"
                objectFit="cover"
              />
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              
              {/* Remove Button */}
              <IconButton
                onClick={handleClear}
                className="absolute top-2 right-2 bg-white/90 hover:bg-white shadow-sm"
                size="small"
              >
                <CloseIcon />
              </IconButton>

              {/* Status Badge */}
              <div className="absolute bottom-3 left-3">
                {uploadProgress === 100 ? (
                  <Chip
                    icon={<CheckIcon />}
                    label="Ready"
                    size="small"
                    className="bg-green-100 text-green-800"
                  />
                ) : loading ? (
                  <Chip
                    label={`${uploadProgress}%`}
                    size="small"
                    className="bg-blue-100 text-blue-800"
                  />
                ) : (
                  <Chip
                    icon={<ImageIcon />}
                    label="Selected"
                    size="small"
                    className="bg-purple-100 text-purple-800"
                  />
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error Display */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <Alert
              severity="error"
              className="rounded-lg"
              icon={<ErrorIcon />}
            >
              {error}
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quick Actions */}
      <div className="flex justify-center space-x-2">
        <Button
          variant="outlined"
          size="small"
          startIcon={<CameraIcon />}
          onClick={() => (document.querySelector('input[type="file"]') as HTMLInputElement | null)?.click()}
          disabled={loading}
        >
          Browse Files
        </Button>
        
        {preview && (
          <Button
            variant="outlined"
            size="small"
            startIcon={<CloseIcon />}
            onClick={handleClear}
            disabled={loading}
            color="error"
          >
            Remove
          </Button>
        )}
      </div>
    </div>
  );
};

export default ImageUploadZone;
