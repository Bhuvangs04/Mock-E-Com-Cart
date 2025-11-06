import { useEffect, useState, useMemo } from 'react';
import { ProductCard } from '@/components/ProductCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';

interface Product {
  id: number;
  name: string;
  price: number;
  image_url: string;
}

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';



export const ProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${API_BASE}/api/products`);
        if (response.ok) {
          const data = await response.json();
          setProducts(data);
        }
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);



  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary via-primary to-primary/90 py-20 text-center">
        <div className="container mx-auto px-4">
          <h1 className="mb-4 text-5xl font-bold text-primary-foreground">Welcome to VibeShop</h1>
          <p className="text-xl text-primary-foreground/90">Discover amazing products for your lifestyle</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 lg:grid-cols-1">
          <div>
            <div className="mb-8 flex items-center justify-between border-b border-border pb-4">
              <p className="text-sm text-muted-foreground">
                {loading ? (
                  'Loading products...'
                ) : (
                  <>
                    Showing{' '}
                    <span className="font-semibold text-foreground">{products.length}</span> products
                  </>
                )}
              </p>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="space-y-4">
                    <Skeleton className="aspect-square w-full rounded-lg" />
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-8 w-1/2" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-lg border border-border bg-card py-20 text-center">
                <div className="mb-4 text-6xl">🔍</div>
                <p className="mb-2 text-xl font-semibold text-foreground">No products found</p>
                <p className="text-muted-foreground">Try again later</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {products.map((product) => (
                  <ProductCard key={product.id} {...product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
