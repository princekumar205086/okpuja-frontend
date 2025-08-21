'use client';

import { useState, useEffect } from 'react';
import { XMarkIcon, UserIcon } from '@heroicons/react/24/outline';
import { useAdminBookingStore } from '@/app/stores/adminBookingStore';
import { toast } from 'react-hot-toast';

interface BookingAssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: any;
  type: 'astrology' | 'regular' | 'puja';
}

export default function BookingAssignmentModal({
  isOpen,
  onClose,
  booking,
  type
}: BookingAssignmentModalProps) {
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [assignmentNotes, setAssignmentNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { 
    employees, 
    fetchEmployees, 
    assignBooking,
    unassignBooking 
  } = useAdminBookingStore();

  useEffect(() => {
    if (isOpen) {
      fetchEmployees();
    }
  }, [isOpen, fetchEmployees]);

  if (!isOpen || !booking) return null;

  const currentlyAssigned = booking.assigned_to;
  const currentAssignedName = booking.assigned_to_name;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedEmployee && selectedEmployee !== '0') {
      toast.error('Please select an employee or choose to unassign');
      return;
    }

    // Check if assignment is supported for this booking type
    if (type === 'astrology') {
      toast.error('Assignment is not supported for astrology bookings yet');
      return;
    }

    setIsSubmitting(true);
    
    try {
      let success = false;
      const bookingId = booking.id || booking.astro_book_id || booking.book_id;
      const apiType = type === 'puja' ? 'regular' : type; // Use 'regular' for puja bookings
      
      if (selectedEmployee === '0') {
        // Unassign booking
        success = await unassignBooking(apiType, bookingId);
      } else {
        // Assign to employee
        success = await assignBooking(apiType, bookingId, {
          assigned_to: parseInt(selectedEmployee),
          assignment_notes: assignmentNotes.trim() || undefined
        });
      }
      
      if (success) {
        onClose();
        setSelectedEmployee('');
        setAssignmentNotes('');
      }
    } catch (error) {
      console.error('Assignment error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const activeEmployees = employees.filter(emp => emp.is_active && emp.role !== 'USER');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Assign {type.charAt(0).toUpperCase() + type.slice(1)} Booking
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Booking Info */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Booking Details</h4>
            <div className="text-sm text-gray-600 space-y-1">
              <p><strong>ID:</strong> {booking.book_id}</p>
              <p><strong>Customer:</strong> {booking.user_email || booking.contact_email}</p>
              <p><strong>Date:</strong> {booking.selected_date || booking.booking_date}</p>
              <p><strong>Time:</strong> {booking.selected_time || booking.start_time}</p>
              {currentlyAssigned ? (
                <p><strong>Currently Assigned:</strong> {currentAssignedName || `Employee ID: ${currentlyAssigned}`}</p>
              ) : (
                <p><strong>Status:</strong> <span className="text-amber-600">Unassigned</span></p>
              )}
            </div>
          </div>

          {/* Employee Selection */}
          <div>
            <label htmlFor="employee" className="block text-sm font-medium text-gray-700 mb-2">
              <UserIcon className="h-4 w-4 inline mr-1" />
              Assign to Employee
            </label>
            <select
              id="employee"
              value={selectedEmployee}
              onChange={(e) => setSelectedEmployee(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              required
            >
              <option value="">Select an employee...</option>
              {currentlyAssigned && (
                <option value="0" className="text-red-600">
                  🗑️ Unassign from current employee
                </option>
              )}
              {activeEmployees.map((employee) => (
                <option 
                  key={employee.id} 
                  value={employee.id.toString()}
                  disabled={employee.id === currentlyAssigned}
                >
                  {employee.username || employee.email} 
                  {employee.id === currentlyAssigned && ' (Currently Assigned)'}
                  {employee.role !== 'ADMIN' && ` (${employee.role})`}
                </option>
              ))}
            </select>
            
            {activeEmployees.length === 0 && (
              <p className="text-sm text-gray-500 mt-1">
                No active employees available for assignment
              </p>
            )}
          </div>

          {/* Assignment Notes */}
          {selectedEmployee && selectedEmployee !== '0' && (
            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                Assignment Notes (Optional)
              </label>
              <textarea
                id="notes"
                value={assignmentNotes}
                onChange={(e) => setAssignmentNotes(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                placeholder="Any special instructions or notes for the assigned employee..."
              />
            </div>
          )}

          {/* Unassignment Warning */}
          {selectedEmployee === '0' && (
            <div className="bg-amber-50 border border-amber-200 rounded-md p-3">
              <div className="text-sm text-amber-700">
                <strong>Warning:</strong> This will remove the current assignment. The booking will become unassigned.
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !selectedEmployee}
              className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Processing...' : selectedEmployee === '0' ? 'Unassign' : 'Assign'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}