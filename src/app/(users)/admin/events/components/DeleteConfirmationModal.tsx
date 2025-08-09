'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  Warning as WarningIcon,
  Delete as DeleteIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';
import { Event } from '../../../../stores/eventStore';

interface DeleteConfirmationModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  event: Event | null;
  loading: boolean;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  open,
  onClose,
  onConfirm,
  event,
  loading,
}) => {
  if (!event) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        className: "rounded-2xl overflow-hidden",
      }}
    >
      <DialogTitle className="bg-red-50 text-red-800 border-b border-red-100">
        <div className="flex items-center">
          <WarningIcon className="mr-2 text-red-600" />
          <Typography variant="h6" className="font-bold">
            Delete Event Confirmation
          </Typography>
        </div>
      </DialogTitle>

      <DialogContent className="p-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <Alert severity="warning" className="rounded-lg">
            <Typography variant="body2">
              <strong>Warning:</strong> This action cannot be undone. The event and all its data will be permanently deleted.
            </Typography>
          </Alert>

          <Box className="bg-gray-50 p-4 rounded-lg">
            <Typography variant="subtitle1" className="font-semibold text-gray-800 mb-2">
              Event to be deleted:
            </Typography>
            
            <div className="space-y-2">
              <div>
                <Typography variant="body2" className="text-gray-600">
                  Title:
                </Typography>
                <Typography variant="body1" className="font-medium">
                  {event.title}
                </Typography>
              </div>
              
              <div>
                <Typography variant="body2" className="text-gray-600">
                  Date:
                </Typography>
                <Typography variant="body1" className="font-medium">
                  {event.event_date}
                </Typography>
              </div>
              
              <div>
                <Typography variant="body2" className="text-gray-600">
                  Status:
                </Typography>
                <Typography variant="body1" className="font-medium">
                  {event.status}
                </Typography>
              </div>
              
              {event.is_featured && (
                <div>
                  <Typography variant="body2" className="text-yellow-600">
                    ⭐ This is a featured event
                  </Typography>
                </div>
              )}
            </div>
          </Box>

          <Typography variant="body1" className="text-gray-700">
            Are you sure you want to delete this event? This will permanently remove:
          </Typography>

          <ul className="list-disc list-inside space-y-1 text-gray-600 ml-4">
            <li>Event details and description</li>
            <li>Event images and media</li>
            <li>Registration links</li>
            <li>All associated metadata</li>
          </ul>

          <Typography variant="body2" className="text-red-600 font-medium">
            Type the event title to confirm deletion.
          </Typography>
        </motion.div>
      </DialogContent>

      <DialogActions className="p-6 bg-gray-50 border-t">
        <Button
          onClick={onClose}
          variant="outlined"
          disabled={loading}
          startIcon={<CancelIcon />}
          className="mr-auto"
        >
          Cancel
        </Button>
        
        <Button
          onClick={onConfirm}
          variant="contained"
          color="error"
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} /> : <DeleteIcon />}
          className="bg-red-600 hover:bg-red-700"
        >
          {loading ? 'Deleting...' : 'Delete Event'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteConfirmationModal;
