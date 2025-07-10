"use client";
import React from 'react';
import { Card, CardContent, Typography, Box, useMediaQuery, useTheme } from '@mui/material';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from '@mui/icons-material';
import CountUp from 'react-countup';

interface MobileStatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  change: string;
  trend: 'up' | 'down' | 'neutral';
  color: string;
  gradient: string;
  index: number;
}

const MobileStatsCard: React.FC<MobileStatsCardProps> = ({
  title,
  value,
  icon,
  change,
  trend,
  color,
  gradient,
  index
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isNumeric = typeof value === 'number';
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="h-full"
    >
      <Card
        sx={{
          height: '100%',
          background: gradient,
          border: `1px solid ${color}20`,
          borderRadius: { xs: 2, sm: 3 },
          overflow: 'hidden',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: color,
          },
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: `0 8px 25px ${color}20`,
          },
          transition: 'all 0.3s ease',
        }}
      >
        <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
          {/* Mobile Layout */}
          {isMobile ? (
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Box 
                  sx={{ 
                    p: 1, 
                    borderRadius: 1.5, 
                    backgroundColor: `${color}15`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {React.isValidElement(icon)
                    ? React.cloneElement(icon as React.ReactElement<any>, {
                        sx: { fontSize: 20, color: color }
                      })
                    : icon}
                </Box>
                <Typography variant="h5" component="div" fontWeight="bold" sx={{ color: 'text.primary' }}>
                  {isNumeric ? (
                    <CountUp 
                      end={value as number} 
                      duration={2} 
                      separator="," 
                      prefix={title.includes('Revenue') ? '₹' : ''}
                    />
                  ) : (
                    value
                  )}
                </Typography>
              </Box>
              
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                {title}
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                {trend === 'up' ? (
                  <TrendingUp sx={{ fontSize: 14, color: 'success.main' }} />
                ) : trend === 'down' ? (
                  <TrendingDown sx={{ fontSize: 14, color: 'error.main' }} />
                ) : null}
                <Typography 
                  variant="caption" 
                  sx={{ 
                    color: trend === 'up' ? 'success.main' : trend === 'down' ? 'error.main' : 'text.secondary',
                    fontWeight: 500,
                    fontSize: 11
                  }}
                >
                  {change}
                </Typography>
              </Box>
            </Box>
          ) : (
            /* Desktop Layout */
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                <Box 
                  sx={{ 
                    p: 1.5, 
                    borderRadius: 2, 
                    backgroundColor: `${color}15`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {React.isValidElement(icon)
                    ? React.cloneElement(icon as React.ReactElement<any>, { 
                        sx: { fontSize: 28, color: color } 
                      })
                    : icon}
                </Box>
              </Box>
              
              <Typography variant="h3" component="div" fontWeight="bold" sx={{ mb: 0.5, color: 'text.primary' }}>
                {isNumeric ? (
                  <CountUp 
                    end={value as number} 
                    duration={2} 
                    separator="," 
                    prefix={title.includes('Revenue') ? '₹' : ''}
                  />
                ) : (
                  value
                )}
              </Typography>
              
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {title}
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                {trend === 'up' ? (
                  <TrendingUp sx={{ fontSize: 16, color: 'success.main' }} />
                ) : trend === 'down' ? (
                  <TrendingDown sx={{ fontSize: 16, color: 'error.main' }} />
                ) : null}
                <Typography 
                  variant="caption" 
                  sx={{ 
                    color: trend === 'up' ? 'success.main' : trend === 'down' ? 'error.main' : 'text.secondary',
                    fontWeight: 500
                  }}
                >
                  {change}
                </Typography>
              </Box>
            </Box>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default MobileStatsCard;
