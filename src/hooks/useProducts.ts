import { useState, useEffect } from 'react';
import { Product } from '@/types';
import { config } from '@/lib/config';
import { apiGetData } from '@/lib/api';

interface UseProductsParams {
  categoryId?: string | null;
  search?: string;
}

const useProducts = ({ categoryId, search }: UseProductsParams = {}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        
        // Construir URL com parâmetros de query
        const url = new URL(`${config.menuApiBaseUrl}/api/menu`);
        
        if (categoryId) {
          url.searchParams.append('categoryId', categoryId);
        }
        
        if (search && search.trim()) {
          url.searchParams.append('search', search.trim());
        }
        
        const data = await apiGetData(url.toString());
        setProducts(data as Product[]);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar produtos');
        console.error('Erro ao buscar produtos:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categoryId, search]);

  return { products, loading, error };
};

export default useProducts;
