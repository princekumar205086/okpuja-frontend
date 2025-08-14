'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { CreditCard, Upload, Save, X, Edit3, CheckCircle, AlertCircle } from 'lucide-react';
import { useProfileStore } from '../../../../stores/profileStore';
import { PanCard } from '../../../../apiService/profileService';

interface PanCardManagerProps {
  className?: string;
}
type PanCardFormData = Omit<PanCard, 'id' | 'created_at' | 'updated_at' | 'user' | 'is_verified'>;

export const PanCardManager: React.FC<PanCardManagerProps> = ({ className = '' }) => {
  const { panCard, fetchPanCard, updatePanCard, panCardLoading } = useProfileStore();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<PanCardFormData>({
    pan_number: '',
    pan_card_image_url: null,
    pan_card_thumbnail_url: null,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchPanCard();
  }, [fetchPanCard]);

  useEffect(() => {
    if (panCard) {
      setFormData({
        pan_number: panCard.pan_number || '',
        pan_card_image_url: panCard.pan_card_image_url || null,
        pan_card_thumbnail_url: panCard.pan_card_thumbnail_url || null,
      });
    }
  }, [panCard]);

  const validatePanNumber = (pan: string): boolean => {
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    return panRegex.test(pan.toUpperCase());
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.pan_number?.trim()) {
      newErrors.pan_number = 'PAN number is required';
    } else if (!validatePanNumber(formData.pan_number)) {
      newErrors.pan_number = 'Invalid PAN number format (e.g., ABCDE1234F)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof PanCardFormData, value: string) => {
    let processedValue = value;
    
    // Auto-format PAN number to uppercase
    if (field === 'pan_number') {
      processedValue = value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 10);
    }
    
    setFormData(prev => ({
      ...prev,
      [field]: processedValue
    }));
    
    // Clear error for this field
    if (errors[field as string]) {
      setErrors((prev: Record<string, string>) => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setErrors(prev => ({ ...prev, image: 'Please select a valid image file' }));
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, image: 'File size must be less than 5MB' }));
      return;
    }

    setImageFile(file);
    setErrors(prev => ({ ...prev, image: '' }));

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    // For now, we'll save without image upload since the API endpoint structure isn't clear
    // In a real implementation, you'd handle file upload to get the image URLs
    const success = await updatePanCard({
      pan_number: formData.pan_number,
      // Note: Image upload would need to be handled separately based on your API structure
    });

    if (success) {
      setIsEditing(false);
      setImageFile(null);
      setImagePreview(null);
      setErrors({});
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setImageFile(null);
    setImagePreview(null);
    setErrors({});
    // Reset form data
    if (panCard) {
      setFormData({
        pan_number: panCard.pan_number || '',
        pan_card_image_url: panCard.pan_card_image_url || null,
        pan_card_thumbnail_url: panCard.pan_card_thumbnail_url || null,
      });
    }
  };

  const startEdit = () => {
    setIsEditing(true);
    setErrors({});
  };

  const formatPanDisplay = (pan: string) => {
    if (!pan) return '';
    return pan.replace(/(.{5})(.{4})(.{1})/, '$1 $2 $3');
  };

  const getVerificationStatus = () => {
    if (!panCard) return null;
    
    return {
      verified: panCard.is_verified,
      icon: panCard.is_verified ? CheckCircle : AlertCircle,
      text: panCard.is_verified ? 'Verified' : 'Pending Verification',
      className: panCard.is_verified 
        ? 'bg-green-100 text-green-800' 
        : 'bg-yellow-100 text-yellow-800'
    };
  };

  const verificationStatus = getVerificationStatus();
  const VerificationIcon = verificationStatus?.icon;

  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-200 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-100 rounded-lg">
            <CreditCard className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">PAN Card Details</h2>
            <p className="text-sm text-gray-500">Manage your PAN card information</p>
          </div>
        </div>
        
        {!isEditing && panCard && (
          <button
            onClick={startEdit}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-purple-600 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors duration-200"
          >
            <Edit3 className="w-4 h-4" />
            Edit
          </button>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        {isEditing ? (
          /* Edit Mode */
          <div className="space-y-6">
            {/* PAN Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                PAN Number *
              </label>
              <input
                type="text"
                value={formData.pan_number}
                onChange={(e) => handleInputChange('pan_number', e.target.value)}
                className={`w-full md:w-1/2 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors duration-200 font-mono tracking-wider ${
                  errors.pan_number ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="ABCDE1234F"
                maxLength={10}
              />
              {errors.pan_number && (
                <p className="mt-1 text-sm text-red-600">{errors.pan_number}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                Format: 5 letters, 4 digits, 1 letter (e.g., ABCDE1234F)
              </p>
            </div>

            {/* PAN Card Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                PAN Card Image (Optional)
              </label>
              
              {/* Current Image or Upload Area */}
              <div className="space-y-4">
                {(imagePreview || formData.pan_card_image_url) && (
                  <div className="relative inline-block">
                    <Image
                      src={imagePreview || formData.pan_card_image_url || ''}
                      alt="PAN Card"
                      width={256}
                      height={160}
                      unoptimized
                      className="w-64 h-40 object-cover rounded-lg border border-gray-300"
                    />
                    <button
                      onClick={removeImage}
                      className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors duration-200"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {/* Upload Button */}
                <div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                  >
                    <Upload className="w-4 h-4" />
                    {imagePreview || formData.pan_card_image_url ? 'Change Image' : 'Upload Image'}
                  </button>
                  <p className="mt-1 text-xs text-gray-500">
                    Accepted formats: JPG, PNG, GIF. Max size: 5MB
                  </p>
                  {errors.image && (
                    <p className="mt-1 text-sm text-red-600">{errors.image}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200">
              <button
                onClick={handleSave}
                disabled={panCardLoading}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                {panCardLoading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <Save className="w-4 h-4" />
                )}
                Save Changes
              </button>
              <button
                onClick={handleCancel}
                disabled={panCardLoading}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                <X className="w-4 h-4" />
                Cancel
              </button>
            </div>
          </div>
        ) : (
          /* View Mode */
          <div className="space-y-6">
            {panCard ? (
              <div className="space-y-6">
                {/* PAN Number Display */}
                {/* PAN Number Display */}
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-2">
                    PAN Number
                  </label>
                  <div className="flex items-center gap-3">
                    <p className="text-xl font-mono tracking-wider font-semibold text-gray-900">
                      {formatPanDisplay(panCard.pan_number)}
                    </p>

                    {verificationStatus && VerificationIcon && (
                      <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${verificationStatus.className}`}>
                        <VerificationIcon className="w-3 h-3" />
                        {verificationStatus.text}
                      </span>
                    )}
                  </div>

                  {panCard.pan_card_image_url && (
                    <div className="pt-4">
                      <label className="block text-sm font-medium text-gray-500 mb-2">
                        PAN Card Image
                      </label>
                      <Image
                        src={panCard.pan_card_image_url}
                        alt="PAN Card"
                        width={256}
                        height={160}
                        unoptimized
                        className="w-64 h-40 object-cover rounded-lg border border-gray-300 cursor-pointer hover:opacity-90 transition-opacity duration-200"
                        onClick={() => window.open(panCard.pan_card_image_url!, '_blank')}
                      />
                      <p className="mt-1 text-xs text-gray-500">Click to view full image</p>
                    </div>
                  )}

                  {/* Last Updated */}
                  {panCard.updated_at && (
                    <div className="pt-4 border-t border-gray-100">
                      <p className="text-xs text-gray-500">
                        Last updated: {new Date(panCard.updated_at).toLocaleString('en-IN')}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              /* No PAN Card */
              <div className="text-center py-12">
                <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No PAN Card Added</h3>
                <p className="text-gray-500 mb-4">Add your PAN card details for verification</p>
                <button
                  onClick={startEdit}
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors duration-200"
                >
                  <CreditCard className="w-4 h-4" />
                  Add PAN Card
                </button>
              </div>
            )}
          </div>
        )
      }
      </div>
    </div>
  );
};
