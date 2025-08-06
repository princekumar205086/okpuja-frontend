'use client';

import React from 'react';
import { Drawer } from '@mui/material';
import { X, Calendar, Clock, Mail, Phone, Video, User, Star, IndianRupee } from 'lucide-react';
import StatusBadge from './StatusBadge';

interface AstrologyDetailDrawerProps {
  booking: any;
  open: boolean;
  onClose: () => void;
  onCancel: (booking: any) => void;
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const formatTime = (timeString: string) => {
  const time = timeString.includes(':') ? timeString.split(':').slice(0, 2).join(':') : timeString;
  return new Date(`2000-01-01T${time}`).toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
};

const canCancelBooking = (preferredDate: string, preferredTime: string): boolean => {
  const bookingDateTime = new Date(`${preferredDate}T${preferredTime}`);
  const now = new Date();
  const timeDiff = bookingDateTime.getTime() - now.getTime();
  const hoursDiff = timeDiff / (1000 * 3600);
  return hoursDiff >= 24;
};

const AstrologyDetailDrawer: React.FC<AstrologyDetailDrawerProps> = ({ booking, open, onClose, onCancel }) => {
  if (!booking) return null;

  const canCancel = canCancelBooking(booking.preferred_date, booking.preferred_time);

  const handleJoinMeeting = () => {
    if (booking.google_meet_link) {
      window.open(booking.google_meet_link, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <Drawer
      anchor="bottom"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          maxHeight: '90vh',
          overflow: 'visible'
        }
      }}
    >
      <div className="w-full max-w-4xl mx-auto">
        {/* Header with dismiss button */}
        <div className="sticky top-0 bg-white z-10 p-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-1 h-6 bg-purple-500 rounded-full"></div>
              <h2 className="text-xl font-bold text-gray-900">Astrology Consultation Details</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        <div className="p-4 space-y-6 max-h-[calc(90vh-80px)] overflow-y-auto">
          {/* Booking Info */}
          <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-4 border border-purple-100">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {booking.service?.title}
                </h3>
                <p className="text-sm text-gray-600">Booking ID: {booking.astro_book_id}</p>
              </div>
              <div className="flex flex-col items-start sm:items-end gap-2">
                <StatusBadge status={booking.status} />
                <div className="flex items-center gap-1 text-xl font-bold text-gray-900">
                  <IndianRupee className="w-5 h-5" />
                  {booking.service?.price}
                </div>
              </div>
            </div>
          </div>

          {/* Service Image */}
          {booking.service?.image_url && (
            <div className="aspect-video rounded-xl overflow-hidden shadow-lg">
              <img
                src={booking.service.image_url}
                alt={booking.service.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Date & Time */}
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              Consultation Schedule
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <Calendar className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-600">Date</p>
                  <p className="font-medium text-gray-900">{formatDate(booking.preferred_date)}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-600">Time</p>
                  <p className="font-medium text-gray-900">{formatTime(booking.preferred_time)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Service Details */}
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Star className="w-5 h-5 text-purple-600" />
              Service Information
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Service Type</p>
                <p className="font-medium text-gray-900">{booking.service?.service_type}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Duration</p>
                <p className="font-medium text-gray-900">{booking.service?.duration_minutes} minutes</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Language</p>
                <p className="font-medium text-gray-900">{booking.language}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Gender</p>
                <p className="font-medium text-gray-900">{booking.gender}</p>
              </div>
            </div>
          </div>

          {/* Birth Information */}
          <div className="bg-purple-50 rounded-xl border border-purple-200 p-4">
            <h4 className="font-semibold text-purple-900 mb-3 flex items-center gap-2">
              <User className="w-5 h-5" />
              Birth Information
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-purple-600">Birth Place</p>
                <p className="font-medium text-purple-900">{booking.birth_place}</p>
              </div>
              <div>
                <p className="text-purple-600">Birth Date</p>
                <p className="font-medium text-purple-900">{formatDate(booking.birth_date)}</p>
              </div>
              <div className="sm:col-span-2">
                <p className="text-purple-600">Birth Time</p>
                <p className="font-medium text-purple-900">{formatTime(booking.birth_time)}</p>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <h4 className="font-semibold text-gray-900 mb-3">Contact Information</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium text-gray-900">{booking.contact_email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-600">Phone</p>
                  <p className="font-medium text-gray-900">{booking.contact_phone}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Questions */}
          {booking.questions && (
            <div className="bg-blue-50 rounded-xl border border-blue-200 p-4">
              <h4 className="font-semibold text-blue-900 mb-3">Questions/Concerns</h4>
              <p className="text-blue-800">{booking.questions}</p>
            </div>
          )}

          {/* Google Meet Link */}
          {booking.google_meet_link ? (
            <div className="bg-green-50 rounded-xl border border-green-200 p-4">
              <h4 className="font-semibold text-green-900 mb-3 flex items-center gap-2">
                <Video className="w-5 h-5" />
                Google Meet Session
              </h4>
              <p className="text-green-800 mb-3">Your consultation session is ready!</p>
              <button
                onClick={handleJoinMeeting}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors duration-200 font-medium"
              >
                <Video className="w-5 h-5" />
                Join Meeting
              </button>
            </div>
          ) : (
            booking.status?.toLowerCase() === 'confirmed' && (
              <div className="bg-amber-50 rounded-xl border border-amber-200 p-4">
                <h4 className="font-semibold text-amber-900 mb-3 flex items-center gap-2">
                  <Video className="w-5 h-5" />
                  Waiting for Meeting Link
                </h4>
                <p className="text-amber-800">
                  Your consultation is confirmed! You'll receive the Google Meet link shortly before your session.
                </p>
              </div>
            )
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            {booking.status?.toLowerCase() === 'confirmed' && (
              <button
                onClick={() => onCancel(booking)}
                disabled={!canCancel}
                className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium transition-colors duration-200 ${
                  canCancel 
                    ? 'bg-red-600 text-white hover:bg-red-700' 
                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                }`}
                title={!canCancel ? 'Can only cancel 24 hours before consultation time' : 'Cancel consultation'}
              >
                <X className="w-5 h-5" />
                {canCancel ? 'Cancel Consultation' : 'Cannot Cancel'}
              </button>
            )}
          </div>

          {!canCancel && booking.status?.toLowerCase() === 'confirmed' && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
              <p className="text-sm text-amber-800">
                <strong>Note:</strong> Consultations can only be cancelled 24 hours before the scheduled time. 
                Please contact admin for assistance.
              </p>
            </div>
          )}
        </div>
      </div>
    </Drawer>
  );
};

export default AstrologyDetailDrawer;
