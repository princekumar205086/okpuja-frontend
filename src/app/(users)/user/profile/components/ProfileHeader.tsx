'use client';

import React, { useState, useRef } from 'react';
import { Camera, User, Mail, Calendar, Badge } from 'lucide-react';
import { useAuthStore } from '../../../../stores/authStore';
import { useProfileStore } from '../../../../stores/profileStore';

interface ProfileHeaderProps {
  className?: string;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({ className = '' }) => {
  const { user } = useAuthStore();
  const { profile, updateProfilePicture, profileLoading } = useProfileStore();
  const [imageLoading, setImageLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file');
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }

    setImageLoading(true);
    try {
      await updateProfilePicture(file);
    } finally {
      setImageLoading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return 'Not provided';
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getInitials = () => {
    const firstName = profile?.first_name || user?.first_name || '';
    const lastName = profile?.last_name || user?.last_name || '';
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-200 p-6 ${className}`}>
      <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">
        {/* Profile Picture Section */}
        <div className="relative group">
          <div 
            className="relative w-24 h-24 lg:w-32 lg:h-32 rounded-full overflow-hidden bg-gradient-to-br from-blue-500 to-purple-600 cursor-pointer transition-transform duration-200 hover:scale-105"
            onClick={handleImageClick}
          >
            {profile?.profile_picture ? (
              <img
                src={profile.profile_picture}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white text-xl lg:text-2xl font-semibold">
                {getInitials() || <User className="w-8 h-8 lg:w-10 lg:h-10" />}
              </div>
            )}
            
            {/* Loading overlay */}
            {(imageLoading || profileLoading) && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
              </div>
            )}
            
            {/* Camera overlay */}
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
              <Camera className="w-6 h-6 text-white" />
            </div>
          </div>
          
          {/* Upload hint */}
          <p className="text-xs text-gray-500 text-center mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            Click to update
          </p>
          
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
        </div>

        {/* Profile Information */}
        <div className="flex-1 space-y-4">
          {/* Name and Role */}
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
              {profile?.first_name && profile?.last_name 
                ? `${profile.first_name} ${profile.last_name}`
                : user?.full_name || `${user?.first_name || ''} ${user?.last_name || ''}`.trim() || 'User'
              }
            </h1>
            <div className="flex items-center gap-2 mt-2">
              <Badge className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-600 capitalize">
                {user?.role?.toLowerCase() || 'User'}
              </span>
              {user?.account_status === 'ACTIVE' && (
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                  Active
                </span>
              )}
              {user?.email_verified && (
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                  Verified
                </span>
              )}
            </div>
          </div>

          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-100 rounded-lg">
                <Mail className="w-4 h-4 text-gray-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="text-sm font-medium text-gray-900">{user?.email}</p>
              </div>
            </div>

            {profile?.dob && (
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <Calendar className="w-4 h-4 text-gray-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Date of Birth</p>
                  <p className="text-sm font-medium text-gray-900">{formatDate(profile.dob)}</p>
                </div>
              </div>
            )}
          </div>

          {/* Account Created */}
          {profile?.created_at && (
            <div className="pt-2 border-t border-gray-100">
              <p className="text-xs text-gray-500">
                Member since {formatDate(profile.created_at)}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
