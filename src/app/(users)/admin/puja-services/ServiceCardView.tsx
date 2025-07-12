import React from 'react';
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Chip,
  IconButton,
  Badge,
  Tooltip,
  CardActions,
  Skeleton,
} from '@mui/material';
import {
  Visibility,
  Edit,
  Delete,
  Schedule,
  Category,
  LocationOn,
  MoreVert,
} from '@mui/icons-material';
import { PujaService } from '@/app/stores/pujaServiceStore';
import {
  formatDuration,
  formatDateTime,
  getImageUrl,
  serviceTypeOptions,
  truncateHtmlText
} from './utils';

interface ServiceCardViewProps {
  services: PujaService[];
  loading: boolean;
  onView: (service: PujaService) => void;
  onEdit: (service: PujaService) => void;
  onDelete: (service: PujaService) => void;
}

// Loading skeleton component
const ServiceCardSkeleton: React.FC = () => (
  <Card
    sx={{
      height: { xs: 'auto', md: 400 },
      minHeight: { xs: 320, md: 400 },
      display: 'flex',
      flexDirection: 'column',
      borderRadius: 2,
      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
    }}
  >
    <Skeleton 
      variant="rectangular" 
      sx={{ 
        height: { xs: 160, md: 200 },
        width: '100%'
      }} 
    />
    <CardContent sx={{ flex: 1, p: { xs: 2, md: 3 } }}>
      <Skeleton variant="text" height={32} width="80%" />
      <Skeleton variant="text" height={20} width="60%" sx={{ mt: 1 }} />
      <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
        <Skeleton variant="rounded" width={60} height={24} />
        <Skeleton variant="rounded" width={80} height={24} />
      </Box>
      <Skeleton variant="text" height={60} sx={{ mt: 2 }} />
    </CardContent>
  </Card>
);

const ServiceCard: React.FC<{
  service: PujaService;
  onView: (service: PujaService) => void;
  onEdit: (service: PujaService) => void;
  onDelete: (service: PujaService) => void;
}> = ({ service, onView, onEdit, onDelete }) => {
  const serviceTypeOption = serviceTypeOptions.find(opt => opt.value === service.type);
  const serviceTypeLabel = serviceTypeOption?.label || service.type;

  return (
    <Card
      sx={{
        height: { xs: 'auto', md: 400 },
        minHeight: { xs: 320, md: 400 },
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 2,
        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        cursor: 'pointer',
        position: 'relative',
        overflow: 'hidden',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 10px 10px -5px rgb(0 0 0 / 0.04)',
          '& .card-media': {
            transform: 'scale(1.05)',
          },
          '& .card-actions': {
            opacity: 1,
            transform: 'translateY(0)',
          },
        },
      }}
      onClick={() => onView(service)}
    >
      {/* Status Badge */}
      <Badge
        badgeContent={
          <Chip
            label={service.is_active ? 'Active' : 'Inactive'}
            color={service.is_active ? 'success' : 'error'}
            size="small"
            sx={{
              position: 'absolute',
              top: 12,
              right: 12,
              zIndex: 2,
              fontWeight: 600,
              fontSize: '0.75rem',
            }}
          />
        }
      />

      {/* Service Type Badge */}
      <Box
        sx={{
          position: 'absolute',
          top: 12,
          left: 12,
          zIndex: 2,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          borderRadius: 1,
          px: 1.5,
          py: 0.5,
          display: 'flex',
          alignItems: 'center',
          gap: 0.5,
        }}
      >
        <LocationOn sx={{ fontSize: 14, color: 'white' }} />
        <Typography
          variant="caption"
          sx={{
            color: 'white',
            fontWeight: 600,
            fontSize: '0.75rem',
          }}
        >
          {serviceTypeLabel}
        </Typography>
      </Box>

      {/* Floating Action Buttons */}
      <Box
        className="card-actions"
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, 20px)',
          opacity: 0,
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          zIndex: 3,
          display: 'flex',
          gap: 1,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <Tooltip title="View Details">
          <IconButton
            size="small"
            onClick={() => onView(service)}
            sx={{
              backgroundColor: 'info.main',
              color: 'white',
              '&:hover': { backgroundColor: 'info.dark' },
            }}
          >
            <Visibility fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Edit Service">
          <IconButton
            size="small"
            onClick={() => onEdit(service)}
            sx={{
              backgroundColor: 'warning.main',
              color: 'white',
              '&:hover': { backgroundColor: 'warning.dark' },
            }}
          >
            <Edit fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete Service">
          <IconButton
            size="small"
            onClick={() => onDelete(service)}
            sx={{
              backgroundColor: 'error.main',
              color: 'white',
              '&:hover': { backgroundColor: 'error.dark' },
            }}
          >
            <Delete fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Service Image */}
      <CardMedia
        component="img"
        className="card-media"
        height={200}
        image={getImageUrl(service.image_url)}
        alt={service.title}
        sx={{
          transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          objectFit: 'cover',
          height: { xs: 160, md: 200 },
        }}
      />

      {/* Card Content */}
      <CardContent sx={{ flex: 1, p: { xs: 2, md: 3 }, display: 'flex', flexDirection: 'column' }}>
        {/* Service Title */}
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            fontSize: '1.1rem',
            lineHeight: 1.3,
            mb: 1,
            color: 'text.primary',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {service.title}
        </Typography>

        {/* Service Info Chips */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
          <Chip
            label={service.category_detail?.name || 'No Category'}
            size="small"
            variant="outlined"
            icon={<Category fontSize="small" />}
            sx={{
              borderRadius: 1,
              fontSize: '0.75rem',
              height: 24,
            }}
          />
          <Chip
            label={formatDuration(service.duration_minutes)}
            size="small"
            variant="outlined"
            icon={<Schedule fontSize="small" />}
            sx={{
              borderRadius: 1,
              fontSize: '0.75rem',
              height: 24,
            }}
          />
        </Box>

        {/* Description */}
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            flex: 1,
            fontSize: '0.875rem',
            lineHeight: 1.5,
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {truncateHtmlText(service.description, 120)}
        </Typography>

        {/* Footer with updated time */}
        <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{
              fontSize: '0.75rem',
              fontWeight: 500,
            }}
          >
            Updated: {formatDateTime(service.updated_at)}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

const ServiceCardView: React.FC<ServiceCardViewProps> = (props) => {
  const { services, loading, onView, onEdit, onDelete } = props;

  if (loading) {
    return (
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(3, 1fr)',
            lg: 'repeat(4, 1fr)',
          },
          gap: 3,
        }}
      >
        {Array.from({ length: 8 }).map((_, index) => (
          <ServiceCardSkeleton key={index} />
        ))}
      </Box>
    );
  }

  if (services.length === 0) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          py: 8,
          textAlign: 'center',
        }}
      >
        <Typography variant="h6" color="text.secondary" gutterBottom>
          No services found
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Try adjusting your search criteria or add a new service.
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: '1fr',
          sm: 'repeat(2, 1fr)',
          md: 'repeat(3, 1fr)',
          lg: 'repeat(4, 1fr)',
        },
        gap: 3,
      }}
    >
      {services.map((service) => (
        <ServiceCard
          key={service.id}
          service={service}
          onView={onView}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </Box>
  );
};

export default ServiceCardView;
