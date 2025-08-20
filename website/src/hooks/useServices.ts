import { useState, useEffect } from 'react';
import { servicesAPI, Service, ServiceCategory } from '../services/api/services';

interface UseServicesResult {
  services: Service[];
  categories: ServiceCategory[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useServices = (): UseServicesResult => {
  const [services, setServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch services (only active ones for public display)
      const servicesResponse = await servicesAPI.getServices(undefined, true);
      if (servicesResponse.data) {
        setServices(servicesResponse.data);
        // Extract unique categories from services
        const categoriesSet = new Set<string>();
        servicesResponse.data.forEach(service => {
          if (service.category) {
            categoriesSet.add(service.category);
          }
        });
        const categoriesData = Array.from(categoriesSet).map(category => ({
          value: category,
          label: category.charAt(0).toUpperCase() + category.slice(1).replace('_', ' ')
        }));
        setCategories([{ value: 'All', label: 'All Services' }, ...categoriesData]);
      } else {
        setServices([]);
        setCategories([{ value: 'All', label: 'All Services' }]);
      }
    } catch (err) {
      console.error('Error fetching services:', err);
      setError('Failed to load services. Please try again later.');
      setServices([]);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    services,
    categories,
    loading,
    error,
    refetch: fetchData,
  };
};
