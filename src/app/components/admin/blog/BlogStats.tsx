"use client";
import React, { useState, useEffect } from 'react';
import {
  Paper,
  Typography,
  Box,
  CircularProgress,
  Chip,
} from '@mui/material';
import {
  Article,
  Category,
  LocalOffer,
  Comment,
  Visibility,
  TrendingUp,
} from '@mui/icons-material';
import { useBlogStore } from '@/app/stores/blogStore';

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
  trend?: number;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color, trend }) => {
  const getColorClasses = (color: string) => {
    const colorMap: Record<string, { bg: string; text: string }> = {
      blue: { bg: 'bg-blue-100', text: 'text-blue-600' },
      green: { bg: 'bg-green-100', text: 'text-green-600' },
      purple: { bg: 'bg-purple-100', text: 'text-purple-600' },
      orange: { bg: 'bg-orange-100', text: 'text-orange-600' },
      indigo: { bg: 'bg-indigo-100', text: 'text-indigo-600' },
      yellow: { bg: 'bg-yellow-100', text: 'text-yellow-600' },
    };
    return colorMap[color] || { bg: 'bg-gray-100', text: 'text-gray-600' };
  };

  const colorClasses = getColorClasses(color);

  return (
    <Paper className="p-4 hover:shadow-md transition-shadow">
      <Box className="flex items-center justify-between mb-2">
        <Box className={`p-2 rounded-lg ${colorClasses.bg}`}>
          <Box className={colorClasses.text}>
            {icon}
          </Box>
        </Box>
        {trend !== undefined && (
          <Box className="flex items-center gap-1">
            <TrendingUp className={`w-4 h-4 ${trend > 0 ? 'text-green-500' : 'text-red-500'}`} />
            <Typography variant="caption" className={trend > 0 ? 'text-green-600' : 'text-red-600'}>
              {trend > 0 ? '+' : ''}{trend}%
            </Typography>
          </Box>
        )}
      </Box>
      
      <Typography variant="h4" className="font-bold text-gray-800 mb-1">
        {value.toLocaleString()}
      </Typography>
      
      <Typography variant="body2" color="textSecondary">
        {title}
      </Typography>
    </Paper>
  );
};

interface BlogStatsProps {
  className?: string;
}

const BlogStats: React.FC<BlogStatsProps> = ({ className }) => {
  const { posts, categories, tags, fetchPosts, fetchCategories, fetchTags, loading } = useBlogStore();
  const [totalViews, setTotalViews] = useState(0);

  useEffect(() => {
    fetchPosts();
    fetchCategories();
    fetchTags();
  }, []);

  useEffect(() => {
    // Calculate total views
    const views = posts.reduce((total, post) => total + post.view_count, 0);
    setTotalViews(views);
  }, [posts]);

  const publishedPosts = posts.filter(post => post.status === 'PUBLISHED');
  const draftPosts = posts.filter(post => post.status === 'DRAFT');
  const featuredPosts = posts.filter(post => post.is_featured);

  const stats = [
    {
      title: 'Total Posts',
      value: posts.length,
      icon: <Article />,
      color: 'blue',
      trend: 12,
    },
    {
      title: 'Published',
      value: publishedPosts.length,
      icon: <Article />,
      color: 'green',
      trend: 8,
    },
    {
      title: 'Categories',
      value: categories.length,
      icon: <Category />,
      color: 'purple',
      trend: 5,
    },
    {
      title: 'Tags',
      value: tags.length,
      icon: <LocalOffer />,
      color: 'orange',
      trend: 15,
    },
    {
      title: 'Total Views',
      value: totalViews,
      icon: <Visibility />,
      color: 'indigo',
      trend: 25,
    },
    {
      title: 'Featured Posts',
      value: featuredPosts.length,
      icon: <TrendingUp />,
      color: 'yellow',
      trend: 3,
    },
  ];

  if (loading) {
    return (
      <Box className={`${className} flex justify-center items-center py-8`}>
        <CircularProgress size={40} className="text-orange-500" />
      </Box>
    );
  }

  return (
    <Box className={className}>
      <Box className="mb-6">
        <Typography variant="h6" className="font-semibold text-gray-800 mb-2">
          Blog Overview
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Key metrics and statistics for your blog content
        </Typography>
      </Box>

      {/* Stats Grid */}
      <Box className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </Box>

      {/* Quick Status Overview */}
      <Paper className="p-4">
        <Typography variant="h6" className="font-medium text-gray-800 mb-4">
          Content Status
        </Typography>
        
        <Box className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Box className="text-center">
            <Typography variant="h3" className="font-bold text-green-600 mb-1">
              {publishedPosts.length}
            </Typography>
            <Typography variant="body2" color="textSecondary" className="mb-2">
              Published Posts
            </Typography>
            <Chip 
              label="Live" 
              color="success" 
              size="small" 
              variant="filled"
            />
          </Box>
          
          <Box className="text-center">
            <Typography variant="h3" className="font-bold text-orange-600 mb-1">
              {draftPosts.length}
            </Typography>
            <Typography variant="body2" color="textSecondary" className="mb-2">
              Draft Posts
            </Typography>
            <Chip 
              label="In Progress" 
              color="warning" 
              size="small" 
              variant="filled"
            />
          </Box>
          
          <Box className="text-center">
            <Typography variant="h3" className="font-bold text-purple-600 mb-1">
              {featuredPosts.length}
            </Typography>
            <Typography variant="body2" color="textSecondary" className="mb-2">
              Featured Posts
            </Typography>
            <Chip 
              label="Promoted" 
              sx={{ backgroundColor: '#9333ea', color: 'white' }}
              size="small" 
              variant="filled"
            />
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default BlogStats;
