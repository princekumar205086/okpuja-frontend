import React from 'react';
import {
    Grid,
    Card,
    CardContent,
    CardMedia,
    Typography,
    Chip,
    Box,
    IconButton,
    Tooltip,
    CardActions,
    Button,
    Stack,
    alpha,
    useTheme,
} from '@mui/material';
import {
    Edit,
    Delete,
    Visibility,
    Schedule,
    Category,
    LocationOn,
    AccessTime,
} from '@mui/icons-material';
import { usePujaServiceStore, PujaService } from '../../../stores/pujaServiceStore';
import {
    formatDuration,
    formatDateTime,
    getImageUrl,
    serviceTypeOptions,
    truncateText
} from './utils';
import Image from 'next/image';

interface ServiceCardViewProps {
    services: PujaService[];
    onView: (service: PujaService) => void;
    onEdit: (service: PujaService) => void;
    onDelete: (service: PujaService) => void;
}

const ServiceCardView: React.FC<ServiceCardViewProps> = ({
    services,
    onView,
    onEdit,
    onDelete,
}) => {
    const { loading } = usePujaServiceStore();
    const theme = useTheme();

    // Loading skeleton
    if (loading) {
        return (
            <Grid container spacing={3}>
                {Array.from(new Array(8)).map((_, index) => (
                    <div
                        key={index}
                        className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 p-3"
                    >
                        <div className="flex flex-col h-[400px] bg-white rounded shadow">
                            <div className="h-[200px] bg-gray-200 animate-pulse rounded-t" />
                            <div className="flex-1 p-4 flex flex-col">
                                <div className="h-6 bg-gray-200 mb-2 rounded animate-pulse" />
                                <div className="h-10 bg-gray-200 mb-4 rounded animate-pulse" />
                                <div className="flex gap-2">
                                    <div className="h-6 w-16 bg-gray-200 rounded animate-pulse" />
                                    <div className="h-6 w-20 bg-gray-200 rounded animate-pulse" />
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </Grid>
        );
    }

    // Empty state
    if (services.length === 0) {
        return (
            <Box sx={{
                textAlign: 'center',
                py: 8,
                px: 2,
                bgcolor: 'background.paper',
                borderRadius: 2,
                border: '2px dashed',
                borderColor: 'divider'
            }}>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                    No services found
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Try adjusting your search or filters, or create a new service to get started.
                </Typography>
            </Box>
        );
    }

    return (
        <Grid container spacing={3}>
            {services.map((service) => {
                const serviceTypeOption = serviceTypeOptions.find(
                    option => option.value === service.type
                );

                const serviceTypeLabel = serviceTypeOption?.label || service.type;

                return (
                    <div
                        key={service.id}
                        className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 p-3"
                    >
                        <div
                            className="flex flex-col h-[400px] bg-white rounded shadow cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-lg relative overflow-hidden"
                            onClick={() => onView(service)}
                        >
                            {/* Image Section */}
                            <div className="relative overflow-hidden">
                                <Image
                                    src={getImageUrl(service.image_url)}
                                    alt={service.title}
                                    className="card-media h-[200px] w-full object-cover transition-transform duration-300 hover:scale-105"
                                    width={400}
                                    height={200}
                                />
                                {/* Status Badge */}
                                <span
                                    className={`absolute top-3 right-3 px-2 py-1 rounded text-xs font-semibold ${service.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                        }`}
                                >
                                    {service.is_active ? 'Active' : 'Inactive'}
                                </span>
                                {/* Service Type Badge */}
                                <span
                                    className="absolute top-3 left-3 px-2 py-1 rounded text-xs font-semibold bg-black/70 text-white flex items-center gap-1"
                                >
                                    {serviceTypeOption?.icon}
                                    {serviceTypeLabel}
                                </span>
                            </div>

                            {/* Content */}
                            <div className="flex-1 p-4 flex flex-col">
                                <h3 className="font-semibold mb-1 text-lg leading-tight line-clamp-2">
                                    {service.title}
                                </h3>
                                <p className="text-sm text-gray-600 mb-2 line-clamp-2 min-h-[40px]">
                                    {service.description}
                                </p>
                                {/* Info Chips */}
                                <div className="flex flex-row flex-wrap gap-2 mb-2">
                                    <span className="flex items-center gap-1 px-2 py-1 border rounded text-xs">
                                        <Category fontSize="small" />
                                        {service.category_detail?.name || 'No Category'}
                                    </span>
                                    <span className="flex items-center gap-1 px-2 py-1 border rounded text-xs">
                                        <AccessTime fontSize="small" />
                                        {formatDuration(service.duration_minutes)}
                                    </span>
                                </div>
                                {/* Metadata */}
                                <div className="flex justify-between items-center mt-auto">
                                    <span className="text-xs text-gray-400">ID: #{service.id}</span>
                                    <span className="text-xs text-gray-400">{formatDateTime(service.updated_at)}</span>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex justify-between items-center px-4 pt-0 pb-4">
                                <div className="flex gap-1">
                                    <Tooltip title="View Details">
                                        <IconButton
                                            size="small"
                                            color="primary"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onView(service);
                                            }}
                                            className="hover:bg-blue-50"
                                        >
                                            <Visibility fontSize="small" />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Edit Service">
                                        <IconButton
                                            size="small"
                                            color="primary"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onEdit(service);
                                            }}
                                            className="hover:bg-blue-50"
                                        >
                                            <Edit fontSize="small" />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Delete Service">
                                        <IconButton
                                            size="small"
                                            color="error"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onDelete(service);
                                            }}
                                            className="hover:bg-red-50"
                                        >
                                            <Delete fontSize="small" />
                                        </IconButton>
                                    </Tooltip>
                                </div>
                                <Button
                                    size="small"
                                    variant="outlined"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onView(service);
                                    }}
                                    className="min-w-fit text-xs rounded"
                                    sx={{ textTransform: 'none', borderRadius: 2 }}
                                >
                                    Details
                                </Button>
                            </div>
                        </div>
                    </div>
                );
            })}
        </Grid>
    );
};

export default ServiceCardView;
