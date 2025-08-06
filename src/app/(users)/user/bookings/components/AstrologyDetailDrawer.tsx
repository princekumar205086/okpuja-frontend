'use client';

import React, { useState } from 'react';
import { Drawer, IconButton, Button as MuiButton } from '@mui/material';
import { X, Calendar, Clock, Mail, Phone, Video, User, Star, IndianRupee, Download } from 'lucide-react';
import StatusBadge, { OrderTracking } from './StatusBadge';
import CopyableText from './CopyableText';
import CancelBookingModal from './CancelBookingModal';

interface AstrologyDetailDrawerProps {
  booking: any;
  open: boolean;
  onClose: () => void;
  onCancel: (booking: any, reason: string, requestRefund: boolean) => Promise<void>;
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
  const [cancelModalOpen, setCancelModalOpen] = useState(false);

  if (!booking) return null;

  const canCancel = canCancelBooking(booking.preferred_date, booking.preferred_time) && 
                   !['cancelled', 'completed', 'rejected', 'failed', 'refund_requested', 'refund_completed']
                     .includes(booking.status?.toLowerCase());

  const handleJoinMeeting = () => {
    if (booking.google_meet_link) {
      window.open(booking.google_meet_link, '_blank', 'noopener,noreferrer');
    }
  };

  const handleInvoiceDownload = () => {
    if (booking.astro_book_id) {
      window.open(`/astrology/invoice/${booking.astro_book_id}/`, '_blank');
    }
  };

