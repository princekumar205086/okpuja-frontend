"use client";
import React from 'react';
import { Breadcrumbs, Typography, Box, Link as MuiLink } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import Link from 'next/link';

interface BreadcrumbItem {
  label: string;
  href?: string;
  isCurrent?: boolean;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  showHomeIcon?: boolean;
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items, showHomeIcon = true }) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', py: 1 }}>
      <Breadcrumbs
        separator={<ChevronRightIcon fontSize="small" />}
        aria-label="breadcrumb"
        sx={{
          '& .MuiBreadcrumbs-separator': {
            mx: 1,
          },
        }}
      >
        {showHomeIcon && (
          <Link href="/" passHref>
            <MuiLink
              component="span"
              sx={{
                display: 'flex',
                alignItems: 'center',
                color: 'text.secondary',
                textDecoration: 'none',
                '&:hover': {
                  color: 'primary.main',
                },
              }}
            >
              <HomeIcon sx={{ mr: 0.5, fontSize: '1rem' }} />
              Home
            </MuiLink>
          </Link>
        )}
        
        {items.map((item, index) => {
          if (item.isCurrent || !item.href) {
            return (
              <Typography
                key={index}
                color="text.primary"
                sx={{ fontWeight: 500 }}
              >
                {item.label}
              </Typography>
            );
          }
          
          return (
            <Link key={index} href={item.href} passHref>
              <MuiLink
                component="span"
                sx={{
                  color: 'text.secondary',
                  textDecoration: 'none',
                  '&:hover': {
                    color: 'primary.main',
                  },
                }}
              >
                {item.label}
              </MuiLink>
            </Link>
          );
        })}
      </Breadcrumbs>
    </Box>
  );
};

export default Breadcrumb;
