import React from 'react';
import { AdminAstrologyBooking } from '../adminAstrologyApiService';
import { formatBookingDate, formatBookingTime, getStatusColor } from '../adminAstrologyApiService';
import Image from 'next/image';

interface MeetingLinkModalProps {
  booking: AdminAstrologyBooking;
  onClose: () => void;
  onSubmit: (bookingId: string, meetingLink: string, meetingTime?: string) => void;
}

const MeetingLinkModal: React.FC<MeetingLinkModalProps> = ({ booking, onClose, onSubmit }) => {
  const [meetingLink, setMeetingLink] = React.useState(booking.meeting_link || '');
  const [meetingDate, setMeetingDate] = React.useState('');
  const [meetingTime, setMeetingTime] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  React.useEffect(() => {
    // Extract date from preferred_date for default meeting date
    if (booking.preferred_date) {
      const date = new Date(booking.preferred_date);
      setMeetingDate(date.toISOString().split('T')[0]);
    }
    
    // Extract time from preferred_time for default meeting time
    if (booking.preferred_time) {
      setMeetingTime(booking.preferred_time.substring(0, 5)); // Extract HH:MM
    }
    
    // If meeting_time exists, use that instead
    if (booking.meeting_time) {
      const meetingDateTime = new Date(booking.meeting_time);
      setMeetingDate(meetingDateTime.toISOString().split('T')[0]);
      
      const hours = String(meetingDateTime.getHours()).padStart(2, '0');
      const minutes = String(meetingDateTime.getMinutes()).padStart(2, '0');
      setMeetingTime(`${hours}:${minutes}`);
    }
  }, [booking]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Combine date and time into ISO string if both exist
      let meetingDateTime = undefined;
      if (meetingDate && meetingTime) {
        meetingDateTime = `${meetingDate}T${meetingTime}:00`;
      }
      
      await onSubmit(booking.astro_book_id || '', meetingLink, meetingDateTime);
      onClose();
    } catch (error) {
      console.error('Failed to send meeting link:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center border-b border-gray-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-800">Send Google Meet Link</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-4">
            <div className="flex items-center gap-4 mb-4">
              <div>
                {booking.service_details.image_url ? (
                  <div className="relative w-12 h-12 rounded-md overflow-hidden">
                    <Image
                      src={booking.service_details.image_url}
                      alt={booking.service_details.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-12 h-12 bg-orange-100 rounded-md flex items-center justify-center">
                    <span className="text-xl text-orange-600">🔮</span>
                  </div>
                )}
              </div>
              <div>
                <h3 className="text-md font-semibold text-gray-800">{booking.service_details.title}</h3>
                <p className="text-sm text-gray-600">
                  Client: {booking.user_details.username} ({booking.contact_email})
                </p>
              </div>
            </div>
            
            <div className="mb-4">
              <label htmlFor="meetingLink" className="block text-sm font-medium text-gray-700 mb-1">
                Google Meet Link*
              </label>
              <input
                type="url"
                id="meetingLink"
                value={meetingLink}
                onChange={(e) => setMeetingLink(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="https://meet.google.com/xxx-xxxx-xxx"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Create a Google Meet link and paste it here. The client will receive this link via email.
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label htmlFor="meetingDate" className="block text-sm font-medium text-gray-700 mb-1">
                  Meeting Date*
                </label>
                <input
                  type="date"
                  id="meetingDate"
                  value={meetingDate}
                  onChange={(e) => setMeetingDate(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="meetingTime" className="block text-sm font-medium text-gray-700 mb-1">
                  Meeting Time*
                </label>
                <input
                  type="time"
                  id="meetingTime"
                  value={meetingTime}
                  onChange={(e) => setMeetingTime(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            </div>
            
            <div className="text-xs text-gray-500 mb-6 p-3 bg-blue-50 rounded-md">
              <p className="font-medium text-blue-700 mb-1">Note:</p>
              <p>
                The client will receive an email with the Google Meet link and meeting details.
                Make sure the date and time align with what you've discussed with the client.
              </p>
            </div>
          </div>
          
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="py-2 px-4 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="py-2 px-4 bg-blue-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Sending...' : 'Send Meeting Link'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MeetingLinkModal;