  return (
    <>
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
        <div className="w-full max-w-5xl mx-auto">
          {/* Header with dismiss button */}
          <div className="sticky top-0 bg-white z-10 p-4 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-1 h-6 bg-purple-500 rounded-full"></div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Astrology Consultation Details</h2>
                  <p className="text-sm text-gray-600">
                    Booking ID: <CopyableText text={booking.astro_book_id} className="inline" />
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <StatusBadge status={booking.status} size="md" showDescription />
                <IconButton onClick={onClose} size="small">
                  <X className="w-5 h-5" />
                </IconButton>
              </div>
            </div>
          </div>

          <div className="p-4 space-y-6 max-h-[calc(90vh-120px)] overflow-y-auto">
            {/* Order Tracking */}
            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-4 border border-purple-100">
              <h3 className="font-semibold text-gray-900 mb-4">Order Status</h3>
              <OrderTracking status={booking.status} type="astrology" />
            </div>

            {/* Service Information */}
            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-4 border border-purple-100">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {booking.service?.title}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Type: {booking.service?.service_type}
                  </p>
                </div>
                <div className="flex flex-col items-start sm:items-end gap-2">
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
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Calendar className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Date</p>
                    <p className="font-medium text-gray-900">{formatDate(booking.preferred_date)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Clock className="w-4 h-4 text-purple-600" />
                  </div>
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
              <div className="bg-purple-50 rounded-lg p-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-purple-600">Service Type</p>
                    <p className="font-medium text-purple-900">{booking.service?.service_type}</p>
                  </div>
                  <div>
                    <p className="text-sm text-purple-600">Duration</p>
                    <p className="font-medium text-purple-900">{booking.service?.duration_minutes} minutes</p>
                  </div>
                  <div>
                    <p className="text-sm text-purple-600">Language</p>
                    <p className="font-medium text-purple-900">{booking.language}</p>
                  </div>
                  <div>
                    <p className="text-sm text-purple-600">Gender Preference</p>
                    <p className="font-medium text-purple-900">{booking.gender}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Birth Information */}
            <div className="bg-purple-50 rounded-xl border border-purple-200 p-4">
              <h4 className="font-semibold text-purple-900 mb-3 flex items-center gap-2">
                <User className="w-5 h-5 text-purple-600" />
                Birth Information
              </h4>
              <div className="bg-white rounded-lg p-4">
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
            </div>

            {/* Contact Information */}
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Phone className="w-5 h-5 text-green-600" />
                Contact Information
              </h4>
              <div className="bg-green-50 rounded-lg p-3">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="p-1 bg-green-100 rounded">
                      <Mail className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-green-600">Email</p>
                      <p className="font-medium text-green-900">{booking.contact_email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-1 bg-green-100 rounded">
                      <Phone className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-green-600">Phone</p>
                      <p className="font-medium text-green-900">{booking.contact_phone}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Questions */}
            {booking.questions && (
              <div className="bg-blue-50 rounded-xl border border-blue-200 p-4">
                <h4 className="font-semibold text-blue-900 mb-3">Questions/Concerns</h4>
                <div className="bg-white rounded-lg p-3">
                  <p className="text-blue-800">{booking.questions}</p>
                </div>
              </div>
            )}

            {/* Google Meet Link */}
            {booking.google_meet_link ? (
              <div className="bg-green-50 rounded-xl border border-green-200 p-4">
                <h4 className="font-semibold text-green-900 mb-3 flex items-center gap-2">
                  <Video className="w-5 h-5 text-green-600" />
                  Google Meet Session
                </h4>
                <div className="bg-white rounded-lg p-3">
                  <p className="text-green-800 mb-3">Your consultation session is ready!</p>
                  <MuiButton
                    variant="contained"
                    color="success"
                    startIcon={<Video />}
                    onClick={handleJoinMeeting}
                    fullWidth
                    sx={{ borderRadius: 2 }}
                  >
                    Join Meeting
                  </MuiButton>
                </div>
              </div>
            ) : (
              booking.status?.toLowerCase() === 'confirmed' && (
                <div className="bg-amber-50 rounded-xl border border-amber-200 p-4">
                  <h4 className="font-semibold text-amber-900 mb-3 flex items-center gap-2">
                    <Video className="w-5 h-5 text-amber-600" />
                    Waiting for Meeting Link
                  </h4>
                  <div className="bg-white rounded-lg p-3">
                    <p className="text-amber-800">
                      Your consultation is confirmed! You'll receive the Google Meet link shortly before your session.
                    </p>
                  </div>
                </div>
              )
            )}
          </div>

          {/* Action Buttons */}
          <div className="p-4 border-t bg-white">
            <div className="flex flex-col sm:flex-row gap-3">
              <MuiButton
                variant="outlined"
                startIcon={<Download />}
                onClick={handleInvoiceDownload}
                className="flex-1"
                sx={{ borderRadius: 2 }}
              >
                Download Invoice
              </MuiButton>

              {canCancel && (
                <MuiButton
                  variant="outlined"
                  color="error"
                  onClick={() => setCancelModalOpen(true)}
                  className="flex-1"
                  sx={{ borderRadius: 2 }}
                >
                  Cancel Consultation
                </MuiButton>
              )}

              {!canCancel && ['pending', 'confirmed'].includes(booking.status?.toLowerCase()) && (
                <MuiButton
                  variant="outlined"
                  color="warning"
                  startIcon={<Phone />}
                  onClick={() => window.open('tel:+91XXXXXXXXXX')}
                  className="flex-1"
                  sx={{ borderRadius: 2 }}
                >
                  Contact Admin
                </MuiButton>
              )}
            </div>

            {!canCancel && ['confirmed'].includes(booking.status?.toLowerCase()) && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mt-3">
                <p className="text-sm text-amber-800">
                  <strong>Note:</strong> Consultations can only be cancelled 24 hours before the scheduled time. 
                  Please contact admin for assistance.
                </p>
              </div>
            )}
          </div>
        </div>
      </Drawer>

      {/* Cancel Booking Modal */}
      <CancelBookingModal
        open={cancelModalOpen}
        onClose={() => setCancelModalOpen(false)}
        booking={booking}
        type="astrology"
        onCancel={onCancel}
      />
    </>
  );
};

export default AstrologyDetailDrawer;
