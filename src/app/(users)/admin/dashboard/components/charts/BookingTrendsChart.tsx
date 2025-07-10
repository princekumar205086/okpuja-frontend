"use client";
import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const BookingTrendsChart: React.FC = () => {
  const data = [
    { name: 'Puja Bookings', value: 1234, color: '#ff6b35' },
    { name: 'Astrology Consultation', value: 567, color: '#8b5cf6' },
    { name: 'Blog Engagement', value: 234, color: '#06b6d4' },
    { name: 'Gallery Views', value: 789, color: '#84cc16' },
    { name: 'Contact Inquiries', value: 156, color: '#f7931e' },
  ];

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({
    cx, cy, midAngle, innerRadius, outerRadius, percent
  }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize={12}
        fontWeight="bold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <Card sx={{ height: '100%', borderRadius: 3 }}>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Service Distribution
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Overview of all services and engagement
            </Typography>
          </Box>

          <Box sx={{ height: 300, width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomizedLabel}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e0e0e0',
                    borderRadius: 8,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                  }}
                  formatter={(value: number) => [`${value.toLocaleString()}`, 'Count']}
                />
              </PieChart>
            </ResponsiveContainer>
          </Box>

          <Box sx={{ mt: 2 }}>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: 'center' }}>
              {data.map((entry, index) => (
                <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box 
                    sx={{ 
                      width: 12, 
                      height: 12, 
                      backgroundColor: entry.color, 
                      borderRadius: '50%' 
                    }} 
                  />
                  <Typography variant="caption" color="text.secondary">
                    {entry.name}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default BookingTrendsChart;
