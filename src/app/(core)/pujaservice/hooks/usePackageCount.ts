import { useState, useEffect } from 'react';
import apiClient from '../../../apiService/globalApiconfig';

interface PackageCountData {
  [serviceId: number]: {
    count: number;
    packages: Array<{ id: number; price: number; package_type: string }>;
  };
}

export const usePackageCount = (services: Array<{ id: number }>) => {
  const [packageCounts, setPackageCounts] = useState<PackageCountData>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPackageCounts = async () => {
      if (!services.length) return;
      
      setLoading(true);
      try {
        const promises = services.map(async (service) => {
          try {
            const response = await apiClient.get(`/puja/packages/?puja_service=${service.id}`);
            const packages = response.data.results || response.data || [];
            return {
              serviceId: service.id,
              count: packages.length,
              packages: packages.slice(0, 3).map((pkg: any) => ({
                id: pkg.id,
                price: pkg.price,
                package_type: pkg.package_type
              }))
            };
          } catch (error) {
            console.error(`Failed to fetch packages for service ${service.id}:`, error);
            return {
              serviceId: service.id,
              count: 0,
              packages: []
            };
          }
        });

        const results = await Promise.all(promises);
        const countsMap: PackageCountData = {};
        
        results.forEach(result => {
          countsMap[result.serviceId] = {
            count: result.count,
            packages: result.packages
          };
        });
        
        setPackageCounts(countsMap);
      } catch (error) {
        console.error('Failed to fetch package counts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPackageCounts();
  }, [services]);

  return { packageCounts, loading };
};
