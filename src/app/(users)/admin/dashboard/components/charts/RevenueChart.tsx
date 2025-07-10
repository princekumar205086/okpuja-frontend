"use client";
import React from 'react';
import { Card, CardContent, Typography, Box, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

const RevenueChart: React.FC = () => {
  const [period, setPeriod] = React.useState('7d');

  const data = [
    { name: 'Jan', puja: 45000, astrology: 23000, total: 68000 },
    { name: 'Feb', puja: 52000, astrology: 28000, total: 80000 },
    { name: 'Mar', puja: 48000, astrology: 35000, total: 83000 },
    { name: 'Apr', puja: 61000, astrology: 42000, total: 103000 },
    { name: 'May', puja: 55000, astrology: 38000, total: 93000 },
    { name: 'Jun', puja: 67000, astrology: 45000, total: 112000 },
    { name: 'Jul', puja: 71000, astrology: 52000, total: 123000 },
  ];

  const handlePeriodChange = (
    event: React.MouseEvent<HTMLElement>,
    newPeriod: string,
  ) => {
    if (newPeriod !== null) {
      setPeriod(newPeriod);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Card sx={{ height: '100%', borderRadius: 3 }}>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Box>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Revenue Analytics
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Monthly revenue breakdown
              </Typography>
            </Box>
            <ToggleButtonGroup
              value={period}
              exclusive
              onChange={handlePeriodChange}
              size="small"
              sx={{ '& .MuiToggleButton-root': { px: 2, py: 0.5 } }}
            >
              <ToggleButton value="7d">7D</ToggleButton>
              <ToggleButton value="30d">30D</ToggleButton>
              <ToggleButton value="90d">90D</ToggleButton>
              <ToggleButton value="1y">1Y</ToggleButton>
            </ToggleButtonGroup>
          </Box>

          <Box sx={{ height: 300, width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(value) => `₹${value / 1000}K`}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e0e0e0',
                    borderRadius: 8,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                  }}
                  formatter={(value: number, name: string) => [
                    `₹${value.toLocaleString()}`,
                    name === 'puja' ? 'Puja Revenue' : name === 'astrology' ? 'Astrology Revenue' : 'Total Revenue'
                  ]}
                />
                <Area
                  type="monotone"
                  dataKey="total"
                  stroke="#4f46e5"
                  fill="url(#colorTotal)"
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="puja"
                  stroke="#ff6b35"
                  fill="url(#colorPuja)"
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="astrology"
                  stroke="#8b5cf6"
                  fill="url(#colorAstrology)"
                  strokeWidth={2}
                />
                <defs>
                  <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorPuja" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ff6b35" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#ff6b35" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorAstrology" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
              </AreaChart>
            </ResponsiveContainer>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, mt: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{ width: 12, height: 12, backgroundColor: '#4f46e5', borderRadius: '50%' }} />
              <Typography variant="caption" color="text.secondary">Total Revenue</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{ width: 12, height: 12, backgroundColor: '#ff6b35', borderRadius: '50%' }} />
              <Typography variant="caption" color="text.secondary">Puja Revenue</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{ width: 12, height: 12, backgroundColor: '#8b5cf6', borderRadius: '50%' }} />
              <Typography variant="caption" color="text.secondary">Astrology Revenue</Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default RevenueChart;
