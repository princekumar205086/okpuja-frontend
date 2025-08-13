"use client";
import React from 'react';
import { RecentActivity } from './types';
import {
  CalendarToday as BookingIcon,
  Payment as PaymentIcon,
  StarBorder as ConsultationIcon,
  CheckCircle as CompletionIcon,
  Circle as DefaultIcon,
} from '@mui/icons-material';
import { formatDistanceToNow, parseISO } from 'date-fns';

interface ActivityItemProps {
  activity: RecentActivity;
}

const ActivityItem: React.FC<ActivityItemProps> = ({ activity }) => {
  const getActivityIcon = () => {
    switch (activity.type) {
      case 'booking':
        return <BookingIcon className="w-5 h-5 text-orange-500" />;
      case 'payment':
        return <PaymentIcon className="w-5 h-5 text-green-500" />;
      case 'consultation':
        return <ConsultationIcon className="w-5 h-5 text-purple-500" />;
      case 'completion':
        return <CompletionIcon className="w-5 h-5 text-blue-500" />;
      default:
        return <DefaultIcon className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status?: string) => {
    if (!status) return '';
    switch (status) {
      case 'CONFIRMED':
        return 'text-green-600';
      case 'PENDING':
        return 'text-yellow-600';
      case 'COMPLETED':
        return 'text-blue-600';
      case 'CANCELLED':
      case 'FAILED':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    try {
      const date = parseISO(timestamp);
      return formatDistanceToNow(date, { addSuffix: true });
    } catch {
      return 'Recently';
    }
  };

  return (
    <div className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200">
      <div className="flex-shrink-0 mt-0.5">
        {getActivityIcon()}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-medium text-gray-900 line-clamp-1">
            {activity.title}
          </h4>
          <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
            {formatTimestamp(activity.timestamp)}
          </span>
        </div>
        <p className="text-sm text-gray-600 mt-1 line-clamp-2">
          {activity.description}
        </p>
        {activity.status && (
          <span className={`text-xs font-medium mt-1 inline-block ${getStatusColor(activity.status)}`}>
            Status: {activity.status}
          </span>
        )}
      </div>
    </div>
  );
};

interface RecentActivitiesProps {
  activities: RecentActivity[];
  loading?: boolean;
}

export const RecentActivities: React.FC<RecentActivitiesProps> = ({
  activities,
  loading = false,
}) => {
  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="animate-pulse mb-6">
          <div className="h-6 bg-gray-200 w-32 rounded"></div>
        </div>
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="flex space-x-3">
                <div className="w-5 h-5 bg-gray-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 w-3/4 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 w-1/2 rounded"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Recent Activities</h3>
        <button className="text-sm text-orange-600 hover:text-orange-700 font-medium transition-colors">
          View All
        </button>
      </div>

      <div className="space-y-2">
        {activities.length === 0 ? (
          <div className="text-center py-8">
            <DefaultIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">No recent activities</p>
            <p className="text-gray-400 text-xs mt-1">
              Your recent actions will appear here
            </p>
          </div>
        ) : (
          activities.map((activity) => (
            <ActivityItem key={activity.id} activity={activity} />
          ))
        )}
      </div>

      {activities.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <p className="text-xs text-gray-500 text-center">
            Stay updated with your spiritual journey progress
          </p>
        </div>
      )}
    </div>
  );
};
