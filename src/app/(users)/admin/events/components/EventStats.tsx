'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  Paper,
  Typography,
  Box,
  IconButton,
  Tooltip,
  CircularProgress,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  Event as EventIcon,
  Star as StarIcon,
  Visibility as VisibilityIcon,
  CalendarToday as CalendarIcon,
  Schedule as ScheduleIcon,
} from '@mui/icons-material';
import { useEventStore } from '../../../../stores/eventStore';

interface EventStatsProps {
  loading?: boolean;
}

const EventStats: React.FC<EventStatsProps> = ({ loading = false }) => {
  const { events } = useEventStore();

  const stats = React.useMemo(() => {
    const totalEvents = events.length;
    const publishedEvents = events.filter(e => e.status === 'PUBLISHED').length;
    const featuredEvents = events.filter(e => e.is_featured).length;
    const draftEvents = events.filter(e => e.status === 'DRAFT').length;
    const upcomingEvents = events.filter(e => {
      const eventDate = new Date(e.event_date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return eventDate >= today && e.status === 'PUBLISHED';
    }).length;
    const todayEvents = events.filter(e => {
      const eventDate = new Date(e.event_date);
      const today = new Date();
      return eventDate.toDateString() === today.toDateString();
    }).length;

    return {
      totalEvents,
      publishedEvents,
      featuredEvents,
      draftEvents,
      upcomingEvents,
      todayEvents,
    };
  }, [events]);

  const statCards = [
    {
      title: 'Total Events',
      value: stats.totalEvents,
      icon: EventIcon,
      color: 'from-blue-500 to-blue-600',
      textColor: 'text-blue-600',
      description: 'All events in system',
    },
    {
      title: 'Published',
      value: stats.publishedEvents,
      icon: VisibilityIcon,
      color: 'from-green-500 to-green-600',
      textColor: 'text-green-600',
      description: 'Live events',
    },
    {
      title: 'Featured',
      value: stats.featuredEvents,
      icon: StarIcon,
      color: 'from-yellow-500 to-yellow-600',
      textColor: 'text-yellow-600',
      description: 'Featured events',
    },
    {
      title: 'Upcoming',
      value: stats.upcomingEvents,
      icon: CalendarIcon,
      color: 'from-purple-500 to-purple-600',
      textColor: 'text-purple-600',
      description: 'Future events',
    },
    {
      title: 'Today',
      value: stats.todayEvents,
      icon: ScheduleIcon,
      color: 'from-red-500 to-red-600',
      textColor: 'text-red-600',
      description: 'Events today',
    },
    {
      title: 'Drafts',
      value: stats.draftEvents,
      icon: TrendingUpIcon,
      color: 'from-gray-500 to-gray-600',
      textColor: 'text-gray-600',
      description: 'Work in progress',
    },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <Paper
            key={index}
            elevation={2}
            className="p-4 rounded-xl bg-gray-100 animate-pulse"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-8 h-8 bg-gray-300 rounded-lg" />
                <div className="w-6 h-6 bg-gray-300 rounded" />
              </div>
              <div className="w-12 h-8 bg-gray-300 rounded" />
              <div className="w-20 h-4 bg-gray-300 rounded" />
            </div>
          </Paper>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
      {statCards.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Paper
            elevation={2}
            className="p-4 rounded-xl hover:shadow-lg transition-shadow duration-300 cursor-pointer group relative overflow-hidden"
          >
            {/* Background Gradient */}
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2 rounded-lg bg-gradient-to-br ${stat.color} text-white`}>
                  <stat.icon className="w-5 h-5" />
                </div>
                <Tooltip title={stat.description}>
                  <IconButton size="small" className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <VisibilityIcon className="w-4 h-4 text-gray-400" />
                  </IconButton>
                </Tooltip>
              </div>
              
              <Typography
                variant="h4"
                className={`font-bold ${stat.textColor} mb-1 group-hover:scale-105 transition-transform`}
              >
                {stat.value}
              </Typography>
              
              <Typography
                variant="body2"
                className="text-gray-600 font-medium"
              >
                {stat.title}
              </Typography>
              
              <Typography
                variant="caption"
                className="text-gray-500 text-xs"
              >
                {stat.description}
              </Typography>
            </div>
          </Paper>
        </motion.div>
      ))}
    </div>
  );
};

export default EventStats;
