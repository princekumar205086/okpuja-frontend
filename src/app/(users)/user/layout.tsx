"use client";
import PanelLayout from '@/app/components/layouts/PanelLayout';
import { RequireAuth } from '@/app/components/auth/RequireAuth';
import Breadcrumb from "@/app/components/ui/Breadcrumb";
import { usePathname } from "next/navigation";
import { Box } from "@mui/material";

export default function UserLayout({ children }: { children: React.ReactNode }) {
  // Get current path to determine which breadcrumb items to show
  const pathname = usePathname();

  // Build dynamic breadcrumb items based on current path
  const generateBreadcrumbItems = () => {
    // Handle null pathname case
    if (!pathname) {
      return [];
    }

    // Base paths we support
    const pathSegments = pathname.split('/').filter(Boolean);
    
    // Always start with home
    const items = [];
    
    // Add path segments as needed
    if (pathSegments.length >= 2) {
      // Add user segment
      if (pathSegments[0] === 'user') {
        // Add the current page/section
        if (pathSegments[1]) {
          const pageLabel = pathSegments[1].charAt(0).toUpperCase() + pathSegments[1].slice(1);
          items.push({
            label: pageLabel,
            href: `/${pathSegments[0]}/${pathSegments[1]}`,
            isCurrent: pathSegments.length === 2
          });
          
          // If there are additional segments (like item details, etc.)
          if (pathSegments.length > 2) {
            const detailLabel = pathSegments[2].charAt(0).toUpperCase() + pathSegments[2].slice(1);
            items.push({
              label: detailLabel,
              href: `/${pathSegments[0]}/${pathSegments[1]}/${pathSegments[2]}`,
              isCurrent: true
            });
          }
        }
      }
    }
    
    return items;
  };
  
  const breadcrumbItems = generateBreadcrumbItems();

  return (
    <RequireAuth requiredRole="user">
      <PanelLayout>
        {/* Breadcrumb with minimal padding */}
        <Box sx={{ pb: { xs: 0.5, sm: 1 } }}>
          <Breadcrumb items={breadcrumbItems} showHomeIcon={true} />
        </Box>
        
        {/* Content wrapper with minimal top padding */}
        <Box 
          component="main"
          sx={{ 
            pt: { xs: 0.5, sm: 1 },
            pb: { xs: 3, sm: 4 },
          }}
        >
          {children}
        </Box>
      </PanelLayout>
    </RequireAuth>
  );
}
