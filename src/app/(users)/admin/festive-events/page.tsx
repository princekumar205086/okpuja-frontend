'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Container,
  Box,
  Snackbar,
  Alert,
  Backdrop,
  CircularProgress,
} from '@mui/material';
import { Toaster } from 'react-hot-toast';
import { useEventStore, Event, EventFilters } from '../../../stores/eventStore';
import './styles/events.css';

// Import components
import EventListHeader from './components/EventListHeader';
import EventStats from './components/EventStats';
import EventFiltersBar from './components/EventFiltersBar';
import EventGrid from './components/EventGrid';
import EventFormModal from './components/EventFormModal';
import EventDetailModal from './components/EventDetailModal';
import DeleteConfirmationModal from './components/DeleteConfirmationModal';
import FloatingActionMenu from './components/FloatingActionMenu';

const FestiveEventsPage: React.FC = () => {
  const {
    events,
    loading,
    error,
    filters,
    totalCount,
    currentPage,
    pageSize,
    fetchEvents,
    deleteEvent,
    setFilters,
    clearError,
  } = useEventStore();

  // Modal states
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [formModalMode, setFormModalMode] = useState<'create' | 'edit'>('create');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<Event | null>(null);
  const [filtersVisible, setFiltersVisible] = useState(true);

  // Calculate total pages
  const totalPages = Math.ceil(totalCount / pageSize);

  // Fetch events on component mount and when filters change
  useEffect(() => {
    fetchEvents(1, filters);
  }, [fetchEvents, filters]);

  // Handlers
  const handleCreateNew = () => {
    setSelectedEvent(null);
    setFormModalMode('create');
    setFormModalOpen(true);
  };

  const handleEdit = (event: Event) => {
    setSelectedEvent(event);
    setFormModalMode('edit');
    setFormModalOpen(true);
  };

  const handleView = (event: Event) => {
    setSelectedEvent(event);
    setDetailModalOpen(true);
  };

  const handleDelete = (id: number) => {
    const event = events.find((e: Event) => e.id === id);
    if (event) {
      setEventToDelete(event);
      setDeleteModalOpen(true);
    }
  };

  const handleDeleteConfirm = async () => {
    if (eventToDelete) {
      const success = await deleteEvent(eventToDelete.id);
      if (success) {
        setDeleteModalOpen(false);
        setEventToDelete(null);
        // Refresh events if we're on a page that might now be empty
        if (events.length === 1 && currentPage > 1) {
          fetchEvents(currentPage - 1, filters);
        }
      }
    }
  };

  const handlePageChange = (page: number) => {
    fetchEvents(page, filters);
  };

  const handleFiltersChange = (newFilters: EventFilters) => {
    setFilters(newFilters);
    fetchEvents(1, newFilters); // Reset to first page when filters change
  };

  const handleRefresh = () => {
    fetchEvents(currentPage, filters);
  };

  const handleCreateFeatured = () => {
    setSelectedEvent(null);
    setFormModalMode('create');
    setFormModalOpen(true);
    // Pre-set featured flag when using this handler
  };

  const handleToggleFilters = () => {
    setFiltersVisible(!filtersVisible);
  };

  const handleCloseError = () => {
    clearError();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <Container maxWidth="xl" className="py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          {/* Header */}
          <EventListHeader
            onCreateNew={handleCreateNew}
            onRefresh={handleRefresh}
            loading={loading}
            totalCount={totalCount}
          />

          {/* Stats */}
          <EventStats loading={loading} />

          {/* Filters */}
          {filtersVisible && (
            <EventFiltersBar
              filters={filters}
              onFiltersChange={handleFiltersChange}
              onRefresh={handleRefresh}
              loading={loading}
              totalCount={totalCount}
            />
          )}

          {/* Event Grid */}
          <EventGrid
            events={events}
            loading={loading}
            error={error}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            onCreateNew={handleCreateNew}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onView={handleView}
            onRefresh={handleRefresh}
          />
        </motion.div>
      </Container>

      {/* Modals */}
      <EventFormModal
        open={formModalOpen}
        onClose={() => setFormModalOpen(false)}
        event={selectedEvent}
        mode={formModalMode}
      />

      <EventDetailModal
        open={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        event={selectedEvent}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <DeleteConfirmationModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        event={eventToDelete}
        loading={loading}
      />

      {/* Global Error Snackbar */}
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={handleCloseError}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={handleCloseError}
          severity="error"
          variant="filled"
          className="rounded-lg"
        >
          {error}
        </Alert>
      </Snackbar>

      {/* Loading Backdrop */}
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading && events.length === 0}
      >
        <div className="text-center">
          <CircularProgress color="inherit" size={60} />
          <div className="mt-4">
            <motion.div
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              Loading events...
            </motion.div>
          </div>
        </div>
      </Backdrop>

      {/* Floating Action Menu */}
      <FloatingActionMenu
        onCreateEvent={handleCreateNew}
        onCreateFeaturedEvent={handleCreateFeatured}
        onRefresh={handleRefresh}
        onToggleFilters={handleToggleFilters}
        position="bottom-right"
      />

      {/* Toast Notifications */}
      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
            borderRadius: '12px',
            padding: '16px',
            fontSize: '14px',
            marginBottom: '80px', // Space for FAB
          },
          success: {
            iconTheme: {
              primary: '#4ade80',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#f87171',
              secondary: '#fff',
            },
          },
        }}
      />
    </div>
  );
};

export default FestiveEventsPage;
