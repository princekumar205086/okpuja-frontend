'use client';

import React, { useState } from 'react';
import { Drawer, IconButton, Button as MuiButton } from '@mui/material';
import { X, Calendar, Clock, MapPin, Phone, Mail, IndianRupee, User, Package, Download } from 'lucide-react';
import StatusBadge, { OrderTracking } from './StatusBadge';
import CopyableText from './CopyableText';
import CancelBookingModal from './CancelBookingModal';
import Image from 'next/image';

interface PujaDetailDrawerProps {
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

const canCancelBooking = (selectedDate: string, selectedTime: string): boolean => {
  const bookingDateTime = new Date(`${selectedDate}T${selectedTime}`);
  const now = new Date();
  const timeDiff = bookingDateTime.getTime() - now.getTime();
  const hoursDiff = timeDiff / (1000 * 3600);
  return hoursDiff >= 24;
};

const PujaDetailDrawer: React.FC<PujaDetailDrawerProps> = ({ booking, open, onClose, onCancel }) => {
  const [cancelModalOpen, setCancelModalOpen] = useState(false);

  if (!booking) return null;

  const canCancel = canCancelBooking(booking.selected_date, booking.selected_time) && 
                   !['cancelled', 'completed', 'rejected', 'failed', 'refund_requested', 'refund_completed']
                     .includes(booking.status?.toLowerCase());

  const handleInvoiceDownload = () => {
    if (booking.book_id) {
      window.open(`/booking/invoice/${booking.book_id}/`, '_blank');
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
                <div className="w-1 h-6 bg-orange-500 rounded-full"></div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Puja Booking Details</h2>
                  <p className="text-sm text-gray-600">
                    Booking ID: <CopyableText text={booking.book_id} className="inline" />
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
            <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl p-4 border border-orange-100">
              <h3 className="font-semibold text-gray-900 mb-4">Order Status</h3>
              <OrderTracking status={booking.status} type="puja" />
            </div>

            {/* Service Information */}
            <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl p-4 border border-orange-100">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {booking.cart?.puja_service?.title || 'Puja Service'}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Category: {booking.cart?.puja_service?.category_detail?.name || 'N/A'}
                  </p>
                </div>
                <div className="flex flex-col items-start sm:items-end gap-2">
                  <div className="flex items-center gap-1 text-xl font-bold text-gray-900">
                    <IndianRupee className="w-5 h-5" />
                    {booking.total_amount}
                  </div>
                </div>
              </div>
            </div>

            {/* Service Image */}
            {booking.cart?.puja_service?.image_url && (
              <div className="aspect-video rounded-xl overflow-hidden shadow-lg">
                <Image
                  src={booking.cart.puja_service.image_url}
                  alt={booking.cart.puja_service.title}
                  className="w-full h-full object-cover"
                  layout="responsive"
                  width={500}
                  height={300}
                />
              </div>
            )}

            {/* Date & Time */}
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-600" />
                Schedule Details
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Calendar className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Date</p>
                    <p className="font-medium text-gray-900">{formatDate(booking.selected_date)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <Clock className="w-4 h-4 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Time</p>
                    <p className="font-medium text-gray-900">{formatTime(booking.selected_time)}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Address */}
            {booking.address && (
              <div className="bg-white rounded-xl border border-gray-200 p-4">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-green-600" />
                  Service Address
                </h4>
                <div className="bg-green-50 rounded-lg p-3">
                  <div className="text-green-800">
                    <p className="font-medium">{booking.address.address_line1}</p>
                    {booking.address.address_line2 && <p>{booking.address.address_line2}</p>}
                    <p>{booking.address.city}, {booking.address.state} - {booking.address.postal_code}</p>
                    <p>{booking.address.country}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Package Details */}
            {booking.cart?.package && (
              <div className="bg-purple-50 rounded-xl border border-purple-200 p-4">
                <h4 className="font-semibold text-purple-900 mb-3 flex items-center gap-2">
                  <Package className="w-5 h-5 text-purple-600" />
                  Package Details
                </h4>
                <div className="bg-white rounded-lg p-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-purple-600">Package Type</p>
                      <p className="font-medium text-purple-900">{booking.cart.package.package_type}</p>
                    </div>
                    <div>
                      <p className="text-purple-600">Language</p>
                      <p className="font-medium text-purple-900">{booking.cart.package.language}</p>
                    </div>
                    <div>
                      <p className="text-purple-600">Number of Priests</p>
                      <p className="font-medium text-purple-900 flex items-center gap-1">
                        <User className="w-4 h-4" />
                        {booking.cart.package.priest_count}
                      </p>
                    </div>
                    <div>
                      <p className="text-purple-600">Materials</p>
                      <p className="font-medium text-purple-900">
                        {booking.cart.package.includes_materials ? '✅ Included' : '❌ Not Included'}
                      </p>
                    </div>
                    {booking.cart.package.description && (
                      <div className="sm:col-span-2">
                        <p className="text-purple-600">Description</p>
                        <div 
                          className="font-medium text-purple-900"
                          dangerouslySetInnerHTML={{ __html: booking.cart.package.description }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Payment Information */}
            {booking.payment_details && (
              <div className="bg-green-50 rounded-xl border border-green-200 p-4">
                <h4 className="font-semibold text-green-900 mb-3 flex items-center gap-2">
                  <IndianRupee className="w-5 h-5 text-green-600" />
                  Payment Information
                </h4>
                <div className="bg-white rounded-lg p-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-green-700">Status</span>
                      <span className="font-medium text-green-900">{booking.payment_details.status}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-green-700">Transaction ID</span>
                      <CopyableText
                        text={booking.payment_details.transaction_id}
                        label="Transaction ID"
                        className="font-semibold text-sm bg-green-100 px-2 py-1 rounded"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-green-700">Payment Date</span>
                      <span className="font-medium text-green-900">
                        {new Date(booking.payment_details.payment_date).toLocaleDateString('en-IN')}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-green-700">Amount</span>
                      <span className="font-medium text-green-900 flex items-center gap-1">
                        <IndianRupee className="w-4 h-4" />
                        {booking.payment_details.amount}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
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
                  Cancel Booking
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
                  <strong>Note:</strong> Bookings can only be cancelled 24 hours before the scheduled time. 
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
        type="puja"
        onCancel={onCancel}
      />
    </>
  );
};

export default PujaDetailDrawer;
