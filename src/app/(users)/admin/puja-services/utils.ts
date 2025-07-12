import * as XLSX from 'xlsx';
import { PujaService } from '@/app/stores/pujaServiceStore';
import { Home, Business, Computer, Star, StarHalf, StarBorder, Settings } from '@mui/icons-material';
import React from 'react';

// Type definitions
export interface ServiceTypeOption {
  value: string;
  label: string;
  icon: React.ReactElement;
}

export interface ServiceStatusOption {
  value: string;
  label: string;
}

export interface LanguageOption {
  value: string;
  label: string;
}

export interface PackageTypeOption {
  value: string;
  label: string;
  icon: React.ReactElement;
}

// Service status options
export const serviceStatusOptions: ServiceStatusOption[] = [
  { value: 'true', label: 'Active' },
  { value: 'false', label: 'Inactive' },
];

// Service type options with icons
export const serviceTypeOptions: ServiceTypeOption[] = [
  { 
    value: 'HOME', 
    label: 'At Home',
    icon: React.createElement(Home, { fontSize: 'small' })
  },
  { 
    value: 'TEMPLE', 
    label: 'At Temple',
    icon: React.createElement(Business, { fontSize: 'small' })
  },
  { 
    value: 'ONLINE', 
    label: 'Online',
    icon: React.createElement(Computer, { fontSize: 'small' })
  },
];

// Language options for packages
export const languageOptions: LanguageOption[] = [
  { value: 'HINDI', label: 'Hindi' },
  { value: 'ENGLISH', label: 'English' },
  { value: 'SANSKRIT', label: 'Sanskrit' },
  { value: 'REGIONAL', label: 'Regional' },
];

// Package type options with icons
export const packageTypeOptions: PackageTypeOption[] = [
  { 
    value: 'BASIC', 
    label: 'Basic',
    icon: React.createElement(StarBorder, { fontSize: 'small' })
  },
  { 
    value: 'STANDARD', 
    label: 'Standard',
    icon: React.createElement(StarHalf, { fontSize: 'small' })
  },
  { 
    value: 'PREMIUM', 
    label: 'Premium',
    icon: React.createElement(Star, { fontSize: 'small' })
  },
  { 
    value: 'CUSTOM', 
    label: 'Custom',
    icon: React.createElement(Settings, { fontSize: 'small' })
  },
];

// Format currency (Indian Rupee)
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
};

// Format duration in minutes to readable format
export const formatDuration = (minutes: number): string => {
  if (minutes < 60) {
    return `${minutes}m`;
  }
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
};

// Format datetime to readable format
export const formatDateTime = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch (error) {
    return 'Invalid Date';
  }
};

// Get proper image URL with fallback
export const getImageUrl = (imageUrl?: string): string => {
  if (!imageUrl) {
    return '/images/service-placeholder.jpg';
  }
  
  // If it's already a full URL, return as is
  if (imageUrl.startsWith('http')) {
    return imageUrl;
  }
  
  // If it's a relative path, construct full URL
  return `${process.env.NEXT_PUBLIC_API_BASE_URL}${imageUrl}`;
};

// Truncate text to specified length
export const truncateText = (text: string, maxLength: number = 100): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
};

// Strip HTML tags from content and return plain text
export const stripHtmlTags = (html: string): string => {
  if (!html) return '';
  
  // Create a temporary div element to parse HTML
  if (typeof window !== 'undefined') {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    return tempDiv.textContent || tempDiv.innerText || '';
  }
  
  // Fallback for server-side: simple regex to remove HTML tags
  return html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim();
};

// Truncate HTML content and return plain text
export const truncateHtmlText = (html: string, maxLength: number = 100): string => {
  const plainText = stripHtmlTags(html);
  return truncateText(plainText, maxLength);
};

// Export services to Excel
export const exportServicesToExcel = (services: PujaService[], filename: string = 'puja-services') => {
  try {
    // Prepare data for export
    const exportData = services.map(service => ({
      'ID': service.id,
      'Title': service.title,
      'Description': stripHtmlTags(service.description), // Strip HTML for Excel export
      'Category': service.category_detail?.name || 'No Category',
      'Type': service.type,
      'Duration (minutes)': service.duration_minutes,
      'Status': service.is_active ? 'Active' : 'Inactive',
      'Created': formatDateTime(service.created_at),
      'Updated': formatDateTime(service.updated_at),
    }));

    // Create workbook and worksheet
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(exportData);

    // Set column widths
    const colWidths = [
      { wch: 8 },  // ID
      { wch: 25 }, // Title
      { wch: 40 }, // Description
      { wch: 15 }, // Category
      { wch: 12 }, // Type
      { wch: 15 }, // Duration
      { wch: 10 }, // Status
      { wch: 18 }, // Created
      { wch: 18 }, // Updated
    ];
    ws['!cols'] = colWidths;

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Puja Services');

    // Generate filename with timestamp
    const timestamp = new Date().toISOString().split('T')[0];
    const finalFilename = `${filename}-${timestamp}.xlsx`;

    // Write and download file
    XLSX.writeFile(wb, finalFilename);
    
    return true;
  } catch (error) {
    console.error('Export error:', error);
    return false;
  }
};

// Debounce function for search
export const debounce = <T extends (...args: any[]) => void>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

// Get status color
export const getStatusColor = (isActive: boolean) => {
  return isActive ? 'success' : 'error';
};

// Get service type color
export const getServiceTypeColor = (type: string) => {
  switch (type) {
    case 'HOME':
      return 'primary';
    case 'TEMPLE':
      return 'secondary';
    case 'ONLINE':
      return 'info';
    default:
      return 'default';
  }
};

// Get package type color
export const getPackageTypeColor = (type: string) => {
  switch (type) {
    case 'BASIC':
      return 'default';
    case 'STANDARD':
      return 'primary';
    case 'PREMIUM':
      return 'secondary';
    case 'CUSTOM':
      return 'info';
    default:
      return 'default';
  }
};

// Get language display name
export const getLanguageDisplayName = (language: string): string => {
  const option = languageOptions.find(opt => opt.value === language);
  return option ? option.label : language;
};

// Get package type display name
export const getPackageTypeDisplayName = (packageType: string): string => {
  const option = packageTypeOptions.find(opt => opt.value === packageType);
  return option ? option.label : packageType;
};
